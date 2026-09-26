'use client'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || ''

export const authClient = {
  async signUp(email: string, password: string, name: string) {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name,
        email,
        password,
        confirm_password: password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        data: null,
        error: data?.detail || 'Unable to create your account.',
      }
    }

    return {
      data,
      error: null,
    }
  },

  async signIn(email: string, password: string) {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        data: null,
        error: data?.detail || 'Invalid email or password.',
      }
    }

    return {
      data,
      error: null,
    }
  },

  async getMe() {
    const response = await fetch(`${API_BASE}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    })

    if (!response.ok) {
      return {
        data: null,
        error: 'Not authenticated',
      }
    }

    const data = await response.json()

    return {
      data,
      error: null,
    }
  },

  async signOut() {
    const response = await fetch(`${API_BASE}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      return {
        data: null,
        error: 'Unable to sign out.',
      }
    }

    return {
      data: await response.json(),
      error: null,
    }
  },
}