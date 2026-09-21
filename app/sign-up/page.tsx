'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(''); const result = await authClient.signUp.email({ name, email, password }); if (result.error) setError('Unable to create your account. Try another email.'); else { router.push('/'); router.refresh() } setBusy(false) }
  return <main className="auth-page"><section className="auth-card"><div className="brand-mark">FS</div><p className="eyebrow">FIN SENTINEL</p><h1>Build your safety net.</h1><p className="auth-copy">Create a private workspace for your repayment health.</p><form onSubmit={submit}><label>Name<input required value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button className="auth-submit" disabled={busy}>{busy ? 'Creating…' : 'Create workspace'}</button></form><p className="auth-switch">Already have an account? <a href="/sign-in">Sign in</a></p></section></main>
}
