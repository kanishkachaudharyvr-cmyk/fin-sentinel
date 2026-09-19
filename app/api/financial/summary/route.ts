import { NextResponse } from 'next/server'
import { db, profiles, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET() {
  const profile = await db.select().from(profiles).where(eq(profiles.id, 'demo-kanishka')).limit(1)
  if (!profile[0]) await db.insert(profiles).values({ id: 'demo-kanishka', name: 'Kanishka', monthlyIncome: 35000, safetyThreshold: 40 }).onConflictDoNothing()
  const [current] = profile[0] ? profile : await db.select().from(profiles).where(eq(profiles.id, 'demo-kanishka')).limit(1)
  await db.insert(obligationsTable).values([
    { id: 'lp', profileId: 'demo-kanishka', lender: 'LazyPay', product: 'BNPL repayment', amount: 1500, dueDay: 12, status: 'Due', sourceCount: 3, color: '#44d7a8' },
    { id: 'apl', profileId: 'demo-kanishka', lender: 'Amazon Pay Later', product: 'Shopping EMI', amount: 2500, dueDay: 18, status: 'Due', sourceCount: 2, color: '#7aa7ff' },
    { id: 'kb', profileId: 'demo-kanishka', lender: 'KreditBee', product: 'Instant loan EMI', amount: 3000, dueDay: 24, status: 'Due', sourceCount: 3, color: '#f4b860' },
    { id: 'slice', profileId: 'demo-kanishka', lender: 'Slice', product: 'Card bill', amount: 2000, dueDay: 5, status: 'Paid', sourceCount: 2, color: '#b48cff' },
    { id: 'hdfc', profileId: 'demo-kanishka', lender: 'HDFC Bank', product: 'Personal loan EMI', amount: 1500, dueDay: 30, status: 'Due', sourceCount: 2, color: '#ef8b8b' },
  ]).onConflictDoNothing()
  const obligations = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, 'demo-kanishka'))
  const total = obligations.reduce((sum, item) => sum + item.amount, 0) || 10500
  return NextResponse.json({ monthly_income: current.monthlyIncome, total_existing_commitments: total, current_dti: total / current.monthlyIncome * 100, risk_status: total / current.monthlyIncome * 100 > current.safetyThreshold ? 'AT_RISK' : 'HEALTHY', dti_threshold: current.safetyThreshold })
}
