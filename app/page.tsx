'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FinSentinelDashboard } from '@/components/fin-sentinel-dashboard'
import { apiFetch, clearToken, getToken, type AuthUser } from '@/lib/session-client'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/sign-in')
      return
    }
    void apiFetch<AuthUser>('/api/auth/me')
      .then((current) => {
        if (!current.onboarding_completed) {
          router.replace('/onboarding')
          return
        }
        setUser(current)
      })
      .catch(() => {
        clearToken()
        router.replace('/sign-in')
      })
      .finally(() => setChecking(false))
  }, [router])

  if (checking || !user) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-mark">FS</div>
          <p className="eyebrow">FIN SENTINEL</p>
          <h1>Loading workspace…</h1>
        </section>
      </main>
    )
  }

  return <FinSentinelDashboard user={user} />
}
