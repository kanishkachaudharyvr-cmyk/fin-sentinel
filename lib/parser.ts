import type { LoanStatus, Notification } from './fin-sentinel-data'

export type ParsedEvent = {
  notificationId: string
  lender: string
  amount: number | null
  dueDay: number | null
  status: LoanStatus
  language: Notification['language']
  eventId: string
  confidence: number
}

const lenderAliases: Record<string, string> = {
  'amazon pay later': 'Amazon Pay Later',
  'hdfc bank': 'HDFC Bank',
  kreditbee: 'KreditBee',
  lazypay: 'LazyPay',
  slice: 'Slice',
}

export function parseNotification(notification: Notification): ParsedEvent {
  const text = notification.message.toLowerCase()
  const amountMatch = text.match(/(?:₹|rs\.?\s*)\s?([\d,]+)/i)
  const dateMatch = text.match(/(?:by|on|ko|रोजी|due\s+on|payable\s+by)\s+(?:(?:june|jun)\s+)?(\d{1,2})/i) ?? text.match(/(\d{1,2})[\/-](?:06|june)/i)
  const status: LoanStatus = /paid|received|successful/.test(text) ? 'Paid' : /disbursed|activated/.test(text) ? 'Disbursed' : 'Due'
  const lenderKey = Object.keys(lenderAliases).find((key) => text.includes(key))
  return {
    notificationId: notification.id,
    lender: lenderKey ? lenderAliases[lenderKey] : notification.lender,
    amount: amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : null,
    dueDay: dateMatch ? Number(dateMatch[1]) : null,
    status,
    language: notification.language,
    eventId: notification.eventId,
    confidence: amountMatch && (dateMatch || status === 'Disbursed') ? 0.98 : 0.82,
  }
}

export function parseNotifications(messages: Notification[]) {
  return messages.map(parseNotification)
}
