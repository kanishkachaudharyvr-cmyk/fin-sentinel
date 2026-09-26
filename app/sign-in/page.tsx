'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, setToken, type AuthUser } from '@/lib/session-client'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const result = await apiFetch<{ token: string; user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(result.token)
      router.push(result.user.onboarding_completed ? '/' : '/onboarding')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Check your email and password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">FS</div>
        <p className="eyebrow">FIN SENTINEL</p>
        <h1>Welcome back.</h1>
        <p className="auth-copy">Sign in to your private repayment workspace.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">New here? <a href="/sign-up">Create an account</a></p>
      </section>
    </main>
  )
}
