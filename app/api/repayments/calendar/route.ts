import { NextResponse } from 'next/server'
import { db, obligationsTable } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function GET() {
  const rows = await db.select().from(obligationsTable).where(eq(obligationsTable.profileId, 'demo-kanishka'))
  return NextResponse.json(rows.map((item) => ({ day: item.dueDay, amount: item.amount, lender: item.lender, color: item.color })))
}
