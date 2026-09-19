import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { query = '' } = await request.json().catch(() => ({}))
  const normalized = String(query).toLowerCase()
  if (normalized.includes('emi') || normalized.includes('payment') || normalized.includes('repay')) return NextResponse.json({ answer: 'Your next tracked payment is ₹1,500 to LazyPay on 12 June. Your current commitment is ₹10,500 per month.' })
  return NextResponse.json({ answer: 'FIN SENTINEL found 5 linked obligations and a healthy current DTI. Ask about your next EMI, payment dates, or repayment risk.' })
}
