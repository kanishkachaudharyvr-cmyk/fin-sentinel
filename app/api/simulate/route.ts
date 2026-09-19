import { NextResponse } from 'next/server'
import { db, profiles, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const emi = Number(body.proposed_emi)
  if (!Number.isFinite(emi) || emi < 0 || emi > 100000) return NextResponse.json({ error: 'Invalid EMI' }, { status: 400 })
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, 'demo-kanishka')).limit(1)
  const rows = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, 'demo-kanishka'))
  const commitments = rows.reduce((sum, item) => sum + item.amount, 0) || 10500
  const projected = (commitments + emi) / (profile?.monthlyIncome || 35000) * 100
  const threshold = profile?.safetyThreshold || 40
  return NextResponse.json({ projected_dti: projected, threshold_delta: projected - threshold, warning_reasons: projected > threshold ? ['Projected DTI exceeds the safety threshold.'] : [], risk_status: projected > threshold ? 'AT_RISK' : 'HEALTHY' })
}
