import { NextResponse } from 'next/server'
import { db, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getOwnedProfile, unauthorizedResponse } from '@/lib/financial-access'

export async function GET() {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()

  const obligations = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, profile.id))
  const total = obligations.reduce((sum, item) => sum + item.amount, 0)
  const currentDti = total / profile.monthlyIncome * 100
  return NextResponse.json({ monthly_income: profile.monthlyIncome, total_existing_commitments: total, current_dti: currentDti, risk_status: currentDti > profile.safetyThreshold ? 'AT_RISK' : 'HEALTHY', dti_threshold: profile.safetyThreshold })
}
