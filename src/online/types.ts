import type { Attraction, Card, CardKind, CategoryId, Gender } from '../types/game'

export type RoomStatus = 'lobby' | 'playing' | 'ended'
export type TurnStatus = 'idle' | 'awaiting_response' | 'resolved'

export interface RoomSettings {
  allowedCategories: CategoryId[]
  maxIntensity: 1 | 2 | 3 | 4 | 5
  specialCardsEnabled: boolean
  drawMode: 'alterne' | 'aleatoire'
}

export type RoomResponse = { type: 'text'; value: string } | { type: 'done' } | { type: 'joker' }

export interface RoomHistoryEntry {
  turnNumber: number
  askerSlot: 0 | 1
  targetSlot: 0 | 1
  cardId: string
  categoryId: CategoryId
  kind: CardKind
  text: string
  response: RoomResponse | null
  at: string
}

export interface RoomRow {
  id: string
  created_at: string
  updated_at: string
  status: RoomStatus
  settings: RoomSettings
  asker_slot: 0 | 1
  turn_number: number
  turns_played: [number, number]
  jokers_used: [number, number]
  played_ids: string[]
  excluded_ids: string[]
  last_category: CategoryId | null
  turn_status: TurnStatus
  card: Card | null
  response: RoomResponse | null
  history: RoomHistoryEntry[]
}

export interface RoomPlayerRow {
  room_id: string
  slot: 0 | 1
  name: string
  gender: Gender
  attraction: Attraction
  ready: boolean
  last_seen: string
}
