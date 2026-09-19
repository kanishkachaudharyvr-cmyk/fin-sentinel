'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Cpu, IndianRupee, LayoutDashboard, MessageSquareText, Mic, Network, PanelLeft, Search, ShieldCheck, SlidersHorizontal, Sparkles, WalletCards, X } from 'lucide-react'
import { existingCommitment, formatCompactINR, formatINR, monthlyIncome, notifications, obligations, safetyThreshold } from '@/lib/fin-sentinel-data'
import { parseNotifications } from '@/lib/parser'
import { reconstructLoanGraph } from '@/lib/graph_engine'

const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Notifications', icon: MessageSquareText, count: notifications.length },
  { label: 'Repayment graph', icon: Network },
  { label: 'Simulator', icon: SlidersHorizontal },
]

const days = [
  { day: 1, muted: true }, { day: 2, muted: true }, { day: 3, muted: true }, { day: 4, muted: true },
  { day: 5, amount: 2000, lender: 'Slice', color: '#b48cff' }, { day: 6 }, { day: 7 },
  { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12, amount: 1500, lender: 'LazyPay', color: '#44d7a8' },
  { day: 13 }, { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18, amount: 2500, lender: 'Amazon Pay', color: '#7aa7ff' },
  { day: 19 }, { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24, amount: 3000, lender: 'KreditBee', color: '#f4b860' },
  { day: 25 }, { day: 26 }, { day: 27 }, { day: 28 }, { day: 29 }, { day: 30, amount: 1500, lender: 'HDFC Bank', color: '#ef8b8b' },
]

function money(amount: number) { return formatCompactINR(amount).replace('₹', '₹') }

export function FinSentinelDashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [emi, setEmi] = useState(4500)
  const [showWhy, setShowWhy] = useState(false)
  const [query, setQuery] = useState('')
  const [queryAnswer, setQueryAnswer] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const parsedEvents = useMemo(() => parseNotifications(notifications), [])
  const graph = useMemo(() => reconstructLoanGraph(parsedEvents), [parsedEvents])
  const total = existingCommitment + emi
  const dti = (total / monthlyIncome) * 100
  const isRisk = dti > safetyThreshold

  function askQuery() {
    if (!query.trim()) return
    setQueryAnswer(/meri|next|agli|kab/i.test(query) ? 'Aapki agli repayment ₹1,500 LazyPay ki 12 June ko due hai.' : 'I found five reconstructed obligations. Your next due payment is ₹1,500 on 12 June.')
  }

  return (
    <main className="sentinel-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><ShieldCheck size={19} /></div><div><div className="brand-name">FIN SENTINEL</div><div className="brand-sub">THE MYSTIC MERGE</div></div></div>
        <div className="privacy-pill"><span className="pulse-dot" /> ON-DEVICE MODE <span className="info-dot">i</span></div>
        <nav className="side-nav" aria-label="Primary navigation">
          <div className="nav-label">WORKSPACE</div>
          {nav.map(({ label, icon: Icon, count }) => <button key={label} className={`nav-item ${activeNav === label ? 'active' : ''}`} onClick={() => { setActiveNav(label); if (label === 'Notifications') setShowNotifications(true) }}><Icon size={17} /><span>{label}</span>{count && <span className="nav-count">{count}</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="secure-box"><ShieldCheck size={17} /><div><strong>Privacy protected</strong><small>Your messages never leave this device.</small></div></div><div className="profile"><div className="avatar">KC</div><div><strong>Kanishka</strong><small>Personal workspace</small></div><ChevronDown size={15} className="muted-icon" /></div></div>
      </aside>

      <section className="main-area">
        <header className="topbar"><div className="mobile-brand"><div className="brand-mark"><ShieldCheck size={17} /></div><span>FIN SENTINEL</span></div><div className="topbar-right"><span className="sync-status"><span className="green-dot" /> Last synced just now</span><button className="icon-button" aria-label="Notifications" onClick={() => setShowNotifications(true)}><Bell size={18} /><span className="bell-badge">3</span></button><button className="top-avatar">KC</button></div></header>
        <div className="content-wrap">
          <div className="page-heading"><div><div className="eyebrow"><span className="live-line" /> FINANCIAL HEALTH OVERVIEW</div><h1>Good morning, Kanishka.</h1><p>Here&apos;s your complete repayment picture for June 2026.</p></div><button className="sync-button"><Sparkles size={15} /> Re-scan notifications</button></div>

          <div className="stage-strip"><div className="stage complete"><span>01</span><strong>RECONSTRUCT</strong><small>12 signals found</small></div><div className="stage complete"><span>02</span><strong>FORECAST</strong><small>5 obligations linked</small></div><div className="stage active"><span>03</span><strong>SIMULATE</strong><small>Try before you borrow</small></div><div className="stage"><span>04</span><strong>PROTECT</strong><small>Threshold monitoring</small></div><div className="stage"><span>05</span><strong>EXPLAIN</strong><small>Plain-language insights</small></div></div>

          <div className="metric-grid"><div className="metric-card"><div className="metric-icon teal"><WalletCards size={18} /></div><div className="metric-label">EXISTING COMMITMENT</div><div className="metric-value">{money(existingCommitment)}<span>/ month</span></div><div className="metric-foot"><span className="positive"><ArrowUpRight size={13} /> 5 obligations</span><span>deduplicated</span></div></div><div className="metric-card"><div className="metric-icon blue"><IndianRupee size={18} /></div><div className="metric-label">MONTHLY INCOME</div><div className="metric-value">{money(monthlyIncome)}<span>net income</span></div><div className="metric-foot"><span className="neutral"><Check size={13} /> User-provided</span><span>June 2026</span></div></div><div className={`metric-card ${isRisk ? 'risk-metric' : ''}`}><div className="metric-icon amber"><AlertTriangle size={18} /></div><div className="metric-label">CURRENT DTI RATIO</div><div className="metric-value">{((existingCommitment / monthlyIncome) * 100).toFixed(1)}<span>%</span></div><div className="metric-foot"><span className="positive"><Check size={13} /> Below {safetyThreshold}% threshold</span><span>healthy</span></div></div><div className="metric-card"><div className="metric-icon violet"><CalendarDays size={18} /></div><div className="metric-label">NEXT PAYMENT</div><div className="metric-value">₹1,500<span>in 12 days</span></div><div className="metric-foot"><span className="lender-dot" /> LazyPay BNPL <span>12 Jun</span></div></div></div>

          <div className="dashboard-grid"><section className="panel calendar-panel"><div className="panel-heading"><div><h2>Repayment calendar</h2><p>Upcoming obligations reconstructed from your notifications.</p></div><button className="month-button">June 2026 <ChevronDown size={14} /></button></div><div className="calendar"><div className="weekdays">{['MON','TUE','WED','THU','FRI','SAT','SUN'].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{days.map((day, index) => <div key={`${day.day}-${index}`} className={`calendar-day ${day.muted ? 'muted-day' : ''} ${day.amount ? 'has-payment' : ''}`}><span>{day.day}</span>{day.amount && <div className="payment-chip" style={{ borderColor: day.color, color: day.color }}><b>{money(day.amount)}</b><small>{day.lender}</small></div>}</div>)}</div></div><div className="calendar-legend"><span><i className="legend-dot teal-dot" /> Due</span><span><i className="legend-dot purple-dot" /> Paid</span><span><i className="legend-dot gray-dot" /> No payment</span><span className="legend-note"><Cpu size={13} /> Parsed locally</span></div></section>

            <section className="panel forecast-panel"><div className="panel-heading"><div><h2>Cash-flow forecast</h2><p>Payment concentration across the month.</p></div><button className="more-button" aria-label="More options">•••</button></div><div className="forecast-summary"><div><span className="metric-label">PEAK WINDOW</span><strong>12 — 24 Jun</strong></div><div className="forecast-risk"><AlertTriangle size={15} /><span>Moderate<br /><small>concentration</small></span></div></div><div className="bar-chart">{[22, 17, 13, 8, 12, 36, 28, 19, 10, 14, 45, 57, 33, 20, 14, 12, 21, 33].map((height, index) => <div className={`chart-bar ${index === 11 || index === 10 ? 'highlight' : ''}`} style={{ height: `${height}%` }} key={index} />)}</div><div className="chart-axis"><span>1 Jun</span><span>12 Jun</span><span>24 Jun</span><span>30 Jun</span></div><div className="forecast-callout"><div className="callout-icon"><AlertTriangle size={15} /></div><div><strong>Payments cluster in 12 days</strong><p>₹6,500 is due between 12–24 June. Keep a buffer available.</p></div></div></section></div>

          <div className="lower-grid"><section className="panel simulator-panel"><div className="panel-heading"><div><div className="panel-kicker"><SlidersHorizontal size={14} /> BEFORE-YOU-BORROW</div><h2>Simulate a new loan</h2><p>See the impact before you commit.</p></div><div className="simulate-badge"><Sparkles size={13} /> LIVE SIMULATION</div></div><div className="simulator-body"><div className="sim-input-row"><label>Proposed loan amount <span className="input-hint">Optional</span></label><div className="currency-input"><span>₹</span><input aria-label="Proposed loan amount" defaultValue="50,000" /></div></div><div className="emi-head"><label>Estimated monthly EMI</label><strong>{formatINR(emi)}</strong></div><input className="emi-slider" type="range" min="0" max="10000" step="500" value={emi} onChange={(event) => setEmi(Number(event.target.value))} aria-label="Estimated monthly EMI" /><div className="slider-scale"><span>₹0</span><span>₹5,000</span><span>₹10,000</span></div><div className="simulation-result"><div><span>PROJECTED COMMITMENT</span><strong>{money(total)} <small>/ month</small></strong></div><div className="result-divider" /><div><span>PROJECTED DTI</span><strong className={isRisk ? 'danger-text' : 'teal-text'}>{dti.toFixed(1)}%</strong></div><div className={`result-status ${isRisk ? 'danger-status' : ''}`}><span className="status-dot" /> {isRisk ? 'Needs attention' : 'Within threshold'}</div></div>{isRisk && <div className="warning-card"><div className="warning-top"><div className="warning-symbol"><AlertTriangle size={17} /></div><div><strong>Potential repayment stress</strong><p>Your projected DTI crosses the illustrative {safetyThreshold}% safety threshold.</p></div><button onClick={() => setShowWhy(!showWhy)} className="why-button">Why? <ChevronDown size={14} className={showWhy ? 'rotate' : ''} /></button></div>{showWhy && <div className="why-content"><div className="why-row"><span>Monthly income</span><b>{money(monthlyIncome)}</b></div><div className="why-row"><span>Existing commitments</span><b>{money(existingCommitment)}</b></div><div className="why-row"><span>Proposed EMI</span><b>{money(emi)}</b></div><div className="why-row"><span>Payment cluster</span><b>12–24 June</b></div><p>Adding this EMI would leave less room for essentials during your peak repayment window. Review the impact before proceeding.</p></div>}</div>}</div></section>

            <section className="panel assistant-panel"><div className="panel-heading"><div><div className="panel-kicker"><MessageSquareText size={14} /> FIN SENTINEL ASSIST</div><h2>Ask your finances</h2><p>English, Hindi or Marathi.</p></div><div className="assist-online"><span className="green-dot" /> Ready</div></div><div className="assistant-chat"><div className="assistant-message"><div className="assistant-avatar"><Sparkles size={15} /></div><div><p>Ask me about your repayments, like:</p><button onClick={() => setQuery('Meri agli EMI kab hai?')} className="suggested-query">“Meri agli EMI kab hai?” <ArrowUpRight size={13} /></button></div></div>{queryAnswer && <div className="user-answer">{queryAnswer}</div>}</div><div className="query-box"><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) askQuery() }} placeholder="Type or speak a question..." aria-label="Ask FIN SENTINEL" /><button className="mic-button" aria-label="Voice input"><Mic size={16} /></button><button className="send-button" aria-label="Send question" onClick={askQuery}><ArrowUpRight size={17} /></button></div><div className="assistant-note"><ShieldCheck size={12} /> Answers are generated from your local repayment graph.</div></section></div>
          <footer className="page-footer"><span><ShieldCheck size={13} /> Your financial data stays on this device.</span><span>FIN SENTINEL v0.1 · The Mystic Merge</span></footer>
        </div>
      </section>

      {showNotifications && <div className="modal-backdrop" onClick={() => setShowNotifications(false)}><div className="notifications-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-heading"><div><div className="panel-kicker"><MessageSquareText size={14} /> RECONSTRUCT</div><h2>Notification inbox</h2><p>{notifications.length} signals · {graph.length} linked loan nodes</p></div><button className="close-button" aria-label="Close notifications" onClick={() => setShowNotifications(false)}><X size={18} /></button></div><div className="node-summary"><Network size={16} /><span>Event graph resolved <strong>{notifications.length - graph.length} duplicates</strong></span><Check size={15} /></div><div className="notification-list">{notifications.map((item) => <div className="notification-row" key={item.id}><div className="notification-icon"><Bell size={14} /></div><div className="notification-copy"><div><strong>{item.lender}</strong><span>{item.received}</span></div><p>{item.message}</p><small><span>{item.language}</span> <i /> {item.channel}</small></div></div>)}</div></div></div>}
    </main>
  )
}
