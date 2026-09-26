'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, setToken, type AuthUser } from '@/lib/session-client'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError('All fields are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Password and confirm password must match.')
      return
    }

    setBusy(true)
    try {
      const result = await apiFetch<{ token: string; user: AuthUser }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      })
      setToken(result.token)
      router.push('/onboarding')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create your account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">FS</div>
        <p className="eyebrow">FIN SENTINEL</p>
        <h1>Create your workspace.</h1>
        <p className="auth-copy">Sign up to keep your repayment picture private and user-specific.</p>
        <form onSubmit={submit}>
          <label>
            Full name
            <input required value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
          </label>
          <label>
            Email
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
          </label>
          <label>
            Confirm password
            <input type="password" required minLength={8} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <a href="/sign-in">Sign in</a></p>
      </section>
    </main>
  )
}
