'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Cpu,
  IndianRupee,
  LayoutDashboard,
  MessageSquareText,
  Mic,
  Moon,
  Network,
  PanelLeft,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  WalletCards,
  X,
} from 'lucide-react'

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

const days = [
  { day: 1, muted: true },
  { day: 2, muted: true },
  { day: 3, muted: true },
  { day: 4, muted: true },
  { day: 5, amount: 2000, lender: 'Slice', color: '#b48cff' },
  { day: 6 },
  { day: 7 },
  { day: 8 },
  { day: 9 },
  { day: 10 },
  { day: 11 },
  { day: 12, amount: 1500, lender: 'LazyPay', color: '#44d7a8' },
  { day: 13 },
  { day: 14 },
  { day: 15 },
  { day: 16 },
  { day: 17 },
  { day: 18, amount: 2500, lender: 'Amazon Pay', color: '#7aa7ff' },
  { day: 19 },
  { day: 20 },
  { day: 21 },
  { day: 22 },
  { day: 23 },
  { day: 24, amount: 3000, lender: 'KreditBee', color: '#f4b860' },
  { day: 25 },
  { day: 26 },
  { day: 27 },
  { day: 28 },
  { day: 29 },
  { day: 30, amount: 1500, lender: 'HDFC Bank', color: '#ef8b8b' },
]

function money(amount: number) {
  return formatCompactINR(amount).replace('₹', '₹')
}

export function FinSentinelDashboard({
  userName: initialUserName = 'Kanishka',
}: {
  userName?: string
}) {
  const router = useRouter()
  const [authReady, setAuthReady] = useState(false)
  const [userName, setUserName] = useState(initialUserName)
  const [userEmail, setUserEmail] = useState('')
  const [activeNav, setActiveNav] = useState('Overview')
  const [emi, setEmi] = useState(4500)
  const [showWhy, setShowWhy] = useState(false)
  const [query, setQuery] = useState('')
  const [queryAnswer, setQueryAnswer] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDeckTheme, setIsDeckTheme] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('Last synced just now')
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)
  const [forecastDetails, setForecastDetails] = useState(false)

  const [summary, setSummary] = useState({
    monthly_income: monthlyIncome,
    total_existing_commitments: existingCommitment,
    current_dti: (existingCommitment / monthlyIncome) * 100,
    risk_status: 'HEALTHY',
    dti_threshold: safetyThreshold,
  })

  const [calendar, setCalendar] = useState<typeof days>(days)

  const [simulation, setSimulation] = useState({
    projected_dti: ((existingCommitment + emi) / monthlyIncome) * 100,
    threshold_delta: 0,
    warning_reasons: [] as string[],
    risk_status: 'HEALTHY',
  })

  const [dataError, setDataError] = useState('')

  const [liveNotifications, setLiveNotifications] = useState<any[]>([])
  const [deviceStatus, setDeviceStatus] = useState(
    'Waiting for notification data'
  )
  const [lastDeviceSync, setLastDeviceSync] = useState<string | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ''

  useEffect(() => {
    let cancelled = false

    async function checkAuthentication() {
      const result = await authClient.getMe()

      if (cancelled) return

      if (result.error || !result.data) {
        router.replace('/sign-in')
        return
      }

      const authenticatedName =
        result.data.name ||
        result.data.user?.name ||
        initialUserName

      setUserName(authenticatedName)
      setUserEmail(
        result.data.email ||
        result.data.user?.email ||
        ''
      )
      setAuthReady(true)
    }

    checkAuthentication()

    return () => {
      cancelled = true
    }
  }, [router, initialUserName])

  const profileIncome = summary.monthly_income || monthlyIncome
  const profileCommitment =
    summary.total_existing_commitments || existingCommitment
  const profileThreshold = summary.dti_threshold || safetyThreshold

  const obligationCount = calendar.length || obligations.length

  const parsedEvents = useMemo(
    () => parseNotifications(notifications),
    []
  )

  useEffect(() => {
    if (!authReady) return

    Promise.all([
      fetch(`${apiBase}/api/financial/summary`, {
        credentials: 'include',
      }),
      fetch(`${apiBase}/api/repayments/calendar`, {
        credentials: 'include',
      }),
    ])
      .then(async ([summaryResponse, calendarResponse]) => {
        if (!summaryResponse.ok || !calendarResponse.ok) {
          throw new Error('Unable to load financial data')
        }

        setSummary(await summaryResponse.json())
        setCalendar(await calendarResponse.json())
        setDataError('')
      })
      .catch(() =>
        setDataError(
          'Live data is unavailable. Showing the last local snapshot.'
        )
      )
  }, [apiBase, authReady])

  useEffect(() => {
    if (!authReady) return

    let cancelled = false

    async function loadLiveNotifications() {
      try {
        const response = await fetch(
          `${apiBase}/api/device/notifications`,
          {
            cache: 'no-store',
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Unable to load device notifications')
        }

        const data = await response.json()

        if (cancelled) return

        const records = Array.isArray(data)
          ? data
          : Array.isArray(data.records)
            ? data.records
            : Array.isArray(data.notifications)
              ? data.notifications
              : []

        setLiveNotifications(records)

        const status =
          data.deviceStatus ||
          data.device_status ||
          (records.length > 0
            ? 'Android device connected'
            : 'Waiting for EMI notifications')

        setDeviceStatus(status)

        setLastDeviceSync(
          data.lastSynced ||
          data.last_synced ||
          new Date().toISOString()
        )
      } catch {
        if (cancelled) return

        setDeviceStatus('Device connection unavailable')
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
  }, [apiBase, authReady])

  useEffect(() => {
    if (!authReady) return

    fetch(`${apiBase}/api/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        proposed_amount: 50000,
        proposed_emi: emi,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          setSimulation(await response.json())
        }
      })
      .catch(() => undefined)
  }, [apiBase, emi, authReady])

  async function handleSignOut() {
    await authClient.signOut()
    router.replace('/sign-in')
  }

  const initials = useMemo(() => {
    const parts = userName.trim().split(/\s+/).filter(Boolean)

    if (parts.length === 0) return 'FS'
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }, [userName])

  const graph = useMemo(
    () => reconstructLoanGraph(parsedEvents),
    [parsedEvents]
  )

  const total = profileCommitment + emi
  const dti = simulation.projected_dti
  const isRisk = simulation.risk_status === 'AT_RISK'

  const liveNotificationCount = liveNotifications.length

  const displayNotifications = liveNotifications.map(
    (item, index) => {
      const amount =
        item.amount ??
        item.parsed?.amount ??
        null

      const dueDate =
        item.dueDate ??
        item.due_date ??
        item.parsed?.due_date ??
        ''

      const text =
        item.text ??
        item.message ??
        item.parsed?.text ??
        'EMI notification received'

      const lender =
        item.title ??
        item.sender ??
        item.lender ??
        item.parsed?.lender_name ??
        'SMS notification'

      const received =
        item.detectedAt ??
        item.detected_at ??
        item.createdAt ??
        item.created_at ??
        ''

      return {
        id:
          item.id ??
          `${received}-${index}`,

        lender,

        received,

        message:
          amount !== null
            ? `EMI amount: ₹${Number(amount).toLocaleString('en-IN')}${dueDate ? ` · Due: ${dueDate}` : ''}`
            : text,

        originalText: text,

        language:
          item.language ??
          item.parsed?.language ??
          'English',

        channel:
          item.source ??
          item.packageName ??
          'SMS',

        amount,
        dueDate,
      }
    }
  )

  if (!authReady) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-mark">FS</div>
          <p className="eyebrow">FIN SENTINEL</p>
          <h1>Checking your workspace…</h1>
          <p className="auth-copy">
            Verifying your secure session.
          </p>
        </section>
      </main>
    )
  }

  function refreshData() {
    setSyncing(true)

    Promise.all([
      fetch(`${apiBase}/api/financial/summary`, {
        credentials: 'include',
      }),
      fetch(`${apiBase}/api/repayments/calendar`, {
        credentials: 'include',
      }),
      fetch(`${apiBase}/api/device/notifications`, {
        cache: 'no-store',
        credentials: 'include',
      }),
    ])
      .then(
        async ([
          summaryResponse,
          calendarResponse,
          deviceResponse,
        ]) => {
          if (summaryResponse.ok) {
            setSummary(await summaryResponse.json())
          }

          if (calendarResponse.ok) {
            setCalendar(await calendarResponse.json())
          }

          if (deviceResponse.ok) {
            const deviceData = await deviceResponse.json()

            const records = Array.isArray(deviceData)
              ? deviceData
              : Array.isArray(deviceData.records)
                ? deviceData.records
                : Array.isArray(deviceData.notifications)
                  ? deviceData.notifications
                  : []

            setLiveNotifications(records)

            setDeviceStatus(
              deviceData.deviceStatus ||
              deviceData.device_status ||
              (records.length > 0
                ? 'Android device connected'
                : 'Waiting for EMI notifications')
            )

            setLastDeviceSync(
              deviceData.lastSynced ||
              deviceData.last_synced ||
              new Date().toISOString()
            )
          }

          if (!summaryResponse.ok || !calendarResponse.ok) {
            throw new Error('Sync failed')
          }

          setDataError('')
          setSyncMessage('Synced just now')
        }
      )
      .catch(() => {
        setSyncMessage('Using local snapshot')
      })
      .finally(() => setSyncing(false))
  }

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

  function askQuery() {
    if (!query.trim()) return

    fetch(`${apiBase}/api/query/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('assistant unavailable')
        }

        const answer = (await response.json()).answer

        setQueryAnswer(answer)

        if ('speechSynthesis' in window) {
          window.speechSynthesis.speak(
            new SpeechSynthesisUtterance(answer)
          )
        }
      })
      .catch(() =>
        setQueryAnswer(
          'The local FIN SENTINEL backend is unavailable right now.'
        )
      )
  }

  return (
    <main
      className={`sentinel-shell ${isDeckTheme ? 'deck-theme' : ''
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
            className={`nav-item ${activeNav === 'Overview' ? 'active' : ''
              }`}
            onClick={() => setActiveNav('Overview')}
          >
            <LayoutDashboard size={17} />
            <span>Overview</span>
          </button>

          <button
            className={`nav-item ${activeNav === 'Notifications' ? 'active' : ''
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
            className={`nav-item ${activeNav === 'Repayment graph'
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
            className={`nav-item ${activeNav === 'Simulator' ? 'active' : ''
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
            <div className="avatar">{initials}</div>

            <div>
              <strong>{userName}</strong>
              <small>{userEmail || 'Personal workspace'}</small>
            </div>

            <ChevronDown
              size={15}
              className="muted-icon"
            />
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

            <button
              className="top-avatar"
              onClick={handleSignOut}
              title={`Sign out ${userName}`}
              aria-label={`Sign out ${userName}`}
            >
              {initials}
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
                picture for June 2026.
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
                {obligationCount} obligations linked
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
                {money(profileCommitment)}
                <span>/ month</span>
              </div>

              <div className="metric-foot">
                <span className="positive">
                  <ArrowUpRight size={13} />
                  5 obligations
                </span>

                <span>deduplicated</span>
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
                {money(profileIncome)}
                <span>net income</span>
              </div>

              <div className="metric-foot">
                <span className="neutral">
                  <Check size={13} />
                  User-provided
                </span>

                <span>June 2026</span>
              </div>
            </div>

            <div
              className={`metric-card ${isRisk ? 'risk-metric' : ''
                }`}
            >
              <div className="metric-icon amber">
                <AlertTriangle size={18} />
              </div>

              <div className="metric-label">
                CURRENT DTI RATIO
              </div>

              <div className="metric-value">
                {(
                  (profileCommitment /
                    profileIncome) *
                  100
                ).toFixed(1)}
                <span>%</span>
              </div>

              <div className="metric-foot">
                <span className="positive">
                  <Check size={13} />
                  Below {profileThreshold}% threshold
                </span>

                <span>healthy</span>
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
                ₹1,500
                <span>in 12 days</span>
              </div>

              <div className="metric-foot">
                <span className="lender-dot" />
                LazyPay BNPL
                <span>12 Jun</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <section className="panel calendar-panel">
              <div className="panel-heading">
                <div>
                  <h2>Repayment calendar</h2>

                  <p>
                    Upcoming obligations reconstructed from your notifications.
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
                  {monthOffset === 0
                    ? 'June 2026'
                    : 'July 2026'}

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
                  {(monthOffset === 0
                    ? calendar
                    : []
                  ).map((day, index) => (
                    <div
                      key={`${day.day}-${index}`}
                      className={`calendar-day ${day.muted ? 'muted-day' : ''} ${day.amount ? 'has-payment' : ''}`}
                    >
                      <span>{day.day}</span>

                      {day.amount && (
                        <div
                          className="payment-chip"
                          style={{
                            borderColor: day.color,
                            color: day.color,
                          }}
                        >
                          <b>
                            {money(day.amount)}
                          </b>

                          <small>
                            {day.lender}
                          </small>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="calendar-legend">
                <span>
                  <i className="legend-dot teal-dot" />
                  Due
                </span>

                <span>
                  <i className="legend-dot purple-dot" />
                  Paid
                </span>

                <span>
                  <i className="legend-dot gray-dot" />
                  No payment
                </span>

                <span className="legend-note">
                  <Cpu size={13} />
                  Parsed locally
                </span>
              </div>
            </section>

            <section className="panel forecast-panel">
              <div className="panel-heading">
                <div>
                  <h2>Cash-flow forecast</h2>

                  <p>
                    Payment concentration across the month.
                  </p>
                </div>

                <button
                  className="more-button"
                  aria-label="More options"
                  onClick={() =>
                    setForecastDetails(
                      (value) => !value
                    )
                  }
                >
                  •••
                </button>

                {forecastDetails && (
                  <div className="forecast-details">
                    Highest concentration: 12–24 Jun
                    <br />
                    Recommended buffer: ₹6,500
                  </div>
                )}
              </div>

              <div className="forecast-summary">
                <div>
                  <span className="metric-label">
                    PEAK WINDOW
                  </span>

                  <strong>
                    12 — 24 Jun
                  </strong>
                </div>

                <div className="forecast-risk">
                  <AlertTriangle size={15} />

                  <span>
                    Moderate
                    <br />
                    <small>concentration</small>
                  </span>
                </div>
              </div>

              <div className="bar-chart">
                {[
                  22, 17, 13, 8, 12, 36,
                  28, 19, 10, 14, 45, 57,
                  33, 20, 14, 12, 21, 33,
                ].map((height, index) => (
                  <div
                    className={`chart-bar ${index === 11 || index === 10 ? 'highlight' : ''}`}
                    style={{
                      height: `${height}%`,
                    }}
                    key={index}
                  />
                ))}
              </div>

              <div className="chart-axis">
                <span>1 Jun</span>
                <span>12 Jun</span>
                <span>24 Jun</span>
                <span>30 Jun</span>
              </div>

              <div className="forecast-callout">
                <div className="callout-icon">
                  <AlertTriangle size={15} />
                </div>

                <div>
                  <strong>
                    Payments cluster in 12 days
                  </strong>

                  <p>
                    ₹6,500 is due between 12–24 June. Keep a buffer available.
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
                    <SlidersHorizontal size={14} />
                    BEFORE-YOU-BORROW
                  </div>

                  <h2>Simulate a new loan</h2>

                  <p>See the impact before you commit.</p>
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
                      defaultValue="50,000"
                    />
                  </div>
                </div>

                <div className="emi-head">
                  <label>Estimated monthly EMI</label>

                  <strong>{formatINR(emi)}</strong>
                </div>

                <input
                  className="emi-slider"
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={emi}
                  onChange={(event) =>
                    setEmi(Number(event.target.value))
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
                    <span>PROJECTED COMMITMENT</span>

                    <strong>
                      {money(total)}
                      <small>/ month</small>
                    </strong>
                  </div>

                  <div className="result-divider" />

                  <div>
                    <span>PROJECTED DTI</span>

                    <strong
                      className={
                        isRisk
                          ? 'danger-text'
                          : 'teal-text'
                      }
                    >
                      {dti.toFixed(1)}%
                    </strong>
                  </div>

                  <div
                    className={`result-status ${isRisk ? 'danger-status' : ''}`}
                  >
                    <span className="status-dot" />

                    {isRisk
                      ? 'Needs attention'
                      : 'Within threshold'}
                  </div>
                </div>

                {isRisk && (
                  <div className="warning-card">
                    <div className="warning-top">
                      <div className="warning-symbol">
                        <AlertTriangle size={17} />
                      </div>

                      <div>
                        <strong>
                          Potential repayment stress
                        </strong>

                        <p>
                          Your projected DTI crosses the illustrative {profileThreshold}% safety threshold.
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
                            showWhy ? 'rotate' : ''
                          }
                        />
                      </button>
                    </div>

                    {showWhy && (
                      <div className="why-content">
                        <div className="why-row">
                          <span>Monthly income</span>

                          <b>{money(profileIncome)}</b>
                        </div>

                        <div className="why-row">
                          <span>Existing commitments</span>

                          <b>{money(profileCommitment)}</b>
                        </div>

                        <div className="why-row">
                          <span>Proposed EMI</span>

                          <b>{money(emi)}</b>
                        </div>

                        <div className="why-row">
                          <span>Payment cluster</span>

                          <b>12–24 June</b>
                        </div>

                        <p>
                          Adding this EMI would leave less room for essentials during your peak repayment window. Review the impact before proceeding.
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
                    <MessageSquareText size={14} />
                    FIN SENTINEL ASSIST
                  </div>

                  <h2>Ask your finances</h2>

                  <p>English, Hindi or Marathi.</p>
                </div>

                <div className="assist-online">
                  <span className="green-dot" />
                  Ready
                </div>
              </div>

              <div className="assistant-chat">
                <div className="assistant-message">
                  <div className="assistant-avatar">
                    <Sparkles size={15} />
                  </div>

                  <div>
                    <p>Ask me about your repayments, like:</p>

                    <button
                      onClick={() => {
                        setQuery(
                          'Meri agli EMI kab hai?'
                        )

                        setTimeout(
                          askQuery,
                          0
                        )
                      }}
                      className="suggested-query"
                    >
                      “Meri agli EMI kab hai?”
                      <ArrowUpRight size={13} />
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
                    setQuery(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' &&
                      !event.nativeEvent.isComposing &&
                      event.keyCode !== 229
                    ) {
                      askQuery()
                    }
                  }}
                  placeholder="Type or speak a question..."
                  aria-label="Ask FIN SENTINEL"
                />

                <button
                  className={`mic-button ${voiceEnabled ? 'active' : ''}`}
                  aria-label="Voice input"
                  onClick={startVoiceInput}
                >
                  <Mic size={16} />
                </button>

                <button
                  className="send-button"
                  aria-label="Send question"
                  onClick={askQuery}
                >
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="assistant-note">
                <ShieldCheck size={12} />
                Answers are generated from your local repayment graph.
              </div>
            </section>
          </div>

          <footer className="page-footer">
            <span>
              <ShieldCheck size={13} />
              Your financial data stays on this device.
            </span>

            <span>
              FIN SENTINEL v0.1 · The Mystic Merge
            </span>
          </footer>
        </div>
      </section>

      {showNotifications && (
        <div
          className="modal-backdrop"
          onClick={() => setShowNotifications(false)}
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
                  <MessageSquareText size={14} />
                  RECONSTRUCT
                </div>

                <h2>Notification inbox</h2>

                <p>{liveNotificationCount} live Android signals</p>
              </div>

              <button
                className="close-button"
                aria-label="Close notifications"
                onClick={() =>
                  setShowNotifications(false)
                }
              >
                <X size={18} />
              </button>
            </div>

            <div className="node-summary">
              <Network size={16} />

              <span>
                <strong>{deviceStatus}</strong>

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

              <Check size={15} />
            </div>

            {displayNotifications.length === 0 ? (
              <div
                className="notification-row"
                style={{
                  justifyContent: 'center',
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
                    No EMI notifications received yet
                  </strong>

                  <p
                    style={{
                      opacity: 0.7,
                      margin: 0,
                    }}
                  >
                    Send an EMI SMS to the Android phone while the notification listener is enabled.
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
                          <strong>{item.lender}</strong>

                          <span>
                            {item.received
                              ? new Date(
                                item.received
                              ).toLocaleString()
                              : 'Just now'}
                          </span>
                        </div>

                        <p>{item.message}</p>

                        <small>
                          <span>{item.language}</span>

                          <i />

                          <span>{item.channel}</span>
                        </small>

                        {item.originalText &&
                          item.originalText !==
                          item.message && (
                            <small
                              style={{
                                display: 'block',
                                marginTop: '6px',
                                opacity: 0.65,
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
    </main>
  )
}
