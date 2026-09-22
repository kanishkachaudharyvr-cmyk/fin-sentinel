import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getOwnedProfile, unauthorizedResponse } from '@/lib/financial-access'
import { sql } from 'drizzle-orm'

const isoDate = /^\d{4}-\d{2}-\d{2}$/

export async function GET() {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()

  const result = await db.execute(sql`
    SELECT id, source, package_name, amount, due_date, notification_text, detected_at, created_at
    FROM fin_sentinel_device_emi_records
    WHERE profile_id = ${profile.id}
    ORDER BY due_date ASC, detected_at DESC
  `)
  const records = result.rows.map((row) => ({
    id: row.id,
    source: row.source,
    packageName: row.package_name,
    amount: Number(row.amount),
    dueDate: row.due_date,
    notificationText: row.notification_text,
    detectedAt: row.detected_at,
    provenance: 'Detected from device notification',
  }))

  return NextResponse.json({
    records,
    deviceStatus: records.length ? 'Device connected' : 'Waiting for notification data',
    lastSynced: records[0]?.detectedAt ?? null,
  })
}

export async function POST(request: Request) {
  const profile = await getOwnedProfile()
  if (!profile) return unauthorizedResponse()

  let body: Record<string, unknown>
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }

  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 120) : ''
  const packageName = typeof body.packageName === 'string' ? body.packageName.trim().slice(0, 180) : null
  const notificationText = typeof body.notificationText === 'string' ? body.notificationText.trim().slice(0, 2000) : ''
  const amount = Number(body.amount)
  const dueDate = typeof body.dueDate === 'string' ? body.dueDate : ''
  const detectedAt = typeof body.detectedAt === 'string' ? body.detectedAt : new Date().toISOString()

  if (!source || !notificationText || !Number.isInteger(amount) || amount <= 0 || amount > 10_000_000 || !isoDate.test(dueDate) || Number.isNaN(Date.parse(detectedAt))) {
    return NextResponse.json({ error: 'source, notificationText, positive integer amount, ISO dueDate, and valid detectedAt are required' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const result = await db.execute(sql`
    INSERT INTO fin_sentinel_device_emi_records (id, profile_id, source, package_name, amount, due_date, notification_text, detected_at)
    VALUES (${id}, ${profile.id}, ${source}, ${packageName}, ${amount}, ${dueDate}::date, ${notificationText}, ${detectedAt}::timestamp)
    ON CONFLICT (profile_id, source, amount, due_date, notification_text)
    DO UPDATE SET detected_at = EXCLUDED.detected_at
    RETURNING id, source, package_name, amount, due_date, notification_text, detected_at
  `)
  const row = result.rows[0]
  return NextResponse.json({
    id: row.id,
    source: row.source,
    packageName: row.package_name,
    amount: Number(row.amount),
    dueDate: row.due_date,
    notificationText: row.notification_text,
    detectedAt: row.detected_at,
    provenance: 'Detected from device notification',
  }, { status: 201 })
}
