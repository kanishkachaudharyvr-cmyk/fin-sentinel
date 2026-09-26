'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch, getToken, type AuthUser } from '@/lib/session-client'

export default function OnboardingPage() {
  const router = useRouter()
  const [income, setIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [savings, setSavings] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      router.replace('/sign-in')
      return
    }
    void apiFetch<AuthUser>('/api/auth/me').catch(() => {
      router.replace('/sign-in')
    })
  }, [router])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const monthlyIncome = Number(income.replace(/,/g, ''))
    if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) {
      setError('Enter your monthly net income.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await apiFetch('/api/financial/profile', {
        method: 'POST',
        body: JSON.stringify({
          monthly_income: monthlyIncome,
          monthly_expenses: Number(expenses.replace(/,/g, '')) || 0,
          savings: Number(savings.replace(/,/g, '')) || 0,
        }),
      })
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your financial profile.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">FS</div>
        <p className="eyebrow">FIN SENTINEL</p>
        <h1>Let&apos;s understand your finances</h1>
        <p className="auth-copy">This helps FIN SENTINEL calculate your financial health.</p>
        <form onSubmit={submit}>
          <label>
            Monthly net income
            <input
              required
              inputMode="numeric"
              placeholder="₹ 35,000"
              value={income}
              onChange={(event) => setIncome(event.target.value)}
            />
          </label>
          <label>
            Existing monthly expenses <span className="auth-optional">(optional)</span>
            <input
              inputMode="numeric"
              placeholder="₹ 0"
              value={expenses}
              onChange={(event) => setExpenses(event.target.value)}
            />
          </label>
          <label>
            Savings amount <span className="auth-optional">(optional)</span>
            <input
              inputMode="numeric"
              placeholder="₹ 0"
              value={savings}
              onChange={(event) => setSavings(event.target.value)}
            />
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="auth-submit" disabled={busy}>{busy ? 'Saving…' : 'Save and open dashboard'}</button>
        </form>
      </section>
    </main>
  )
}
