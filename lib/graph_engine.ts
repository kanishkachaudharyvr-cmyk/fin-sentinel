import type { Obligation } from './fin-sentinel-data'
import type { ParsedEvent } from './parser'

export type LoanNode = {
  eventId: string
  lender: string
  sourceCount: number
  statuses: string[]
  amount: number
  dueDay: number | null
  deduped: boolean
}

export function reconstructLoanGraph(events: ParsedEvent[]): LoanNode[] {
  const grouped = new Map<string, ParsedEvent[]>()
  for (const event of events) grouped.set(event.eventId, [...(grouped.get(event.eventId) ?? []), event])
  return [...grouped.entries()].map(([eventId, group]) => {
    const withAmount = group.find((event) => event.amount)
    const withDate = group.find((event) => event.dueDay)
    return {
      eventId,
      lender: group[0].lender,
      sourceCount: group.length,
      statuses: [...new Set(group.map((event) => event.status))],
      amount: withAmount?.amount ?? 0,
      dueDay: withDate?.dueDay ?? null,
      deduped: group.length > 1,
    }
  })
}

export function aggregateObligations(nodes: LoanNode[], base: Obligation[]) {
  return base.map((obligation) => {
    const matchingNodes = nodes.filter((node) => node.lender === obligation.lender)
    return { ...obligation, sourceCount: matchingNodes.reduce((count, node) => count + node.sourceCount, 0) || obligation.sourceCount }
  })
}
