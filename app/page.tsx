import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FinSentinelDashboard } from '@/components/fin-sentinel-dashboard'
import { auth } from '@/lib/auth'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <FinSentinelDashboard userName={session.user.name || 'there'} />
}
