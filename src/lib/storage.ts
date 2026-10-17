const MAJORITY_KEY = 'afterdark_majority_declared'
const SETTINGS_KEY = 'afterdark_settings'
const PLAYERS_KEY = 'afterdark_players'

export function getMajorityDeclared(): boolean {
  try {
    return localStorage.getItem(MAJORITY_KEY) === 'true'
  } catch {
    return false
  }
}

export function setMajorityDeclared(value: boolean) {
  try {
    localStorage.setItem(MAJORITY_KEY, value ? 'true' : 'false')
  } catch {
    // stockage indisponible : la déclaration ne sera simplement pas mémorisée
  }
}

export function resetMajorityDeclared() {
  try {
    localStorage.removeItem(MAJORITY_KEY)
  } catch {
    // ignore
  }
}

export function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export const STORAGE_KEYS = {
  settings: SETTINGS_KEY,
  players: PLAYERS_KEY,
  customCards: 'afterdark_custom_cards',
}
