'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setBusy(true)

    const result = await authClient.signUp(
      email,
      password,
      name
    )

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

        <h1>Build your safety net.</h1>

        <p className="auth-copy">
          Create a private workspace for your repayment health.
        </p>

        <form onSubmit={submit}>
          <label>
            Name
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
            />
          </label>

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
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 8 characters"
            />
          </label>

          <label>
            Confirm password
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Enter password again"
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
            {busy ? 'Creating…' : 'Create workspace'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <a href="/sign-in">Sign in</a>
        </p>
      </section>
    </main>
  )
}