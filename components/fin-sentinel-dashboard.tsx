'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

import {
  existingCommitment,
  formatCompactINR,
  formatINR,
  monthlyIncome,
  notifications,
  obligations,
  safetyThreshold,
} from '@/lib/fin-sentinel-data'

import { parseNotifications } from '@/lib/parser'
import { reconstructLoanGraph } from '@/lib/graph_engine'
import { authClient } from '@/lib/auth-client'

type TabId = 'overview' | 'notifications' | 'calendar' | 'simulator' | 'assistant'

type ChatMessage = {
  id: string
  role: 'user' | 'copilot'
  text: string
  time: string
}

function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

function money(amount: number) {
  return formatCompactINR(amount).replace('₹', '₹')
}

export function FinSentinelDashboard({
  userName: initialUserName = 'Kanishka',
}: {
  userName?: string
}) {
  const router = useRouter()
  const chatRef = useRef<HTMLDivElement>(null)

  // Auth state
  const [authReady, setAuthReady] = useState(true)
  const [userName, setUserName] = useState(initialUserName)
  const [userEmail, setUserEmail] = useState('local@dev.environment')

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('Last synced just now')

  // Simulator state
  const [emi, setEmi] = useState(4500)
  const [rateShock, setRateShock] = useState(1.5)
  const [revShock, setRevShock] = useState(-10)
  const [isFlipped, setIsFlipped] = useState(false)

  // AI Assistant
  const [query, setQuery] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'copilot',
      text: `Good morning ${initialUserName}. I've loaded your financial profile. Your current DTI is within safe boundaries. Ask me about your repayments, next EMI, or simulate a new loan.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  // Notifications
  const [dismissedNotifs, setDismissedNotifs] = useState<Set<string>>(new Set())

  // API data
  const [summary, setSummary] = useState({
    monthly_income: monthlyIncome,
    total_existing_commitments: existingCommitment,
    current_dti: (existingCommitment / monthlyIncome) * 100,
    risk_status: 'HEALTHY',
    dti_threshold: safetyThreshold,
  })

  const [calendar, setCalendar] = useState<any[]>([])
  const [simulation, setSimulation] = useState({
    projected_dti: ((existingCommitment + emi) / monthlyIncome) * 100,
    threshold_delta: 0,
    warning_reasons: [] as string[],
    risk_status: 'HEALTHY',
  })

  const [dataError, setDataError] = useState('')
  const [liveNotifications, setLiveNotifications] = useState<any[]>([])
  const [deviceStatus, setDeviceStatus] = useState('Waiting for notification data')
  const [lastDeviceSync, setLastDeviceSync] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  // Derived values
  const profileIncome = summary.monthly_income || monthlyIncome
  const profileCommitment = summary.total_existing_commitments || existingCommitment
  const profileThreshold = summary.dti_threshold || safetyThreshold
  const currentDti = summary.current_dti || (profileCommitment / profileIncome) * 100
  const total = profileCommitment + emi
  const projectedDti = simulation.projected_dti
  const isRisk = simulation.risk_status === 'AT_RISK'
  const liveNotificationCount = liveNotifications.length

  // Stress simulator calculations
  const stressDeltaDti = (rateShock * 2.1) - (revShock * 0.45)
  const stressDti = Math.min(65, Math.max(18, 28.5 + stressDeltaDti))
  const stressDeltaRunway = (-rateShock * 0.8) + (revShock * 0.25)
  const stressRunway = Math.max(4.2, 18.5 + stressDeltaRunway)

  const parsedEvents = useMemo(() => parseNotifications(notifications), [])
  const graph = useMemo(() => reconstructLoanGraph(parsedEvents), [parsedEvents])

  const initials = useMemo(() => {
    const parts = userName.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'FS'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }, [userName])

  // Theme toggle
  const toggleTheme = useCallback(() => {
    setIsDarkTheme(prev => {
      const next = !prev
      const root = document.getElementById('html-root')
      if (root) {
        root.classList.toggle('light-theme', !next)
        root.classList.toggle('dark-theme', next)
      }
      return next
    })
  }, [])

  // Auth check bypassed for local dev
  useEffect(() => {
    setAuthReady(true)
  }, [])

  // Load financial data
  useEffect(() => {
    if (!authReady) return
    Promise.all([
      fetch(`${apiBase}/api/financial/summary`, { credentials: 'include' }),
      fetch(`${apiBase}/api/repayments/calendar`, { credentials: 'include' }),
    ])
      .then(async ([summaryRes, calendarRes]) => {
        if (!summaryRes.ok || !calendarRes.ok) throw new Error('Failed')
        setSummary(await summaryRes.json())
        setCalendar(await calendarRes.json())
        setDataError('')
      })
      .catch(() => setDataError('Live data unavailable. Showing local snapshot.'))
  }, [apiBase, authReady])

  // Poll device notifications
  useEffect(() => {
    if (!authReady) return
    let cancelled = false
    async function loadNotifs() {
      try {
        const res = await fetch(`${apiBase}/api/device/notifications`, { cache: 'no-store', credentials: 'include' })
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (cancelled) return
        const records = Array.isArray(data) ? data : Array.isArray(data.records) ? data.records : Array.isArray(data.notifications) ? data.notifications : []
        setLiveNotifications(records)
        setDeviceStatus(data.deviceStatus || data.device_status || (records.length > 0 ? 'Android device connected' : 'Waiting for EMI notifications'))
        setLastDeviceSync(data.lastSynced || data.last_synced || new Date().toISOString())
      } catch {
        if (!cancelled) setDeviceStatus('Device connection unavailable')
      }
    }
    loadNotifs()
    const interval = setInterval(loadNotifs, 5000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [apiBase, authReady])

  // Run simulation when EMI changes
  useEffect(() => {
    if (!authReady) return
    fetch(`${apiBase}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ proposed_amount: 50000, proposed_emi: emi }),
    })
      .then(async res => { if (res.ok) setSimulation(await res.json()) })
      .catch(() => undefined)
  }, [apiBase, emi, authReady])

  // Update initial chat message when username loads
  useEffect(() => {
    setChatMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'init') {
        return [{
          ...prev[0],
          text: `Good morning ${userName}. I've loaded your financial profile. Your current DTI is within safe boundaries at ${currentDti.toFixed(1)}%. Ask me about your repayments, next EMI, or simulate a new loan.`,
        }]
      }
      return prev
    })
  }, [userName, currentDti])

  async function handleSignOut() {
    await authClient.signOut()
    router.replace('/sign-in')
  }

  function refreshData() {
    setSyncing(true)
    Promise.all([
      fetch(`${apiBase}/api/financial/summary`, { credentials: 'include' }),
      fetch(`${apiBase}/api/repayments/calendar`, { credentials: 'include' }),
      fetch(`${apiBase}/api/device/notifications`, { cache: 'no-store', credentials: 'include' }),
    ])
      .then(async ([sRes, cRes, dRes]) => {
        if (sRes.ok) setSummary(await sRes.json())
        if (cRes.ok) setCalendar(await cRes.json())
        if (dRes.ok) {
          const d = await dRes.json()
          const recs = Array.isArray(d) ? d : Array.isArray(d.records) ? d.records : Array.isArray(d.notifications) ? d.notifications : []
          setLiveNotifications(recs)
          setDeviceStatus(d.deviceStatus || d.device_status || (recs.length > 0 ? 'Android device connected' : 'Waiting'))
          setLastDeviceSync(d.lastSynced || d.last_synced || new Date().toISOString())
        }
        setDataError('')
        setSyncMessage('Synced just now')
      })
      .catch(() => setSyncMessage('Using local snapshot'))
      .finally(() => setSyncing(false))
  }

  function askQuery(inputQuery?: string) {
    const q = (inputQuery || query).trim()
    if (!q) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setChatMessages(prev => [...prev, userMsg])
    setQuery('')

    fetch(`${apiBase}/api/query/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: q }),
    })
      .then(async res => {
        if (!res.ok) throw new Error()
        const answer = (await res.json()).answer
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'copilot',
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
        setChatMessages(prev => [...prev, botMsg])
        if ('speechSynthesis' in window) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer))
        }
      })
      .catch(() => {
        setChatMessages(prev => [...prev, {
          id: `err-${Date.now()}`,
          role: 'copilot',
          text: 'The local FIN SENTINEL backend is unavailable right now.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }])
      })
  }

  function startVoiceInput() {
    type RecognitionEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
    type RecognitionLike = { lang: string; onresult: ((e: RecognitionEvent) => void) | null; onerror: (() => void) | null; start: () => void }
    const Recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!Recognition) {
      setChatMessages(prev => [...prev, { id: `err-voice-${Date.now()}`, role: 'copilot', text: 'Voice input not supported. Type your question instead.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
      return
    }
    const recognition: RecognitionLike = new Recognition()
    recognition.lang = 'en-IN'
    recognition.onresult = (e) => { setQuery(e.results[0][0].transcript); setVoiceEnabled(false) }
    recognition.onerror = () => setVoiceEnabled(false)
    setVoiceEnabled(true)
    recognition.start()
  }

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [chatMessages])

  // Build calendar days for the current month
  const calendarDays = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7 // Monday = 0
    const prevMonth = new Date(year, month, 0)
    const daysInPrev = prevMonth.getDate()
    const today = now.getDate()

    const cells: { day: number; currentMonth: boolean; isToday: boolean; event?: any }[] = []

    // Previous month filler
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({ day: daysInPrev - i, currentMonth: false, isToday: false })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const event = calendar.find((c: any) => c.day === d)
      cells.push({ day: d, currentMonth: true, isToday: d === today, event })
    }

    // Next month filler
    const remaining = 7 - (cells.length % 7)
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        cells.push({ day: i, currentMonth: false, isToday: false })
      }
    }

    return cells
  }, [calendar])

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Static notifications for Alerts tab
  const alertNotifications = [
    { id: 'alert-1', icon: 'warning', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200/60', title: 'Margin requirement update', badge: 'High Priority', badgeBg: 'bg-amber-100 text-amber-800', desc: 'Account flagged for collateral rebalance within current settlement window.', amount: `+${money(4200)} Required`, amountColor: 'text-amber-600', time: 'Action Due: 3h 40m' },
    { id: 'alert-2', icon: 'savings', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200/60', title: 'Automated treasury yield swept', badge: 'Automated', badgeBg: 'bg-blue-100 text-blue-700', desc: 'High-yield institutional cash reserve credited across diversified repo desk.', amount: `+${money(18450)} Credited`, amountColor: 'text-blue-600', time: 'Settled: Automated' },
    { id: 'alert-3', icon: 'schedule', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200/60', title: 'Credit facility payment due in 48h', badge: 'Syndicate', badgeBg: 'bg-slate-100 text-slate-700', desc: 'Synthetic hedge syndicate commitment scheduled for automatic liquidation.', amount: `${money(12800)} Due`, amountColor: 'text-amber-600', time: 'Window: T-48 Hours' },
    { id: 'alert-4', icon: 'bolt', iconBg: 'bg-purple-50', iconColor: 'text-purple-700', borderColor: 'border-purple-200/60', title: 'Risk anomaly detected', badge: 'Macro Spread', badgeBg: 'bg-purple-100 text-purple-700', desc: 'Sovereign bond spread spike (+18bps) detected across cross-currency hedging tranches.', amount: '+18 bps', amountColor: 'text-purple-700', time: 'Simulation advisory ready' },
  ]

  if (!authReady) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-mark">FS</div>
          <p className="eyebrow">FIN SENTINEL</p>
          <h1>Checking your workspace…</h1>
          <p className="auth-copy">Verifying your secure session.</p>
        </section>
      </main>
    )
  }

  const tabs: { id: TabId; label: string; icon: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'query_stats' },
    { id: 'notifications', label: 'Alerts', icon: 'crisis_alert', badge: String(alertNotifications.filter(a => !dismissedNotifs.has(a.id)).length) },
    { id: 'calendar', label: 'Commitments', icon: 'event_repeat' },
    { id: 'simulator', label: 'Stress Simulator', icon: 'ssid_chart' },
    { id: 'assistant', label: 'AI Risk Copilot', icon: 'psychology' },
  ]

  const sideNavItems: { id: TabId; label: string; icon: string; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications_active', badge: String(liveNotificationCount || 12) },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { id: 'simulator', label: 'Simulator', icon: 'vital_signs' },
    { id: 'assistant', label: 'AI Assistant', icon: 'smart_toy' },
  ]

  return (
    <div className="glass-app min-h-screen relative font-['Inter'] text-sm overflow-x-hidden transition-colors duration-300">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[130px]" />
        <div className="absolute top-[25%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-400/[0.12] blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-indigo-300/10 blur-[120px]" />
      </div>

      {/* ===== SIDEBAR ===== */}
      <aside className="theme-sidebar fixed left-0 top-0 h-full w-64 z-50 flex flex-col justify-between transition-colors duration-300 hidden lg:flex">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="h-16 px-4 flex items-center gap-2.5">
            <svg className="w-8 h-8 drop-shadow-[0_2px_8px_rgba(0,102,255,0.4)]" fill="none" viewBox="0 0 100 100">
              <path d="M50 8L86 23V52C86 73.5 70.8 90.6 50 96C29.2 90.6 14 73.5 14 52V23L50 8Z" fill="rgba(0,102,255,0.08)" stroke="#0066FF" strokeLinejoin="round" strokeWidth="4" />
              <circle className="animate-pulse" cx="50" cy="50" fill="#0066FF" r="14" />
              <path d="M50 42V58M42 50H58" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
            </svg>
            <div className="flex flex-col">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-base tracking-tight theme-text-main">FIN SENTINEL</span>
              <span className="text-[10px] uppercase tracking-widest theme-text-sub font-semibold">Intelligence Core</span>
            </div>
          </div>

          {/* Nav Label */}
          <div className="px-4 pt-4 pb-1">
            <span className="text-[10px] uppercase tracking-widest theme-text-sub font-semibold px-1">Surveillance Navigation</span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-2.5">
            {sideNavItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white font-semibold shadow-[0_4px_16px_rgba(0,102,255,0.3)]'
                    : 'theme-text-sub hover:bg-blue-50/80 hover:text-blue-600 theme-nav-hover'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon name={item.icon} className={`text-[20px] ${activeTab === item.id ? 'text-white' : 'theme-text-sub'}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && item.badge !== '0' && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar bottom */}
        <div className="p-4">
          <div className="theme-card-sub p-3 rounded-xl flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider theme-text-sub font-semibold">Cluster Latency</span>
              <span className="text-sm font-bold text-blue-600">18ms</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[94%]" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] theme-text-sub">Quantum Vault</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Armed</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        {/* ===== HEADER ===== */}
        <header className="theme-header fixed top-0 left-0 lg:left-64 right-0 h-16 z-40 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
              <span className="text-[11px] tracking-wide theme-text-sub font-medium">
                Live Sentinel Sync <span className="text-slate-400">•</span> <span className="text-blue-600 font-semibold">Real-Time</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl theme-card theme-text-main hover:border-blue-400 transition-all duration-300 cursor-pointer shadow-sm text-sm"
            >
              <Icon name={isDarkTheme ? 'dark_mode' : 'light_mode'} className={`text-[19px] ${isDarkTheme ? 'text-blue-400' : 'text-amber-500'}`} />
              <span className="font-semibold text-[11px] tracking-wide hidden sm:inline-block">{isDarkTheme ? 'Dark' : 'Light'}</span>
            </button>

            {/* Notification bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative h-9 w-9 rounded-lg theme-card theme-text-sub flex items-center justify-center transition-all shadow-sm"
            >
              <Icon name="notifications" className="text-[20px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200" />

            {/* Profile */}
            <button onClick={handleSignOut} title={`Sign out ${userName}`} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white grid place-items-center text-[11px] font-bold ring-2 ring-blue-500/30">
                {initials}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="font-bold text-sm theme-text-main">{userName}</span>
                <span className="text-[10px] theme-text-sub">{userEmail || 'Personal workspace'}</span>
              </div>
            </button>
          </div>
        </header>

        {/* ===== MAIN AREA ===== */}
        <main className="relative pt-16 flex-1 w-full px-4 lg:px-8 py-6 z-10">
          <div className="flex flex-col w-full gap-6">

            {/* HUD Bar with title + tabs */}
            <div className="theme-card relative w-full rounded-2xl p-4 overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-purple-400/[0.12] blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                {/* Title */}
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl theme-card shadow-sm">
                    <svg className="w-9 h-9 drop-shadow-[0_2px_8px_rgba(0,102,255,0.4)]" fill="none" viewBox="0 0 100 100">
                      <path d="M50 8L86 23V52C86 73.5 70.8 90.6 50 96C29.2 90.6 14 73.5 14 52V23L50 8Z" fill="rgba(0,102,255,0.08)" stroke="#0066FF" strokeLinejoin="round" strokeWidth="4" />
                      <path d="M50 20L74 31V51C74 65.5 63.8 77.2 50 82C36.2 77.2 26 65.5 26 51V31L50 20Z" fill="none" stroke="#00C853" strokeDasharray="5 4" strokeWidth="3" />
                      <circle className="animate-pulse" cx="50" cy="50" fill="#0066FF" r="14" />
                      <path d="M50 42V58M42 50H58" stroke="#ffffff" strokeLinecap="round" strokeWidth="3" />
                    </svg>
                    <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600" />
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-['Plus_Jakarta_Sans'] font-bold text-2xl theme-text-main tracking-tight">Financial Sentinel Core</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] tracking-widest uppercase font-semibold">Autonomous</span>
                    </div>
                    <p className="text-xs theme-text-sub">
                      Real-time systemic solvency surveillance • {syncMessage}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1 theme-card-sub p-1 rounded-xl">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-[0_2px_12px_rgba(0,102,255,0.35)]'
                          : 'theme-text-sub hover:theme-text-main hover:bg-white/80'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name={tab.icon} className="text-[18px]" />
                        {tab.label}
                        {tab.badge && tab.badge !== '0' && (
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                          }`}>{tab.badge}</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
              <section className="flex flex-col gap-6">
                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Monthly Inflow */}
                  <div className="theme-card rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600">
                          <Icon name="account_balance_wallet" className="text-[20px]" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider theme-text-sub font-semibold">Total Monthly Inflow</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold border border-emerald-200/60 flex items-center gap-0.5">
                        <Icon name="trending_up" className="text-[14px]" /> +12.4%
                      </span>
                    </div>
                    <div className="my-2">
                      <div className="font-['Plus_Jakarta_Sans'] font-bold text-3xl theme-text-main tracking-tight">{money(profileIncome)}</div>
                      <p className="text-xs theme-text-sub">vs prev period • High liquidity band</p>
                    </div>
                    <div className="w-full pt-1">
                      <svg className="w-full h-14 overflow-visible" fill="none" viewBox="0 0 260 55">
                        <defs><linearGradient id="bsg" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0066FF" stopOpacity="0.25" /><stop offset="100%" stopColor="#0066FF" stopOpacity="0.0" /></linearGradient></defs>
                        <path d="M0 45 C30 42,50 30,80 34 C110 38,130 18,160 22 C190 26,210 10,240 8 L260 5 L260 55 L0 55 Z" fill="url(#bsg)" />
                        <path d="M0 45 C30 42,50 30,80 34 C110 38,130 18,160 22 C190 26,210 10,240 8 L260 5" stroke="#0066FF" strokeLinecap="round" strokeWidth="2.5" />
                        <circle cx="260" cy="5" fill="#0066FF" r="4.5" stroke="#fff" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Card 2: Fixed Commitments */}
                  <div className="theme-card rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center text-purple-700">
                          <Icon name="lock_clock" className="text-[20px]" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider theme-text-sub font-semibold">Fixed Commitments</span>
                      </div>
                    </div>
                    <div className="my-2">
                      <div className="font-['Plus_Jakarta_Sans'] font-bold text-3xl theme-text-main tracking-tight">{money(profileCommitment)}</div>
                      <p className="text-xs theme-text-sub">Allocated to {obligations.length} loan tranches</p>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                        <div className="h-full bg-blue-600" style={{ width: '66.5%' }} />
                        <div className="h-full bg-purple-600" style={{ width: '22%' }} />
                        <div className="h-full bg-amber-500" style={{ width: '11.5%' }} />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] theme-text-sub">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" />Senior</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600" />Hedge</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Sweeps</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: DTI Gauge */}
                  <div className="theme-card rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex items-center justify-between">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600">
                            <Icon name="speed" className="text-[20px]" />
                          </div>
                          <span className="text-[10px] uppercase tracking-wider theme-text-sub font-semibold">Solvency Ratio (DTI)</span>
                        </div>
                        <div className="mt-3">
                          <div className="font-['Plus_Jakarta_Sans'] font-bold text-3xl theme-text-main tracking-tight">{currentDti.toFixed(1)}%</div>
                          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5 font-semibold">
                            <Icon name="verified" className="text-[16px]" />
                            {currentDti < profileThreshold ? `Optimal (< ${profileThreshold}% safe)` : 'Above threshold'}
                          </p>
                        </div>
                      </div>
                      <div className="text-[11px] theme-text-sub font-medium">
                        Max Tolerance: <span className="text-rose-600 font-bold">{profileThreshold}%</span>
                      </div>
                    </div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="transparent" r="38" stroke="#e2e8f0" strokeWidth="9" />
                        <circle cx="50" cy="50" fill="transparent" r="38" stroke="url(#dtiG)" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * currentDti / 100)} strokeLinecap="round" strokeWidth="9" className="transition-all duration-1000 ease-out" />
                        <defs><linearGradient id="dtiG" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stopColor="#0066FF" /><stop offset="60%" stopColor="#9C27B0" /><stop offset="100%" stopColor="#00C853" /></linearGradient></defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-bold text-base theme-text-main">{currentDti.toFixed(1)}%</span>
                        <span className="text-[10px] text-emerald-600 font-bold tracking-wider">{currentDti < profileThreshold ? 'PRIME' : 'ALERT'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Chart + Safeguards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Chart */}
                  <div className="theme-card lg:col-span-8 rounded-2xl p-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="ssid_chart" className="text-blue-600" />
                        <span className="font-semibold theme-text-main">Portfolio Liquidity Velocity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {['1W', '1M', '1Y'].map((p, i) => (
                          <span key={p} className={`px-2.5 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${i === 1 ? 'bg-blue-600 text-white shadow' : 'theme-card-sub theme-text-sub'}`}>{p}</span>
                        ))}
                      </div>
                    </div>
                    <div className="w-full h-56 relative rounded-xl theme-card-sub p-2 overflow-hidden flex flex-col justify-end">
                      <div className="absolute top-3 left-4 flex gap-4 text-[11px] font-semibold">
                        <span className="flex items-center gap-1.5 text-blue-600"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />Net Inflow</span>
                        <span className="flex items-center gap-1.5 text-purple-700"><span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />Hedge Amort.</span>
                      </div>
                      <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 160">
                        <defs>
                          <linearGradient id="a1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#0066FF" stopOpacity="0.22" /><stop offset="100%" stopColor="#0066FF" stopOpacity="0.01" /></linearGradient>
                          <linearGradient id="a2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#9C27B0" stopOpacity="0.15" /><stop offset="100%" stopColor="#9C27B0" stopOpacity="0.0" /></linearGradient>
                        </defs>
                        <line stroke="#e2e8f0" strokeDasharray="4 4" x1="0" x2="600" y1="40" y2="40" />
                        <line stroke="#e2e8f0" strokeDasharray="4 4" x1="0" x2="600" y1="80" y2="80" />
                        <line stroke="#e2e8f0" strokeDasharray="4 4" x1="0" x2="600" y1="120" y2="120" />
                        <path d="M0,130 C100,125 150,110 250,115 C350,120 420,95 520,80 L600,75 L600,160 L0,160 Z" fill="url(#a2)" />
                        <path d="M0,130 C100,125 150,110 250,115 C350,120 420,95 520,80 L600,75" fill="none" stroke="#9C27B0" strokeWidth="2.5" />
                        <path d="M0,110 C80,90 160,115 240,65 C320,30 400,75 500,40 L600,28 L600,160 L0,160 Z" fill="url(#a1)" />
                        <path d="M0,110 C80,90 160,115 240,65 C320,30 400,75 500,40 L600,28" fill="none" stroke="#0066FF" strokeWidth="3" />
                        <circle cx="500" cy="40" fill="#0066FF" r="5" stroke="#fff" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Safeguards */}
                  <div className="theme-card lg:col-span-4 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-semibold theme-text-main">Autonomous Safeguards</span>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
                        </span>
                      </div>
                      <p className="text-xs theme-text-sub">Automated smart contract triggers</p>
                      <div className="flex flex-col gap-2.5 mt-4">
                        {[
                          { icon: 'verified_user', iconColor: 'text-blue-600', title: 'Auto-Deleverage Threshold', desc: `Liquidates at ${profileThreshold}% DTI`, status: 'ARMED', statusColor: 'text-blue-600' },
                          { icon: 'swap_horizontal_circle', iconColor: 'text-emerald-600', title: 'Treasury Yield Sweep', desc: 'Daily sweeps over idle fiat', status: 'ACTIVE', statusColor: 'text-emerald-600' },
                          { icon: 'lock_reset', iconColor: 'text-purple-700', title: 'Curve Hedging Lock', desc: 'SOFR cap spread collar', status: 'SET', statusColor: 'text-purple-700' },
                        ].map((guard, i) => (
                          <div key={i} className="theme-card-sub p-3 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon name={guard.icon} className={`${guard.iconColor} text-[18px]`} />
                              <div>
                                <div className="text-[13px] font-semibold theme-text-main">{guard.title}</div>
                                <div className="text-[11px] theme-text-sub">{guard.desc}</div>
                              </div>
                            </div>
                            <span className={`text-sm font-bold ${guard.statusColor}`}>{guard.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('simulator')} className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer">
                      <Icon name="play_arrow" className="text-[18px]" /> Run Stress Rebalance
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* ===== NOTIFICATIONS TAB ===== */}
            {activeTab === 'notifications' && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl theme-text-main">Surveillance Alerts &amp; Warnings</h2>
                    <p className="text-xs theme-text-sub">Click any alert tile to acknowledge &amp; dismiss.</p>
                  </div>
                  <button onClick={() => setDismissedNotifs(new Set())} className="theme-card-sub px-3 py-1.5 rounded-lg text-[13px] font-semibold theme-text-main flex items-center gap-1">
                    <Icon name="refresh" className="text-[16px]" /> Reset List
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {alertNotifications.filter(a => !dismissedNotifs.has(a.id)).map(alert => (
                    <div
                      key={alert.id}
                      onClick={() => setDismissedNotifs(prev => new Set([...prev, alert.id]))}
                      className="theme-card group relative rounded-2xl p-4 transition-all duration-300 hover:shadow-lg cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${alert.iconBg} ${alert.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform border ${alert.borderColor}`}>
                          <Icon name={alert.icon} className="text-[24px]" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold theme-text-main">{alert.title}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${alert.badgeBg}`}>{alert.badge}</span>
                          </div>
                          <p className="text-sm theme-text-sub mt-0.5">{alert.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${alert.amountColor}`}>{alert.amount}</div>
                          <span className="text-[10px] theme-text-sub">{alert.time}</span>
                        </div>
                        <div className="theme-card-sub w-8 h-8 rounded-lg flex items-center justify-center theme-text-sub group-hover:text-blue-600">
                          <Icon name="check_circle" className="text-[18px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {alertNotifications.filter(a => !dismissedNotifs.has(a.id)).length === 0 && (
                    <div className="theme-card rounded-2xl p-8 text-center theme-text-sub">
                      <Icon name="check_circle" className="text-[48px] text-emerald-500 mb-2" />
                      <p className="font-semibold">All alerts cleared!</p>
                      <p className="text-xs mt-1">Click &quot;Reset List&quot; to restore.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ===== CALENDAR TAB ===== */}
            {activeTab === 'calendar' && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl theme-text-main">Institutional Commitment Calendar</h2>
                    <p className="text-xs theme-text-sub">Automated ledger of debt maturities, capital calls, and liquidity sweeps.</p>
                  </div>
                  <div className="theme-card-sub flex items-center gap-2 p-1.5 rounded-xl">
                    <span className="font-semibold theme-text-main px-3">{monthName}</span>
                  </div>
                </div>
                <div className="theme-card rounded-2xl p-4 flex flex-col gap-2">
                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 gap-2 text-center pb-2">
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                      <span key={d} className="text-[10px] font-semibold theme-text-sub">{d}</span>
                    ))}
                  </div>
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((cell, i) => (
                      <div
                        key={i}
                        className={`min-h-24 p-2 rounded-xl flex flex-col justify-between transition-colors ${
                          cell.isToday
                            ? 'bg-blue-50/80 shadow-[0_4px_16px_rgba(0,102,255,0.15)] border-2 border-blue-600'
                            : cell.currentMonth
                              ? 'theme-card-sub hover:bg-slate-50'
                              : 'bg-slate-50/50 border border-slate-200/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${cell.isToday ? 'text-blue-600' : cell.currentMonth ? 'theme-text-main' : 'text-slate-400'}`}>
                            {cell.day}{cell.isToday ? ' Today' : ''}
                          </span>
                          {cell.isToday && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
                        </div>
                        {cell.event && (
                          <div
                            className="px-2 py-1 rounded-md text-[10px] font-semibold truncate cursor-pointer"
                            style={{
                              backgroundColor: cell.event.color ? `${cell.event.color}20` : '#EBF5FF',
                              color: cell.event.color || '#0066FF',
                              borderLeft: `3px solid ${cell.event.color || '#0066FF'}`,
                            }}
                          >
                            {cell.event.status === 'Paid' ? '✓ ' : ''}{money(cell.event.amount)} — {cell.event.lender}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ===== SIMULATOR TAB ===== */}
            {activeTab === 'simulator' && (
              <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl theme-text-main">Interactive Debt &amp; Liquidity Stress Tester</h2>
                    <p className="text-xs theme-text-sub">Model macro shocks in real-time. Compute dynamic DTI drift and cash runway impacts.</p>
                  </div>
                  <button onClick={() => { setRateShock(1.5); setRevShock(-10); setEmi(4500) }} className="theme-card-sub px-3 py-1.5 rounded-lg text-[13px] font-semibold theme-text-main flex items-center gap-1.5">
                    <Icon name="restart_alt" className="text-[16px]" /> Reset Scenarios
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Sliders */}
                  <div className="theme-card lg:col-span-7 rounded-2xl p-4 flex flex-col gap-6">
                    {/* Rate Shock Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="font-semibold theme-text-main flex items-center gap-2">
                          <Icon name="tune" className="text-blue-600 text-[20px]" />
                          Interest Rate Shock
                        </label>
                        <span className="text-lg font-bold text-blue-600">+{rateShock.toFixed(2)}%</span>
                      </div>
                      <input
                        type="range" min="0.5" max="5.0" step="0.25" value={rateShock}
                        onChange={e => setRateShock(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-[10px] theme-text-sub">
                        <span>+0.50% (Dovish)</span><span>+2.50% (Base)</span><span>+5.00% (Hawkish)</span>
                      </div>
                    </div>

                    {/* Revenue Shock Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <label className="font-semibold theme-text-main flex items-center gap-2">
                          <Icon name="waterfall_chart" className="text-purple-700 text-[20px]" />
                          Revenue Volatility
                        </label>
                        <span className="text-lg font-bold text-purple-700">{revShock > 0 ? '+' : ''}{revShock.toFixed(1)}%</span>
                      </div>
                      <input
                        type="range" min="-30" max="10" step="1" value={revShock}
                        onChange={e => setRevShock(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div className="flex justify-between text-[10px] theme-text-sub">
                        <span>-30% (Severe)</span><span>0% (Steady)</span><span>+10% (Growth)</span>
                      </div>
                    </div>

                    {/* EMI Simulator */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <label className="font-semibold theme-text-main flex items-center gap-2">
                          <Icon name="calculate" className="text-emerald-600 text-[20px]" />
                          Proposed Monthly EMI
                        </label>
                        <span className="text-lg font-bold text-emerald-600">{formatINR(emi)}</span>
                      </div>
                      <input
                        type="range" min="0" max="10000" step="500" value={emi}
                        onChange={e => setEmi(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] theme-text-sub">
                        <span>₹0</span><span>₹5,000</span><span>₹10,000</span>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="theme-card-sub p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider theme-text-sub font-semibold">Projected DTI</span>
                        <div className={`font-['Plus_Jakarta_Sans'] font-bold text-3xl tracking-tight ${stressDti > 35 ? 'text-rose-600' : 'text-amber-700'}`}>{stressDti.toFixed(1)}%</div>
                        <span className={`text-xs flex items-center gap-1 font-medium ${stressDti > 35 ? 'text-rose-600' : 'text-amber-700'}`}>
                          <Icon name={stressDti > 35 ? 'error' : 'warning'} className="text-[16px]" />
                          {stressDti > 35 ? 'Breach Risk • Over 35%' : 'Alert • Close to 35%'}
                        </span>
                      </div>
                      <div className="theme-card-sub p-3 rounded-xl flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider theme-text-sub font-semibold">Cash Runway</span>
                        <div className="font-['Plus_Jakarta_Sans'] font-bold text-3xl theme-text-main tracking-tight">{stressRunway.toFixed(1)} Mo</div>
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <Icon name="verified" className="text-[16px]" /> {stressRunway > 12 ? 'Safe Buffer (> 12 Mo)' : 'Low Buffer'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flip Card */}
                  <div className="lg:col-span-5 h-[380px] cursor-pointer group" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
                    <div className="relative w-full h-full transition-transform duration-700" style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)' }}>
                      {/* Front */}
                      <div className="theme-card absolute inset-0 w-full h-full rounded-2xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                              <Icon name="crisis_alert" className="text-[24px]" />
                            </div>
                            <div>
                              <div className="font-semibold theme-text-main">Risk Warning Vector</div>
                              <div className="text-[10px] text-amber-700 font-semibold uppercase tracking-wider">Level 2 Vulnerability</div>
                            </div>
                          </div>
                          <span className="theme-card-sub px-2.5 py-1 rounded-full text-[11px] theme-text-sub flex items-center gap-1 font-medium">
                            <Icon name="touch_app" className="text-[14px]" /> Tap to Flip
                          </span>
                        </div>
                        <div className="my-2 flex flex-col gap-2">
                          <p className="text-sm theme-text-main">
                            Simulated rates at <span className="text-amber-700 font-bold">+{rateShock.toFixed(2)}%</span> with a <span className="text-purple-700 font-bold">{revShock}%</span> revenue dip compress debt service coverage.
                          </p>
                          <div className="theme-card-sub p-3 rounded-xl flex items-center justify-between">
                            <span className="text-[13px] theme-text-sub font-semibold">Floating Rate Exposure:</span>
                            <span className="text-sm text-amber-700 font-bold">$1.84M Exposed</span>
                          </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between theme-text-sub text-[10px]">
                          <span>Model: STRESS-2026-V4</span>
                          <span className="text-blue-600 font-semibold">View Hedging →</span>
                        </div>
                      </div>
                      {/* Back */}
                      <div className="theme-card absolute inset-0 w-full h-full rounded-2xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}>
                        <div>
                          <div className="flex items-center justify-between pb-1">
                            <div className="flex items-center gap-2">
                              <Icon name="shield_with_heart" className="text-blue-600 text-[22px]" />
                              <span className="font-semibold theme-text-main">Recommended Hedging Actions</span>
                            </div>
                            <span className="text-[11px] theme-text-sub">Click to return</span>
                          </div>
                          <div className="flex flex-col gap-2 mt-2">
                            <div className="theme-card-sub p-2 rounded-lg flex items-start gap-2">
                              <Icon name="verified" className="text-blue-600 text-[18px] mt-0.5" />
                              <div>
                                <div className="text-[13px] font-semibold theme-text-main">Execute SOFR Collar Hedge</div>
                                <div className="text-[11px] theme-text-sub">Cap floating exposure at 4.25% through Q3 2026.</div>
                              </div>
                            </div>
                            <div className="theme-card-sub p-2 rounded-lg flex items-start gap-2">
                              <Icon name="swap_calls" className="text-purple-700 text-[18px] mt-0.5" />
                              <div>
                                <div className="text-[13px] font-semibold theme-text-main">Pre-fund Reserve Account</div>
                                <div className="text-[11px] theme-text-sub">Sweep from overnight yields to insulate liquidity.</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); alert('Autonomous Hedge Protocol Confirmed: Collar order routed. DTI volatility ceiling fixed at 4.25%.') }}
                          className="w-full py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                        >
                          <Icon name="bolt" className="text-[18px]" /> Autonomous Hedge Execution
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ===== AI ASSISTANT TAB ===== */}
            {activeTab === 'assistant' && (
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Icon name="smart_toy" className="text-[24px]" />
                    </div>
                    <div>
                      <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl theme-text-main">FIN Sentinel AI Risk Copilot</h2>
                      <p className="text-xs theme-text-sub">Continuous risk-modeling intelligence • Ask in English, Hindi, or Marathi</p>
                    </div>
                  </div>
                  <span className="theme-card-sub px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] flex items-center gap-1.5 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" /> Copilot Online
                  </span>
                </div>

                <div className="theme-card rounded-2xl p-4 flex flex-col justify-between min-h-[460px]">
                  {/* Chat stream */}
                  <div ref={chatRef} className="flex flex-col gap-4 overflow-y-auto max-h-[340px] pr-2">
                    {chatMessages.map(msg => (
                      msg.role === 'copilot' ? (
                        <div key={msg.id} className="flex items-start gap-3 max-w-2xl">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <Icon name="psychology" className="text-[18px]" />
                          </div>
                          <div className="theme-card-sub p-4 rounded-2xl rounded-tl-none flex flex-col gap-1.5 shadow-sm">
                            <div className="flex items-center justify-between gap-4 text-[10px] theme-text-sub">
                              <span className="font-semibold">FIN Sentinel Copilot</span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="text-sm leading-relaxed theme-text-main">{msg.text}</p>
                          </div>
                        </div>
                      ) : (
                        <div key={msg.id} className="flex items-start justify-end gap-3 self-end max-w-xl">
                          <div className="relative p-4 rounded-2xl rounded-tr-none bg-blue-50/90 flex flex-col gap-1 shadow-sm border border-blue-200">
                            <div className="flex items-center justify-between gap-4 text-[10px] text-blue-600 font-semibold">
                              <span>{userName}</span>
                              <span>{msg.time}</span>
                            </div>
                            <p className="text-sm theme-text-main">{msg.text}</p>
                          </div>
                          <div className="theme-card-sub w-8 h-8 rounded-lg flex items-center justify-center theme-text-main shrink-0">
                            <Icon name="person" className="text-[18px]" />
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Quick prompts */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[
                      'Meri agli EMI kab hai?',
                      'What is my current DTI?',
                      'Show payment risk analysis',
                    ].map(prompt => (
                      <button
                        key={prompt}
                        onClick={() => { setQuery(prompt); setTimeout(() => askQuery(prompt), 0) }}
                        className="theme-card-sub px-2.5 py-1 rounded-lg text-blue-600 text-[11px] font-semibold hover:bg-blue-50 transition-colors"
                      >
                        {prompt} →
                      </button>
                    ))}
                  </div>

                  {/* Input bar */}
                  <div className="mt-4 pt-3 flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        className="theme-input w-full h-12 pl-4 pr-12 rounded-xl text-sm placeholder:text-slate-400 shadow-sm"
                        placeholder="Ask FIN Sentinel about EMIs, payments, risk..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) askQuery() }}
                      />
                      <button onClick={() => askQuery()} className="absolute right-2 top-2 p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                        <Icon name="send" className="text-[20px]" />
                      </button>
                    </div>
                    <button
                      onClick={startVoiceInput}
                      className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all overflow-visible cursor-pointer ${voiceEnabled ? 'bg-red-500' : 'bg-blue-600'} text-white`}
                    >
                      <Icon name="mic" className="text-[22px] relative z-10" />
                    </button>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
