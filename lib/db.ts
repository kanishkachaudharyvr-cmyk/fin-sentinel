import { drizzle } from 'drizzle-orm/node-postgres'
import { pgTable, text, integer, date, timestamp } from 'drizzle-orm/pg-core'
import { Pool } from 'pg'

export const profiles = pgTable('fin_sentinel_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  monthlyIncome: integer('monthly_income').notNull(),
  safetyThreshold: integer('safety_threshold').notNull(),
})

export const obligationsTable = pgTable('fin_sentinel_obligations', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  lender: text('lender').notNull(),
  product: text('product').notNull(),
  amount: integer('amount').notNull(),
  dueDay: integer('due_day').notNull(),
  status: text('status').notNull(),
  sourceCount: integer('source_count').notNull(),
  color: text('color').notNull(),
})

export const deviceEmiRecords = pgTable('fin_sentinel_device_emi_records', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').notNull(),
  source: text('source').notNull(),
  packageName: text('package_name'),
  amount: integer('amount').notNull(),
  dueDate: date('due_date').notNull(),
  notificationText: text('notification_text').notNull(),
  detectedAt: timestamp('detected_at').notNull(),
  createdAt: timestamp('created_at').notNull(),
})

const globalForDb = globalThis as unknown as { finSentinelPool?: Pool }
export const pool = globalForDb.finSentinelPool ?? new Pool({
  connectionString:
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.DATABASE_URL,
})
if (process.env.NODE_ENV !== 'production') globalForDb.finSentinelPool = pool
export const db = drizzle(pool)
