# FIN SENTINEL

**Detect. Predict. Protect.** An on-device AI financial early-warning system by **The Mystic Merge**.

FIN SENTINEL reconstructs fragmented Indian lending notifications into one repayment picture, forecasts payment concentration, simulates a new loan, and explains the resulting cash-flow impact before a borrower commits.

## Team Mystic Merge

- **Kanishka Chaudhary** — Lead & System Architect
- **Swara Yerunkar** — Android & Security Lead
- **Siya Shah** — On-Device AI/NLP
- **Dristi Mahindru** — Financial Logic & UI/UX

## MVP architecture

```mermaid
flowchart LR
  A[Local SMS / notifications] --> B[Tokenizer + regex entity parser]
  B --> C[Event graph + deduplication]
  C --> D[Unified repayment calendar]
  D --> E[Cash-flow forecast]
  E --> F[Before-you-borrow simulator]
  F --> G[Explainable protection alert]
  G --> H[Dashboard + multilingual query]
```

The browser demo ships with a synthetic dataset and performs the core processing in the client. `lib/parser.ts` extracts lender, amount, date, state, language and confidence. `lib/graph_engine.ts` groups related notifications into a single event node so disbursal, reminder and payment messages do not become duplicate loans.

## Quickstart

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Demo flow

1. Review the 12 synthetic English, Hinglish and Marathi notifications.
2. Inspect the reconstructed five-loan graph and deduplication count.
3. Check the unified June calendar and ₹10,500 existing monthly commitment.
4. Adjust the proposed EMI in the simulator and open the explainable warning.
5. Ask `Meri agli EMI kab hai?` in the multilingual query panel.

## Privacy-by-design and RBI alignment

This hackathon MVP uses synthetic, anonymized notification data and performs its parsing and financial calculations locally in the browser. It does not call lender backends, credit bureaus, or external financial APIs. A production Android implementation would keep raw messages in protected on-device storage, request explicit user consent, minimize collection, provide deletion controls, and use a hardware-backed Trusted Execution Environment where supported. The product is decision support, not a lending approval or credit score; the 40% threshold is illustrative and user-configurable. Any deployment would require a formal legal, security and compliance review against applicable RBI digital lending, consent, data minimization, grievance and disclosure obligations.
