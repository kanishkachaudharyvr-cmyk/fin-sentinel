export type LoanStatus = 'Due' | 'Paid' | 'Disbursed'

export type Notification = {
  id: string
  lender: string
  channel: 'SMS' | 'App notification'
  received: string
  message: string
  language: 'English' | 'Hinglish' | 'Marathi'
  eventId: string
}

export type Obligation = {
  id: string
  lender: string
  product: string
  amount: number
  dueDay: number
  status: LoanStatus
  sourceCount: number
  color: string
}

export const notifications: Notification[] = [
  { id: 'n1', lender: 'LazyPay', channel: 'SMS', received: 'Today, 09:42', language: 'English', eventId: 'lp-emi', message: 'Reminder: Your LazyPay installment of Rs. 1,500 is payable by 12/06. Keep sufficient balance.', },
  { id: 'n2', lender: 'LazyPay', channel: 'App notification', received: 'Yesterday, 18:20', language: 'Hinglish', eventId: 'lp-emi', message: 'Aapki LazyPay EMI ₹1,500 ki 12 June ko due hai. Late fee se bachne ke liye pay karein.', },
  { id: 'n3', lender: 'KreditBee', channel: 'SMS', received: 'Mon, 14:06', language: 'English', eventId: 'kb-emi', message: 'KreditBee: EMI of ₹3,000 due on 24 June. Loan ref KB7F29.', },
  { id: 'n4', lender: 'KreditBee', channel: 'SMS', received: 'Sun, 10:11', language: 'English', eventId: 'kb-loan', message: 'Your KreditBee loan of ₹50,000 has been disbursed successfully. EMI starts 24/06.', },
  { id: 'n5', lender: 'Amazon Pay Later', channel: 'App notification', received: 'Sun, 08:32', language: 'English', eventId: 'apl-emi', message: 'Amazon Pay Later: ₹2,500 payment due on June 18. Pay now to avoid charges.', },
  { id: 'n6', lender: 'Slice', channel: 'SMS', received: 'Sat, 20:14', language: 'Hinglish', eventId: 'slice-emi', message: 'Slice bill reminder: ₹2,000 bharna hai 05 June tak. Your bill is ready.', },
  { id: 'n7', lender: 'Slice', channel: 'SMS', received: 'Fri, 12:04', language: 'English', eventId: 'slice-emi', message: 'Payment received. ₹2,000 paid towards Slice bill. Thank you!', },
  { id: 'n8', lender: 'HDFC Bank', channel: 'SMS', received: 'Fri, 09:18', language: 'Marathi', eventId: 'hdfc-emi', message: 'HDFC Bank: तुमचा EMI ₹1,500 30 जून रोजी देय आहे. खाते क्रमांक शेवटचे 4421.', },
  { id: 'n9', lender: 'LazyPay', channel: 'SMS', received: 'Thu, 16:42', language: 'English', eventId: 'lp-disbursed', message: 'LazyPay credit line activated. Your repayment schedule is available in the app.', },
  { id: 'n10', lender: 'KreditBee', channel: 'App notification', received: 'Wed, 11:26', language: 'Hinglish', eventId: 'kb-emi', message: 'Reminder: KreditBee ki ₹3,000 EMI 24 June ko due hai.', },
  { id: 'n11', lender: 'Amazon Pay Later', channel: 'SMS', received: 'Tue, 07:50', language: 'English', eventId: 'apl-paid', message: 'Amazon Pay Later payment successful: ₹2,500 received on 18 May.', },
  { id: 'n12', lender: 'HDFC Bank', channel: 'SMS', received: 'Mon, 19:40', language: 'English', eventId: 'hdfc-emi', message: 'Your HDFC Bank personal loan EMI of Rs 1,500 is due on 30/06.', },
]

export const obligations: Obligation[] = [
  { id: 'lp', lender: 'LazyPay', product: 'BNPL repayment', amount: 1500, dueDay: 12, status: 'Due', sourceCount: 3, color: '#44d7a8' },
  { id: 'apl', lender: 'Amazon Pay Later', product: 'Shopping EMI', amount: 2500, dueDay: 18, status: 'Due', sourceCount: 2, color: '#7aa7ff' },
  { id: 'kb', lender: 'KreditBee', product: 'Instant loan EMI', amount: 3000, dueDay: 24, status: 'Due', sourceCount: 3, color: '#f4b860' },
  { id: 'slice', lender: 'Slice', product: 'Card bill', amount: 2000, dueDay: 5, status: 'Paid', sourceCount: 2, color: '#b48cff' },
  { id: 'hdfc', lender: 'HDFC Bank', product: 'Personal loan EMI', amount: 1500, dueDay: 30, status: 'Due', sourceCount: 2, color: '#ef8b8b' },
]

export const monthlyIncome = 35000
export const safetyThreshold = 40
export const existingCommitment = obligations.reduce((sum, obligation) => sum + obligation.amount, 0)

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function formatCompactINR(amount: number) {
  return `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`
}
