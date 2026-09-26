'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setBusy(true)

    const result = await authClient.signIn(email, password)

    if (result.error) {
      setError(result.error)
      setBusy(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">FS</div>

        <p className="eyebrow">FIN SENTINEL</p>

        <h1>Welcome back.</h1>

        <p className="auth-copy">
          Sign in to view your repayment health and financial safety.
        </p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={busy}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <a href="/sign-up">Create an account</a>
        </p>
      </section>
    </main>
  )
}