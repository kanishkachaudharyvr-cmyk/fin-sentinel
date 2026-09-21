import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db, profiles } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function getOwnedProfile() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const userId = session.user.id
  const [existing] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1)
  if (existing) return existing

  const [created] = await db.insert(profiles).values({
    id: userId,
    name: session.user.name || 'Personal workspace',
    monthlyIncome: 35000,
    safetyThreshold: 40,
  }).onConflictDoNothing().returning()

  if (created) return created
  const [retried] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1)
  return retried ?? null
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Authentication required' }, { status: 401 })
}

export function isValidNonNegativeNumber(value: unknown, max = 100000) {
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 && number <= max
}

export function getProfileId(profile: { id: string }) {
  return profile.id
}

export function getProfileDefaults(profile: { monthlyIncome: number; safetyThreshold: number }) {
  return { monthlyIncome: profile.monthlyIncome, safetyThreshold: profile.safetyThreshold }
}

export function normalizeQuestion(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 500) : ''
}
