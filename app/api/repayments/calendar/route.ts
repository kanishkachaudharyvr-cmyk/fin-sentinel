import { NextResponse } from 'next/server'
import { db, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { getOwnedProfile, unauthorizedResponse } from '@/lib/financial-access'

export async function GET() {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()
  const rows = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, profile.id))
  return NextResponse.json(rows.map((item) => ({ day: item.dueDay, amount: item.amount, lender: item.lender, color: item.color, status: item.status, sourceCount: item.sourceCount })))
}
