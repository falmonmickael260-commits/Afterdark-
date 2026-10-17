import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { Attraction, CardKind, Gender } from '../types/game'
import type { RoomPlayerRow, RoomResponse, RoomRow, RoomSettings } from './types'
import { isOnlineConfigured, supabase } from './supabaseClient'
import { generateRoomCode } from './roomCode'
import { ALL_CARDS } from '../data/cards'
import { drawCard, filterPool } from '../lib/deck'
import { loadJSON, saveJSON } from '../lib/storage'

const SESSION_KEY = 'afterdark_online_session'
const TURNS_PER_JOKER = 5

export interface OnlineProfileDraft {
  name: string
  gender: Gender
  attraction: Attraction
}

const DEFAULT_SETTINGS: RoomSettings = {
  allowedCategories: ['flirt', 'genant', 'complices'],
  maxIntensity: 3,
  specialCardsEnabled: true,
  drawMode: 'alterne',
}

interface StoredSession {
  roomId: string
  slot: 0 | 1
}

export function useOnlineRoom() {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [mySlot, setMySlot] = useState<0 | 1 | null>(null)
  const [room, setRoom] = useState<RoomRow | null>(null)
  const [players, setPlayers] = useState<[RoomPlayerRow | null, RoomPlayerRow | null]>([null, null])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)

  const refreshRoom = useCallback(async (id: string) => {
    if (!supabase) return
    const { data } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle()
    if (data) setRoom(data as RoomRow)
  }, [])

  const refreshPlayers = useCallback(async (id: string) => {
    if (!supabase) return
    const { data } = await supabase.from('room_players').select('*').eq('room_id', id)
    if (data) {
      const next: [RoomPlayerRow | null, RoomPlayerRow | null] = [null, null]
      for (const row of data as RoomPlayerRow[]) {
        next[row.slot] = row
      }
      setPlayers(next)
    }
  }, [])

  const subscribe = useCallback(
    (id: string) => {
      if (!supabase) return
      channelRef.current?.unsubscribe()
      const channel = supabase
        .channel(`room-${id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${id}` },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              setRoom(null)
            } else {
              setRoom(payload.new as RoomRow)
            }
          },
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'room_players', filter: `room_id=eq.${id}` },
          () => {
            refreshPlayers(id)
          },
        )
        .subscribe()
      channelRef.current = channel
    },
    [refreshPlayers],
  )

  useEffect(() => {
    const saved = loadJSON<StoredSession>(SESSION_KEY)
    if (saved && supabase) {
      setRoomId(saved.roomId)
      setMySlot(saved.slot)
      refreshRoom(saved.roomId)
      refreshPlayers(saved.roomId)
      subscribe(saved.roomId)
    }
    return () => {
      channelRef.current?.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const persistSession = (id: string, slot: 0 | 1) => {
    saveJSON(SESSION_KEY, { roomId: id, slot } satisfies StoredSession)
  }

  const createRoom = useCallback(
    async (profile: OnlineProfileDraft) => {
      if (!supabase) {
        setError("Le mode en ligne n'est pas configuré sur cet appareil.")
        return null
      }
      setBusy(true)
      setError(null)
      try {
        let code = generateRoomCode()
        for (let attempt = 0; attempt < 5; attempt++) {
          const { data: existing } = await supabase.from('rooms').select('id').eq('id', code).maybeSingle()
          if (!existing) break
          code = generateRoomCode()
        }

        const { error: roomErr } = await supabase.from('rooms').insert({
          id: code,
          settings: DEFAULT_SETTINGS,
        })
        if (roomErr) throw roomErr

        const { error: playerErr } = await supabase.from('room_players').insert({
          room_id: code,
          slot: 0,
          name: profile.name,
          gender: profile.gender,
          attraction: profile.attraction,
          ready: true,
        })
        if (playerErr) throw playerErr

        setRoomId(code)
        setMySlot(0)
        persistSession(code, 0)
        await refreshRoom(code)
        await refreshPlayers(code)
        subscribe(code)
        return code
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Impossible de créer la room.')
        return null
      } finally {
        setBusy(false)
      }
    },
    [refreshRoom, refreshPlayers, subscribe],
  )

  const joinRoom = useCallback(
    async (code: string, profile: OnlineProfileDraft) => {
      if (!supabase) {
        setError("Le mode en ligne n'est pas configuré sur cet appareil.")
        return false
      }
      setBusy(true)
      setError(null)
      try {
        const roomCode = code.trim().toUpperCase()
        const { data: existingRoom } = await supabase.from('rooms').select('*').eq('id', roomCode).maybeSingle()
        if (!existingRoom) {
          setError("Aucune room ne correspond à ce code.")
          return false
        }

        const { data: existingPlayers } = await supabase.from('room_players').select('*').eq('room_id', roomCode)
        const slotTaken = new Set((existingPlayers ?? []).map((p) => p.slot))

        let slot: 0 | 1
        const saved = loadJSON<StoredSession>(SESSION_KEY)
        if (saved && saved.roomId === roomCode && slotTaken.has(saved.slot)) {
          slot = saved.slot
        } else if (!slotTaken.has(1)) {
          slot = 1
        } else if (!slotTaken.has(0)) {
          slot = 0
        } else {
          setError('Cette room a déjà deux joueurs.')
          return false
        }

        const { error: upsertErr } = await supabase.from('room_players').upsert({
          room_id: roomCode,
          slot,
          name: profile.name,
          gender: profile.gender,
          attraction: profile.attraction,
          ready: true,
        })
        if (upsertErr) throw upsertErr

        setRoomId(roomCode)
        setMySlot(slot)
        persistSession(roomCode, slot)
        await refreshRoom(roomCode)
        await refreshPlayers(roomCode)
        subscribe(roomCode)
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Impossible de rejoindre la room.')
        return false
      } finally {
        setBusy(false)
      }
    },
    [refreshRoom, refreshPlayers, subscribe],
  )

  const leaveRoom = useCallback(() => {
    channelRef.current?.unsubscribe()
    channelRef.current = null
    setRoomId(null)
    setMySlot(null)
    setRoom(null)
    setPlayers([null, null])
    saveJSON(SESSION_KEY, null)
  }, [])

  const updateSettings = useCallback(
    async (patch: Partial<RoomSettings>) => {
      if (!supabase || !roomId || !room) return
      const next = { ...room.settings, ...patch }
      await supabase.from('rooms').update({ settings: next, updated_at: new Date().toISOString() }).eq('id', roomId)
    },
    [roomId, room],
  )

  const startGame = useCallback(async () => {
    if (!supabase || !roomId) return
    await supabase
      .from('rooms')
      .update({
        status: 'playing',
        asker_slot: 0,
        turn_number: 1,
        turns_played: [0, 0],
        jokers_used: [0, 0],
        played_ids: [],
        excluded_ids: [],
        last_category: null,
        turn_status: 'idle',
        card: null,
        response: null,
        history: [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', roomId)
  }, [roomId])

  const pool = useMemo(() => {
    if (!room) return []
    return filterPool(ALL_CARDS, {
      allowedCategories: room.settings.allowedCategories,
      maxIntensity: room.settings.maxIntensity,
      includeSpecial: room.settings.specialCardsEnabled,
    })
  }, [room])

  const availableJokers = useMemo<[number, number]>(() => {
    if (!room) return [0, 0]
    return [
      Math.max(0, Math.floor(room.turns_played[0] / TURNS_PER_JOKER) - room.jokers_used[0]),
      Math.max(0, Math.floor(room.turns_played[1] / TURNS_PER_JOKER) - room.jokers_used[1]),
    ]
  }, [room])

  const isAsker = room !== null && mySlot !== null && room.asker_slot === mySlot
  const targetSlot = room ? ((1 - room.asker_slot) as 0 | 1) : null
  const isTarget = room !== null && mySlot !== null && targetSlot === mySlot

  const drawForTurn = useCallback(
    async (kind: CardKind, rerollCardId?: string) => {
      if (!supabase || !roomId || !room) return
      const kindPool = pool.filter((c) => !c.special && c.type === kind).concat(pool.filter((c) => c.special))
      const played = new Set(room.played_ids)
      const excluded = new Set(room.excluded_ids)
      if (rerollCardId) excluded.add(rerollCardId)
      const result = drawCard(kindPool, played, excluded, room.last_category)

      const nextPlayed = result.card ? [...room.played_ids, result.card.id] : room.played_ids
      const nextExcluded = rerollCardId ? [...room.excluded_ids, rerollCardId] : room.excluded_ids

      await supabase
        .from('rooms')
        .update({
          card: result.card,
          turn_status: 'awaiting_response',
          response: null,
          played_ids: nextPlayed,
          excluded_ids: nextExcluded,
          last_category: result.card ? result.card.category : room.last_category,
          updated_at: new Date().toISOString(),
        })
        .eq('id', roomId)
    },
    [roomId, room, pool],
  )

  const askerChoose = useCallback((kind: CardKind) => drawForTurn(kind), [drawForTurn])

  const targetRequestAnother = useCallback(async () => {
    if (!room?.card) return
    await drawForTurn(room.card.type, room.card.id)
  }, [room, drawForTurn])

  const submitResponse = useCallback(
    async (response: RoomResponse) => {
      if (!supabase || !roomId || !room || mySlot === null) return
      const nextTurnsPlayed: [number, number] = [...room.turns_played] as [number, number]
      nextTurnsPlayed[mySlot] += 1
      const nextJokersUsed: [number, number] = [...room.jokers_used] as [number, number]
      if (response.type === 'joker') nextJokersUsed[mySlot] += 1

      const historyEntry = {
        turnNumber: room.turn_number,
        askerSlot: room.asker_slot,
        targetSlot: mySlot,
        cardId: room.card?.id ?? '',
        categoryId: room.card?.category ?? 'flirt',
        kind: room.card?.type ?? 'verite',
        text: room.card?.text ?? '',
        response,
        at: new Date().toISOString(),
      }

      await supabase
        .from('rooms')
        .update({
          turn_status: 'resolved',
          response,
          turns_played: nextTurnsPlayed,
          jokers_used: nextJokersUsed,
          history: [...room.history, historyEntry],
          updated_at: new Date().toISOString(),
        })
        .eq('id', roomId)
    },
    [roomId, room, mySlot],
  )

  const nextTurn = useCallback(async () => {
    if (!supabase || !roomId || !room) return
    const nextAsker: 0 | 1 =
      room.settings.drawMode === 'aleatoire'
        ? (Math.random() < 0.5 ? 0 : 1)
        : ((1 - room.asker_slot) as 0 | 1)

    await supabase
      .from('rooms')
      .update({
        asker_slot: nextAsker,
        turn_number: room.turn_number + 1,
        turn_status: 'idle',
        card: null,
        response: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roomId)
  }, [roomId, room])

  const endRoom = useCallback(async () => {
    if (!supabase || !roomId) return
    await supabase.from('rooms').update({ status: 'ended', updated_at: new Date().toISOString() }).eq('id', roomId)
  }, [roomId])

  return {
    configured: isOnlineConfigured,
    roomId,
    mySlot,
    room,
    players,
    myProfile: mySlot !== null ? players[mySlot] : null,
    otherProfile: mySlot !== null ? players[(1 - mySlot) as 0 | 1] : null,
    error,
    busy,
    createRoom,
    joinRoom,
    leaveRoom,
    updateSettings,
    startGame,
    availableJokers,
    isAsker,
    isTarget,
    askerChoose,
    targetRequestAnother,
    submitResponse,
    nextTurn,
    endRoom,
  }
}

export type OnlineRoomEngine = ReturnType<typeof useOnlineRoom>
