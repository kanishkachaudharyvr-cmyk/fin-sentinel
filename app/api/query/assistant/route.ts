import { NextResponse } from 'next/server'
import { db, obligationsTable } from '@/lib/db'
import { asc, eq } from 'drizzle-orm'
import { getOwnedProfile, normalizeQuestion, unauthorizedResponse } from '@/lib/financial-access'

export async function POST(request: Request) {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()
  const body = await request.json().catch(() => ({}))
  const query = normalizeQuestion(body.query)
  if (!query) return NextResponse.json({ error: 'Question is required' }, { status: 400 })

  const obligations = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, profile.id)).orderBy(asc(obligationsTable.dueDay))
  const nextPayment = obligations.find((item) => item.status !== 'Paid') ?? obligations[0]
  const total = obligations.reduce((sum, item) => sum + item.amount, 0)
  const normalized = query.toLowerCase()
  if (nextPayment && (normalized.includes('emi') || normalized.includes('payment') || normalized.includes('repay') || normalized.includes('अगली'))) {
    return NextResponse.json({ answer: `Your next tracked payment is ₹${nextPayment.amount.toLocaleString('en-IN')} to ${nextPayment.lender} on ${nextPayment.dueDay} June. Your current commitment is ₹${total.toLocaleString('en-IN')} per month.` })
  }
  return NextResponse.json({ answer: `FIN SENTINEL found ${obligations.length} linked obligations and ${total > profile.monthlyIncome * profile.safetyThreshold / 100 ? 'a repayment risk' : 'a healthy current DTI'}. Ask about your next EMI, payment dates, or repayment risk.` })
}
