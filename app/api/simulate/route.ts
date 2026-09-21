import { NextResponse } from 'next/server'
import { db, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getOwnedProfile, unauthorizedResponse, isValidNonNegativeNumber } from '@/lib/financial-access'

export async function POST(request: Request) {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()
  const body = await request.json().catch(() => ({}))
  if (!isValidNonNegativeNumber(body.proposed_emi)) return Response.json({ error: 'Invalid EMI' }, { status: 400 })
  const emi = Number(body.proposed_emi)
  const rows = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, profile.id))
  const commitments = rows.reduce((sum, item) => sum + item.amount, 0)
  const projected = (commitments + emi) / profile.monthlyIncome * 100
  const threshold = profile.safetyThreshold
  return Response.json({ projected_dti: projected, threshold_delta: projected - threshold, warning_reasons: projected > threshold ? ['Projected DTI exceeds the safety threshold.'] : [], risk_status: projected > threshold ? 'AT_RISK' : 'HEALTHY' })
}
