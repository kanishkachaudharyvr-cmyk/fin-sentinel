export const TOKEN_KEY = 'fin-sentinel-token'

export type AuthUser = {
  id: number
  name: string
  email: string
  onboarding_completed: boolean
}

export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:8000'
}

export function getToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY)
}

export function authHeaders(extra?: HeadersInit): HeadersInit {
  const token = getToken()
  return {
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBase()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(init?.headers),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message =
      typeof data?.detail === 'string'
        ? data.detail
        : Array.isArray(data?.detail)
          ? data.detail[0]?.msg || 'Request failed'
          : `Request failed (${response.status})`
    throw new Error(message)
  }
  return data as T
}

export function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || fullName
}

export function initialsFromName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'FS'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}
