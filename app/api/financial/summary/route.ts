import { NextResponse } from 'next/server'
import { db, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getOwnedProfile, unauthorizedResponse } from '@/lib/financial-access'

export async function GET() {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()

  const defaults = [
    { suffix: 'lp', lender: 'LazyPay', product: 'BNPL repayment', amount: 1500, dueDay: 12, status: 'Due', sourceCount: 3, color: '#44d7a8' },
    { suffix: 'apl', lender: 'Amazon Pay Later', product: 'Shopping EMI', amount: 2500, dueDay: 18, status: 'Due', sourceCount: 2, color: '#7aa7ff' },
    { suffix: 'kb', lender: 'KreditBee', product: 'Instant loan EMI', amount: 3000, dueDay: 24, status: 'Due', sourceCount: 3, color: '#f4b860' },
    { suffix: 'slice', lender: 'Slice', product: 'Card bill', amount: 2000, dueDay: 5, status: 'Paid', sourceCount: 2, color: '#b48cff' },
    { suffix: 'hdfc', lender: 'HDFC Bank', product: 'Personal loan EMI', amount: 1500, dueDay: 30, status: 'Due', sourceCount: 2, color: '#ef8b8b' },
  ]
  await db.insert(obligationsTable).values(defaults.map(({ suffix, ...item }) => ({ ...item, id: `${profile.id}-${suffix}`, profileId: profile.id }))).onConflictDoNothing()
  const obligations = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, profile.id))
  const total = obligations.reduce((sum, item) => sum + item.amount, 0)
  const currentDti = total / profile.monthlyIncome * 100
  return NextResponse.json({ monthly_income: profile.monthlyIncome, total_existing_commitments: total, current_dti: currentDti, risk_status: currentDti > profile.safetyThreshold ? 'AT_RISK' : 'HEALTHY', dti_threshold: profile.safetyThreshold })
}
