'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  IndianRupee,
  LayoutDashboard,
  MessageSquareText,
  Mic,
  Moon,
  Network,
  PanelLeft,
  Search,
  LogOut,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  WalletCards,
  X,
} from 'lucide-react'

import {
  formatINR,
  formatCompactINR,
} from '@/lib/fin-sentinel-data'
import {
  apiFetch,
  authHeaders,
  clearToken,
  firstName,
  getApiBase,
  initialsFromName,
  type AuthUser,
} from '@/lib/session-client'

type FinancialSummary = {
  monthly_income: number
  total_existing_commitments: number
  current_dti: number
  risk_status: string
  dti_threshold: number
}

type Repayment = {
  id: number
  amount: number
  due_date: string
  status: string
  lender: string
  loan_type: string
}

type DeviceNotification = {
  id: string
  source: string
  amount: number | null
  dueDate: string
  notificationText: string
  detectedAt: string
  provenance: string
  isEmi: boolean
}

type DeviceNotificationsResponse = {
  records: DeviceNotification[]
  deviceStatus?: string
  lastSynced?: string | null
}

type Simulation = {
  projected_dti: number
  threshold_delta: number
  warning_reasons: string[]
  risk_status: string
}

type CalendarCell = {
  key: string
  day: number | null
  repayments: Repayment[]
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(init?.headers),
    },
  })
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

function localDate(dateString: string) {
  const [year, month, day] = dateString.slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function dateKey(dateString: string) {
  return dateString.slice(0, 10)
}

function displayDate(dateString: string) {
  return localDate(dateString)?.toLocaleDateString() || dateString
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Request failed.'
}

function money(amount: number) {
  return formatCompactINR(amount)
}

export function FinSentinelDashboard({
  user,
}: {
  user: AuthUser
}) {
  const userName = firstName(user.name)
  const userInitials = initialsFromName(user.name)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [activeNav, setActiveNav] = useState('Overview')
  const [emi, setEmi] = useState(0)
  const [proposedAmount, setProposedAmount] = useState('')
  const [showWhy, setShowWhy] = useState(false)
  const [query, setQuery] = useState('')
  const [queryAnswer, setQueryAnswer] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDeckTheme, setIsDeckTheme] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('Not synced yet')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [calendar, setCalendar] = useState<Repayment[]>([])
  const [simulation, setSimulation] = useState<Simulation | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [calendarLoading, setCalendarLoading] = useState(true)
  const [simulationLoading, setSimulationLoading] = useState(false)
  const [dataError, setDataError] = useState('')
  const [simulationError, setSimulationError] = useState('')
  const [assistantLoading, setAssistantLoading] = useState(false)
  const [deviceError, setDeviceError] = useState('')

  // ============================================================
  // LIVE ANDROID DEVICE DATA
  // ============================================================

  const [liveNotifications, setLiveNotifications] = useState<DeviceNotification[]>([])
  const [deviceStatus, setDeviceStatus] = useState(
    'Waiting for notification data'
  )
  const [lastDeviceSync, setLastDeviceSync] = useState<string | null>(null)

  const apiBase = getApiBase()

  useEffect(() => {
    void apiFetch('/api/device/claim', { method: 'POST' }).catch(() => undefined)
  }, [])
  const profileIncome = summary?.monthly_income
  const profileCommitment = summary?.total_existing_commitments
  const profileThreshold = summary?.dti_threshold
  const obligationCount = calendar.length
  const selectedMonth = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + monthOffset, 1)
  }, [monthOffset])
  const monthLabel = selectedMonth.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
  const visibleRepayments = useMemo(
    () =>
      calendar.filter((repayment) => {
        const date = localDate(repayment.due_date)
        return (
          date !== null &&
          date.getFullYear() === selectedMonth.getFullYear() &&
          date.getMonth() === selectedMonth.getMonth()
        )
      }),
    [calendar, selectedMonth]
  )
  const calendarCells = useMemo<CalendarCell[]>(() => {
    const firstWeekday = (selectedMonth.getDay() + 6) % 7
    const daysInMonth = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth() + 1,
      0
    ).getDate()
    const paymentsByDate = new Map<string, Repayment[]>()

    for (const repayment of visibleRepayments) {
      const key = dateKey(repayment.due_date)
      paymentsByDate.set(key, [...(paymentsByDate.get(key) ?? []), repayment])
    }

    return [
      ...Array.from({ length: firstWeekday }, (_, index) => ({
        key: `empty-${index}`,
        day: null,
        repayments: [],
      })),
      ...Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1
        const key = `${selectedMonth.getFullYear()}-${String(
          selectedMonth.getMonth() + 1
        ).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return {
          key,
          day,
          repayments: paymentsByDate.get(key) ?? [],
        }
      }),
    ]
  }, [selectedMonth, visibleRepayments])
  const nextRepayment = calendar[0]
  const nextRepaymentDate = nextRepayment
    ? localDate(nextRepayment.due_date)
    : null
  const monthTotal = visibleRepayments.reduce(
    (total, repayment) => total + repayment.amount,
    0
  )

  // ============================================================
  // FETCH FINANCIAL SUMMARY + CALENDAR
  // ============================================================

  useEffect(() => {
    let cancelled = false

    async function loadFinancialData() {
      if (!apiBase) {
        setDataError('Set NEXT_PUBLIC_API_BASE_URL to connect to FastAPI.')
        setSummaryLoading(false)
        setCalendarLoading(false)
        return
      }

      const [summaryResult, calendarResult] = await Promise.allSettled([
        fetchJson<FinancialSummary>(`${apiBase}/api/financial/summary`),
        fetchJson<Repayment[]>(`${apiBase}/api/repayments/calendar`),
      ])
      if (cancelled) return

      const errors: string[] = []
      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value)
      } else {
        errors.push(`Financial summary unavailable: ${errorMessage(summaryResult.reason)}`)
      }
      if (calendarResult.status === 'fulfilled') {
        setCalendar(calendarResult.value)
      } else {
        errors.push(`Repayment calendar unavailable: ${errorMessage(calendarResult.reason)}`)
      }
      setDataError(errors.join(' '))
      setSummaryLoading(false)
      setCalendarLoading(false)
    }

    void loadFinancialData()
    const interval = window.setInterval(loadFinancialData, 5000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [apiBase])

  // ============================================================
  // LIVE ANDROID NOTIFICATION POLLING
  // ============================================================

  useEffect(() => {
    let cancelled = false

    async function loadLiveNotifications() {
      try {
        if (!apiBase) {
          throw new Error('Set NEXT_PUBLIC_API_BASE_URL to connect to FastAPI.')
        }
        const data = await fetchJson<DeviceNotificationsResponse>(
          `${apiBase}/api/device/notifications`,
          { cache: 'no-store' }
        )

        if (cancelled) return

        setLiveNotifications(data.records ?? [])

        const status =
          data.deviceStatus ||
          (data.records.length > 0
            ? 'Android device connected'
            : 'Waiting for EMI notifications')

        setDeviceStatus(status)
        setDeviceError('')

        setLastDeviceSync(data.lastSynced ?? null)
      } catch (error) {
        if (cancelled) return

        setDeviceStatus('Device connection unavailable')
        setDeviceError(
          error instanceof Error
            ? `Unable to load live device notifications: ${error.message}`
            : 'Unable to load live device notifications.'
        )
      }
    }

    loadLiveNotifications()

    const interval = window.setInterval(
      loadLiveNotifications,
      5000
    )

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [apiBase])

  // ============================================================
  // SIMULATION
  // ============================================================

  useEffect(() => {
    let cancelled = false

    async function runSimulation() {
      if (!apiBase) {
        setSimulationError('Set NEXT_PUBLIC_API_BASE_URL to connect to FastAPI.')
        return
      }

      setSimulationLoading(true)
      setSimulationError('')
      try {
        const result = await fetchJson<Simulation>(
          `${apiBase}/api/simulate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              proposed_amount: Number(proposedAmount.replace(/,/g, '')) || 0,
              proposed_emi: emi,
            }),
          }
        )
        if (!cancelled) setSimulation(result)
      } catch (error) {
        if (!cancelled) {
          setSimulation(null)
          setSimulationError(
            error instanceof Error
              ? `Simulation unavailable: ${error.message}`
              : 'Simulation unavailable.'
          )
        }
      } finally {
        if (!cancelled) setSimulationLoading(false)
      }
    }

    void runSimulation()
    return () => {
      cancelled = true
    }
  }, [apiBase, emi, proposedAmount])

  const dti = simulation?.projected_dti
  const isRisk = simulation?.risk_status === 'AT_RISK'

  // ============================================================
  // REAL NOTIFICATION DATA FOR UI
  // ============================================================

  const liveNotificationCount = liveNotifications.length

  const displayNotifications = liveNotifications.map(
    (item, index) => {
      const amount = item.amount
      const dueDate = item.dueDate
      const text = item.notificationText || 'Notification received'
      const source = item.source || 'Android notification'
      const received = item.detectedAt
      return {
        id: item.id || `${received}-${index}`,
        source,
        received,
        message:
          item.isEmi && amount !== null && amount > 0
            ? `EMI amount: ₹${Number(amount).toLocaleString('en-IN')}${dueDate ? ` · Due: ${displayDate(dueDate)}` : ''}`
            : text,
        originalText: text,
        channel: item.provenance || 'Android notification',
        amount,
        dueDate,
        isEmi: item.isEmi,
      }
    }
  )

  // ============================================================
  // REFRESH
  // ============================================================

  async function refreshData() {
    setSyncing(true)
    if (!apiBase) {
      setDataError('Set NEXT_PUBLIC_API_BASE_URL to connect to FastAPI.')
      setSyncMessage('Sync unavailable')
      setSyncing(false)
      return
    }

    const [summaryResult, calendarResult, deviceResult] =
      await Promise.allSettled([
        fetchJson<FinancialSummary>(`${apiBase}/api/financial/summary`),
        fetchJson<Repayment[]>(`${apiBase}/api/repayments/calendar`),
        fetchJson<DeviceNotificationsResponse>(
          `${apiBase}/api/device/notifications`,
          { cache: 'no-store' }
        ),
      ])
    const errors: string[] = []

    if (summaryResult.status === 'fulfilled') {
      setSummary(summaryResult.value)
      setSummaryLoading(false)
    } else {
      errors.push(`Financial summary unavailable: ${errorMessage(summaryResult.reason)}`)
    }

    if (calendarResult.status === 'fulfilled') {
      setCalendar(calendarResult.value)
      setCalendarLoading(false)
    } else {
      errors.push(`Repayment calendar unavailable: ${errorMessage(calendarResult.reason)}`)
    }

    if (deviceResult.status === 'fulfilled') {
      setLiveNotifications(deviceResult.value.records ?? [])
      setDeviceStatus(
        deviceResult.value.deviceStatus ||
          (deviceResult.value.records.length
            ? 'Android device connected'
            : 'Waiting for EMI notifications')
      )
      setLastDeviceSync(deviceResult.value.lastSynced ?? null)
      setDeviceError('')
    } else {
      setDeviceError(
        `Unable to load live device notifications: ${errorMessage(deviceResult.reason)}`
      )
    }

    setDataError(errors.join(' '))
    setSyncMessage(errors.length ? 'Sync incomplete' : 'Synced just now')
    setSyncing(false)
  }

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Token is cleared locally even if the backend is unreachable.
    }
    clearToken()
    window.location.href = '/sign-in'
  }

  async function clearNotifications() {
    setClearing(true)
    try {
      await apiFetch('/api/device/notifications/clear', { method: 'POST' })
      setLiveNotifications([])
      setConfirmClear(false)
    } catch (error) {
      setDeviceError(`Unable to clear notifications: ${errorMessage(error)}`)
    } finally {
      setClearing(false)
    }
  }

  // ============================================================
  // VOICE
  // ============================================================

  function startVoiceInput() {
    type RecognitionEvent = {
      results: ArrayLike<ArrayLike<{ transcript: string }>>
    }

    type RecognitionLike = {
      lang: string
      onresult:
        | ((event: RecognitionEvent) => void)
        | null
      onerror: (() => void) | null
      start: () => void
    }

    const Recognition =
      (
        window as Window & {
          SpeechRecognition?:
            | (new () => RecognitionLike)
            | undefined
          webkitSpeechRecognition?:
            | (new () => RecognitionLike)
            | undefined
        }
      ).SpeechRecognition ||
      (
        window as Window & {
          webkitSpeechRecognition?:
            | (new () => RecognitionLike)
            | undefined
        }
      ).webkitSpeechRecognition

    if (!Recognition) {
      setQueryAnswer(
        'Voice input is not supported in this browser. You can type your question instead.'
      )
      return
    }

    const recognition = new Recognition()

    recognition.lang = 'en-IN'

    recognition.onresult = (event) => {
      setQuery(event.results[0][0].transcript)
      setVoiceEnabled(false)
    }

    recognition.onerror = () => {
      setVoiceEnabled(false)
    }

    setVoiceEnabled(true)
    recognition.start()
  }

  // ============================================================
  // ASSISTANT
  // ============================================================

  async function askQuery(question = query) {
    if (!question.trim()) return
    if (!apiBase) {
      setQueryAnswer('Set NEXT_PUBLIC_API_BASE_URL to connect to FastAPI.')
      return
    }

    setAssistantLoading(true)
    try {
      const result = await fetchJson<{ answer: string }>(
        `${apiBase}/api/query/assistant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: question }),
        }
      )
      setQueryAnswer(result.answer)

      if ('speechSynthesis' in window) {
        window.speechSynthesis.speak(
          new SpeechSynthesisUtterance(result.answer)
        )
      }
    } catch (error) {
      setQueryAnswer(`Assistant unavailable: ${errorMessage(error)}`)
    } finally {
      setAssistantLoading(false)
    }
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <main
      className={`sentinel-shell ${
        isDeckTheme ? 'deck-theme' : ''
      }`}
    >
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={19} />
          </div>

          <div>
            <div className="brand-name">FIN SENTINEL</div>
            <div className="brand-sub">
              THE MYSTIC MERGE
            </div>
          </div>
        </div>

        <div className="privacy-pill">
          <span className="pulse-dot" />
          ON-DEVICE MODE
          <span className="info-dot">i</span>
        </div>

        <nav
          className="side-nav"
          aria-label="Primary navigation"
        >
          <div className="nav-label">WORKSPACE</div>

          <button
            className={`nav-item ${
              activeNav === 'Overview' ? 'active' : ''
            }`}
            onClick={() => setActiveNav('Overview')}
          >
            <LayoutDashboard size={17} />
            <span>Overview</span>
          </button>

          <button
            className={`nav-item ${
              activeNav === 'Notifications' ? 'active' : ''
            }`}
            onClick={() => {
              setActiveNav('Notifications')
              setShowNotifications(true)
            }}
          >
            <MessageSquareText size={17} />
            <span>Notifications</span>

            {liveNotificationCount > 0 && (
              <span className="nav-count">
                {liveNotificationCount}
              </span>
            )}
          </button>

          <button
            className={`nav-item ${
              activeNav === 'Repayment graph'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveNav('Repayment graph')
            }
          >
            <Network size={17} />
            <span>Repayment graph</span>
          </button>

          <button
            className={`nav-item ${
              activeNav === 'Simulator' ? 'active' : ''
            }`}
            onClick={() => setActiveNav('Simulator')}
          >
            <SlidersHorizontal size={17} />
            <span>Simulator</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-box">
            <ShieldCheck size={17} />

            <div>
              <strong>Privacy protected</strong>
              <small>
                Your messages never leave this device.
              </small>
            </div>
          </div>

          <div className="profile">
            <button
              className="profile-trigger"
              onClick={() => setShowProfileMenu((open) => !open)}
              aria-expanded={showProfileMenu}
            >
              <div className="avatar">{userInitials}</div>

              <div>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </div>

              <ChevronDown
                size={15}
                className="muted-icon"
              />
            </button>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-meta">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <button type="button" onClick={logout}>
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <div className="brand-mark">
              <ShieldCheck size={17} />
            </div>

            <span>FIN SENTINEL</span>
          </div>

          <div className="topbar-right">
            <span className="sync-status">
              <span className="green-dot" />
              {syncMessage}
            </span>

            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() =>
                setShowNotifications(true)
              }
            >
              <Bell size={18} />

              {liveNotificationCount > 0 && (
                <span className="bell-badge">
                  {liveNotificationCount}
                </span>
              )}
            </button>

            <button
              className="theme-toggle"
              aria-label={
                isDeckTheme
                  ? 'Use dark theme'
                  : 'Use pitch deck theme'
              }
              onClick={() =>
                setIsDeckTheme(!isDeckTheme)
              }
            >
              {isDeckTheme ? (
                <Moon size={16} />
              ) : (
                <Sun size={16} />
              )}

              <span>
                {isDeckTheme ? 'Dark' : 'Deck'}
              </span>
            </button>

            <button className="top-avatar" onClick={() => setShowProfileMenu((open) => !open)}>
              {userInitials}
            </button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="live-line" />
                FINANCIAL HEALTH OVERVIEW
              </div>

              <h1>
                Good morning, {userName}.
              </h1>

              <p>
                Here&apos;s your complete repayment
                picture for {monthLabel}.
              </p>
            </div>

            <button
              className="sync-button"
              onClick={refreshData}
              disabled={syncing}
            >
              <Sparkles size={15} />

              {syncing
                ? 'Scanning…'
                : 'Re-scan notifications'}
            </button>
          </div>

          {/* LIVE DEVICE STATUS */}
          <div className="data-banner" role="status">
            <span
              className="green-dot"
              style={{
                display: 'inline-block',
                marginRight: '8px',
              }}
            />

            <strong>Android:</strong>{' '}
            {deviceStatus}
            {deviceError && <span> · {deviceError}</span>}

            {lastDeviceSync && (
              <span
                style={{
                  marginLeft: '8px',
                  opacity: 0.7,
                }}
              >
                · Last sync{' '}
                {new Date(
                  lastDeviceSync
                ).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div
            className="stage-strip"
            aria-label="Financial workflow"
          >
            <button
              className="stage complete"
              onClick={() => {
                setActiveNav('Notifications')
                setShowNotifications(true)
              }}
            >
              <span>01</span>

              <strong>RECONSTRUCT</strong>

              <small>
                {liveNotificationCount} live signals
              </small>
            </button>

            <button
              className="stage complete"
              onClick={() =>
                setActiveNav('Repayment graph')
              }
            >
              <span>02</span>

              <strong>FORECAST</strong>

              <small>
                {obligationCount} repayments linked
              </small>
            </button>

            <button
              className="stage active"
              onClick={() =>
                document
                  .querySelector(
                    '.simulator-panel'
                  )
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
            >
              <span>03</span>

              <strong>SIMULATE</strong>

              <small>
                Try before you borrow
              </small>
            </button>

            <button
              className="stage"
              onClick={() =>
                document
                  .querySelector(
                    '.forecast-panel'
                  )
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
            >
              <span>04</span>

              <strong>PROTECT</strong>

              <small>
                Threshold monitoring
              </small>
            </button>

            <button
              className="stage"
              onClick={() => setShowWhy(true)}
            >
              <span>05</span>

              <strong>EXPLAIN</strong>

              <small>
                Plain-language insights
              </small>
            </button>
          </div>

          {dataError && (
            <div
              className="data-banner"
              role="status"
            >
              <CircleHelp size={15} />
              {dataError}
            </div>
          )}

          <div className="metric-grid">
            <div className="metric-card">
              <div className="metric-icon teal">
                <WalletCards size={18} />
              </div>

              <div className="metric-label">
                EXISTING COMMITMENT
              </div>

              <div className="metric-value">
                {summaryLoading
                  ? 'Loading…'
                  : profileCommitment === undefined
                    ? 'Unavailable'
                    : money(profileCommitment)}
                {profileCommitment !== undefined && <span>/ month</span>}
              </div>

              <div className="metric-foot">
                <span className="positive">
                  <ArrowUpRight size={13} />
                  {obligationCount} repayments
                </span>

                <span>from live calendar</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon blue">
                <IndianRupee size={18} />
              </div>

              <div className="metric-label">
                MONTHLY INCOME
              </div>

              <div className="metric-value">
                {summaryLoading
                  ? 'Loading…'
                  : profileIncome === undefined
                    ? 'Unavailable'
                    : money(profileIncome)}
                {profileIncome !== undefined && <span>net income</span>}
              </div>

              <div className="metric-foot">
                <span className="neutral">
                  <Check size={13} />
                  From financial summary
                </span>

                <span>{monthLabel}</span>
              </div>
            </div>

            <div
              className={`metric-card ${
                summary?.risk_status === 'AT_RISK' ? 'risk-metric' : ''
              }`}
            >
              <div className="metric-icon amber">
                <AlertTriangle size={18} />
              </div>

              <div className="metric-label">
                CURRENT DTI RATIO
              </div>

              <div className="metric-value">
                {summaryLoading
                  ? 'Loading…'
                  : summary?.current_dti === undefined
                    ? 'Unavailable'
                    : `${summary.current_dti.toFixed(1)}%`}
              </div>

              <div className="metric-foot">
                <span className="positive">
                  {summary?.risk_status === 'AT_RISK' ? (
                    <AlertTriangle size={13} />
                  ) : (
                    <Check size={13} />
                  )}
                  {summaryLoading
                    ? 'Loading risk status'
                    : summary
                      ? `${summary.risk_status.replace(/_/g, ' ')} · ${profileThreshold}% threshold`
                      : 'Risk status unavailable'}
                </span>

                <span>backend result</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon violet">
                <CalendarDays size={18} />
              </div>

              <div className="metric-label">
                NEXT PAYMENT
              </div>

              <div className="metric-value">
                {summaryLoading || calendarLoading
                  ? 'Loading…'
                  : nextRepayment
                    ? money(nextRepayment.amount)
                    : 'No upcoming payment'}
                {nextRepayment && <span>next payment</span>}
              </div>

              <div className="metric-foot">
                {nextRepayment ? (
                  <>
                    <span className="lender-dot" />
                    {nextRepayment.lender}
                    <span>
                      {nextRepaymentDate?.toLocaleDateString()}
                    </span>
                  </>
                ) : (
                  <span>
                    {calendarLoading
                      ? 'Loading repayment data'
                      : 'No upcoming payment'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="panel calendar-panel">
              <div className="panel-heading">
                <div>
                  <h2>Repayment calendar</h2>

                  <p>
                    Repayment cycles returned by FastAPI.
                  </p>
                </div>

                <button
                  className="month-button"
                  onClick={() =>
                    setMonthOffset((value) =>
                      value === 0 ? 1 : 0
                    )
                  }
                >
                  {monthLabel}

                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="calendar">
                <div className="weekdays">
                  {[
                    'MON',
                    'TUE',
                    'WED',
                    'THU',
                    'FRI',
                    'SAT',
                    'SUN',
                  ].map((day) => (
                    <span key={day}>
                      {day}
                    </span>
                  ))}
                </div>

                <div className="calendar-grid">
                  {calendarCells.map((cell) => (
                    <div
                      key={cell.key}
                      className={`calendar-day ${
                        cell.day === null ? 'muted-day' : ''
                      } ${cell.repayments.length ? 'has-payment' : ''}`}
                    >
                      {cell.day !== null && <span>{cell.day}</span>}
                      {cell.repayments.map((repayment) => {
                        const isPaid = repayment.status.toUpperCase() === 'PAID'
                        return (
                          <div
                            className="payment-chip"
                            key={repayment.id}
                            style={{
                              borderColor: isPaid ? '#b48cff' : '#44d7a8',
                              color: isPaid ? '#b48cff' : '#44d7a8',
                            }}
                            title={`${repayment.lender}: ${repayment.status}`}
                          >
                            <b>{money(repayment.amount)}</b>
                            <small>{repayment.lender}</small>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {calendarLoading ? (
                <p role="status">Loading repayment calendar…</p>
              ) : dataError.includes('Repayment calendar unavailable') ? (
                <p role="alert">Repayment calendar could not be loaded.</p>
              ) : calendar.length === 0 ? (
                <p className="empty-copy">No repayments yet</p>
              ) : visibleRepayments.length === 0 ? (
                <p>No repayment cycles in {monthLabel}.</p>
              ) : null}

              <div className="calendar-legend">
                <span>
                  <i className="legend-dot teal-dot" />
                  Due
                </span>

                <span>
                  <i className="legend-dot gray-dot" />
                  No payment
                </span>

                <span className="legend-note">
                  FastAPI · SQLite
                </span>
              </div>
            </section>

            <section className="panel forecast-panel">
              <div className="panel-heading">
                <div>
                  <h2>Cash-flow forecast</h2>

                  <p>
                    Payment concentration
                    across the month.
                  </p>
                </div>

              </div>

              <div className="forecast-summary">
                <div>
                  <span className="metric-label">
                    REPAYMENTS THIS MONTH
                  </span>

                  <strong>
                    {calendarLoading
                      ? 'Loading…'
                      : `${visibleRepayments.length} · ${money(monthTotal)}`}
                  </strong>
                </div>

                <div className="forecast-risk">
                  <CalendarDays size={15} />

                  <span>
                    {visibleRepayments.length}
                    <br />
                    <small>
                      scheduled
                    </small>
                  </span>
                </div>
              </div>

              {visibleRepayments.length > 0 && (
                <div className="bar-chart" aria-label="Repayment amounts by date">
                  {calendarCells
                    .filter((cell) => cell.day !== null)
                    .map((cell) => {
                      const amount = cell.repayments.reduce(
                        (sum, repayment) => sum + repayment.amount,
                        0
                      )
                      const maxAmount = Math.max(
                        ...calendarCells.map((dayCell) =>
                          dayCell.repayments.reduce(
                            (sum, repayment) => sum + repayment.amount,
                            0
                          )
                        ),
                        1
                      )
                      return (
                        <div
                          className={`chart-bar ${amount ? 'highlight' : ''}`}
                          style={{
                            height: `${amount ? Math.max(12, (amount / maxAmount) * 100) : 4}%`,
                          }}
                          key={cell.key}
                          title={`${cell.day}: ${money(amount)}`}
                        />
                      )
                    })}
                </div>
              )}

              <div className="chart-axis">
                <span>1 {selectedMonth.toLocaleDateString(undefined, { month: 'short' })}</span>
                <span>{Math.ceil(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate() / 2)} {selectedMonth.toLocaleDateString(undefined, { month: 'short' })}</span>
                <span>{new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate()} {selectedMonth.toLocaleDateString(undefined, { month: 'short' })}</span>
              </div>

              <div className="forecast-callout">
                <div className="callout-icon">
                  <CalendarDays size={15} />
                </div>

                <div>
                  <strong>
                    {calendarLoading
                      ? 'Loading repayment forecast'
                      : visibleRepayments.length
                        ? `${visibleRepayments.length} repayment${visibleRepayments.length === 1 ? '' : 's'} scheduled`
                        : dataError.includes('Repayment calendar unavailable')
                          ? 'Repayment data unavailable'
                        : calendar.length === 0
                          ? 'No repayment activity yet'
                          : 'No repayments scheduled'}
                  </strong>

                  <p>
                    {visibleRepayments.length
                      ? `${money(monthTotal)} scheduled in ${monthLabel}.`
                      : calendar.length === 0
                        ? 'Live EMI SMS will appear here once reconstructed.'
                        : 'This view uses repayment cycles returned by the backend.'}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="lower-grid">
            <section className="panel simulator-panel">
              <div className="panel-heading">
                <div>
                  <div className="panel-kicker">
                    <SlidersHorizontal
                      size={14}
                    />
                    BEFORE-YOU-BORROW
                  </div>

                  <h2>
                    Simulate a new loan
                  </h2>

                  <p>
                    See the impact before
                    you commit.
                  </p>
                </div>

                <div className="simulate-badge">
                  <Sparkles size={13} />
                  LIVE SIMULATION
                </div>
              </div>

              <div className="simulator-body">
                <div className="sim-input-row">
                  <label>
                    Proposed loan amount
                    <span className="input-hint">
                      Optional
                    </span>
                  </label>

                  <div className="currency-input">
                    <span>₹</span>

                    <input
                      aria-label="Proposed loan amount"
                      type="number"
                      min="0"
                      value={proposedAmount}
                      onChange={(event) => setProposedAmount(event.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="emi-head">
                  <label>
                    Estimated monthly EMI
                  </label>

                  <strong>
                    {formatINR(emi)}
                  </strong>
                </div>

                <input
                  className="emi-slider"
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={emi}
                  onChange={(event) =>
                    setEmi(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  aria-label="Estimated monthly EMI"
                />

                <div className="slider-scale">
                  <span>₹0</span>
                  <span>₹5,000</span>
                  <span>₹10,000</span>
                </div>

                <div className="simulation-result">
                  <div>
                    <span>
                      COMMITMENT TOTAL
                    </span>

                    <strong>
                      Not provided by API
                    </strong>
                  </div>

                  <div className="result-divider" />

                  <div>
                    <span>
                      PROJECTED DTI
                    </span>

                    <strong
                      className={
                        isRisk
                          ? 'danger-text'
                          : 'teal-text'
                      }
                    >
                      {simulationLoading
                        ? 'Calculating…'
                        : dti === undefined
                          ? 'Unavailable'
                          : `${dti.toFixed(1)}%`}
                    </strong>
                  </div>

                  <div
                    className={`result-status ${
                      isRisk
                        ? 'danger-status'
                        : ''
                    }`}
                  >
                    <span className="status-dot" />

                    {simulationLoading
                      ? 'Simulation loading'
                      : isRisk === undefined
                        ? 'Simulation unavailable'
                        : isRisk
                          ? 'Needs attention'
                          : 'Within threshold'}
                  </div>
                </div>

                {simulationError && (
                  <p role="alert">{simulationError}</p>
                )}

                {isRisk && simulation && (
                  <div className="warning-card">
                    <div className="warning-top">
                      <div className="warning-symbol">
                        <AlertTriangle
                          size={17}
                        />
                      </div>

                      <div>
                        <strong>
                          Potential repayment
                          stress
                        </strong>

                        <p>
                          {simulation.warning_reasons.join(' ') ||
                            `Projected DTI is above the ${profileThreshold ?? 'configured'}% threshold.`}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setShowWhy(!showWhy)
                        }
                        className="why-button"
                      >
                        Why?

                        <ChevronDown
                          size={14}
                          className={
                            showWhy
                              ? 'rotate'
                              : ''
                          }
                        />
                      </button>
                    </div>

                    {showWhy && (
                      <div className="why-content">
                        <div className="why-row">
                          <span>
                            Monthly income
                          </span>

                          <b>
                            {profileIncome === undefined
                              ? 'Unavailable'
                              : money(profileIncome)}
                          </b>
                        </div>

                        <div className="why-row">
                          <span>
                            Existing
                            commitments
                          </span>

                          <b>
                            {profileCommitment === undefined
                              ? 'Unavailable'
                              : money(profileCommitment)}
                          </b>
                        </div>

                        <div className="why-row">
                          <span>
                            Proposed EMI
                          </span>

                          <b>
                            {money(emi)}
                          </b>
                        </div>

                        <div className="why-row">
                          <span>
                            Payment cluster
                          </span>

                          <b>
                            {simulation.warning_reasons.length
                              ? simulation.warning_reasons.join(' ')
                              : 'No additional warning factors.'}
                          </b>
                        </div>

                        <p>
                          Adding this EMI would
                          leave less room for
                          essentials during your
                          peak repayment window.
                          Review the impact before
                          proceeding.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <section className="panel assistant-panel">
              <div className="panel-heading">
                <div>
                  <div className="panel-kicker">
                    <MessageSquareText
                      size={14}
                    />
                    FIN SENTINEL ASSIST
                  </div>

                  <h2>
                    Ask your finances
                  </h2>

                  <p>
                    English, Hindi or Marathi.
                  </p>
                </div>

                <div className="assist-online" role="status">
                  <span className="green-dot" />
                  {assistantLoading ? 'Thinking…' : 'Assistant'}
                </div>
              </div>

              <div className="assistant-chat">
                <div className="assistant-message">
                  <div className="assistant-avatar">
                    <Sparkles size={15} />
                  </div>

                  <div>
                    <p>
                      Ask me about your
                      repayments, like:
                    </p>

                    <button
                    onClick={() => {
                      const question = 'Meri agli EMI kab hai?'
                      setQuery(question)
                      void askQuery(question)
                    }}
                      className="suggested-query"
                    >
                      “Meri agli EMI kab hai?”
                      <ArrowUpRight
                        size={13}
                      />
                    </button>
                  </div>
                </div>

                {queryAnswer && (
                  <div className="user-answer">
                    {queryAnswer}
                  </div>
                )}
              </div>

              <div className="query-box">
                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                        'Enter' &&
                      !event.nativeEvent
                        .isComposing &&
                      event.keyCode !== 229
                    ) {
                      askQuery()
                    }
                  }}
                  placeholder="Type or speak a question..."
                  aria-label="Ask FIN SENTINEL"
                />

                <button
                  className={`mic-button ${
                    voiceEnabled
                      ? 'active'
                      : ''
                  }`}
                  aria-label="Voice input"
                  onClick={
                    startVoiceInput
                  }
                >
                  <Mic size={16} />
                </button>

                <button
                  className="send-button"
                  aria-label="Send question"
                  onClick={() => void askQuery()}
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="assistant-note">
                <ShieldCheck size={12} />
                Answers are generated from
                backend repayment data.
              </div>
            </section>
          </div>

          <footer className="page-footer">
            <span>
              <ShieldCheck size={13} />
              Your financial data stays on
              this device.
            </span>

            <span>
              FIN SENTINEL v0.1 · The Mystic
              Merge
            </span>
          </footer>
        </div>
      </section>

      {/* ======================================================
          REAL ANDROID NOTIFICATION DRAWER
          ====================================================== */}

      {showNotifications && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setShowNotifications(false)
          }
        >
          <div
            className="notifications-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="drawer-heading">
              <div>
                <div className="panel-kicker">
                  <MessageSquareText
                    size={14}
                  />
                  RECONSTRUCT
                </div>

                <h2>
                  Notification inbox
                </h2>

                <p>
                  {liveNotificationCount}{' '}
                  financial signals
                </p>
              </div>

              <div className="drawer-actions">
                <button
                  className="clear-notifications"
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  disabled={liveNotificationCount === 0}
                >
                  Clear notifications
                </button>
                <button
                  className="close-button"
                  aria-label="Close notifications"
                  onClick={() =>
                    setShowNotifications(
                      false
                    )
                  }
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="node-summary">
              <Network size={16} />

              <span>
                <strong>
                  {deviceStatus}
                </strong>

                {lastDeviceSync && (
                  <>
                    {' · '}
                    last sync{' '}
                    {new Date(
                      lastDeviceSync
                    ).toLocaleTimeString()}
                  </>
                )}
              </span>

              {deviceError ? (
                <AlertTriangle size={15} />
              ) : (
                <Check size={15} />
              )}
            </div>

            {displayNotifications.length ===
            0 ? (
              <div
                className="notification-row"
                style={{
                  justifyContent:
                    'center',
                  textAlign: 'center',
                  padding: '40px 20px',
                }}
              >
                <div>
                  <Bell
                    size={28}
                    style={{
                      marginBottom: '12px',
                      opacity: 0.5,
                    }}
                  />

                  <strong
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    {deviceError
                      ? 'Notifications unavailable'
                      : 'No financial notifications yet'}
                  </strong>

                  <p
                    style={{
                      opacity: 0.7,
                      margin: 0,
                    }}
                  >
                    {deviceError ||
                      'Shopping apps and promotions stay out of this inbox. EMI and loan alerts appear here.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="notification-list">
                {displayNotifications.map(
                  (item) => (
                    <div
                      className="notification-row"
                      key={item.id}
                    >
                      <div className="notification-icon">
                        <Bell size={14} />
                      </div>

                      <div className="notification-copy">
                        <div>
                          <strong>
                            {item.source}
                          </strong>

                          <span>
                            {item.received
                              ? new Date(
                                  item.received
                                ).toLocaleString()
                                      : 'Time unavailable'}
                          </span>
                        </div>

                        <p>
                          {item.message}
                        </p>

                        <small>
                          <span>
                            {item.isEmi ? 'EMI signal' : 'Other notification'}
                          </span>

                          <i />

                          <span>
                            {item.channel}
                          </span>
                        </small>

                        {item.originalText &&
                          item.originalText !==
                            item.message && (
                            <small
                              style={{
                                display:
                                  'block',
                                marginTop:
                                  '6px',
                                opacity:
                                  0.65,
                              }}
                            >
                              {item.originalText}
                            </small>
                          )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {confirmClear && (
        <div className="confirm-backdrop" onClick={() => setConfirmClear(false)}>
          <div className="confirm-card" onClick={(event) => event.stopPropagation()}>
            <h3>Clear all notifications?</h3>
            <p>This hides inbox alerts for your account. Reconstructed repayments stay on the calendar.</p>
            <div className="confirm-actions">
              <button type="button" onClick={() => setConfirmClear(false)}>Cancel</button>
              <button type="button" className="confirm-clear" disabled={clearing} onClick={clearNotifications}>
                {clearing ? 'Clearing…' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}