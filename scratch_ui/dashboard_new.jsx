<!DOCTYPE html>

<html className="light-theme" id="html-root" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Plus+Jakarta+Sans:wght@600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>
  @layer base {
    html, body { margin:0; padding:0; }
    body { overscroll-behavior:none; transition: background-color 0.3s ease, color 0.3s ease; }
    main>:first-child { margin-top:0!important; }
    main>:last-child { margin-bottom:0!important; }
  }
  ::-webkit-scrollbar { display:none; }

  /* Light Theme Adaptive Overrides */
  html.light-theme, html:not(.dark) {
    color-scheme: light;
  }
  html.light-theme body {
    background-color: #f4f6fb;
    color: #0f172a;
  }
  html.light-theme .theme-ambient-dark {
    opacity: 0.85;
  }
  html.light-theme .theme-sidebar {
    background-color: rgba(255, 255, 255, 0.82) !important;
    border-right: 1px solid rgba(0, 50, 150, 0.08);
    box-shadow: 4px 0 24px rgba(0, 50, 150, 0.03);
  }
  html.light-theme .theme-header {
    background-color: rgba(255, 255, 255, 0.85) !important;
    border-bottom: 1px solid rgba(0, 50, 150, 0.07);
    box-shadow: 0 4px 20px -2px rgba(0, 50, 150, 0.04);
  }
  html.light-theme .theme-card {
    background-color: rgba(255, 255, 255, 0.78) !important;
    border: 1px solid rgba(0, 50, 150, 0.08) !important;
    box-shadow: 0 10px 30px -5px rgba(0, 50, 150, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03) !important;
  }
  html.light-theme .theme-card-sub {
    background-color: rgba(243, 246, 253, 0.9) !important;
    border-color: rgba(0, 50, 150, 0.06) !important;
  }
  html.light-theme .theme-nav-hover:hover {
    background-color: rgba(0, 102, 255, 0.06) !important;
    color: #0050cb !important;
  }
  html.light-theme .theme-input {
    background-color: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid rgba(0, 50, 150, 0.12) !important;
    color: #0f172a !important;
  }
  html.light-theme .theme-text-main {
    color: #0f172a !important;
  }
  html.light-theme .theme-text-sub {
    color: #64748b !important;
  }
  html.light-theme .theme-gauge-track {
    stroke: #e2e8f0 !important;
  }
  html.light-theme .theme-gauge-center {
    background-color: #ffffff !important;
  }
  html.light-theme .theme-chart-bg {
    background-color: rgba(255, 255, 255, 0.6) !important;
    border: 1px solid rgba(0, 50, 150, 0.06);
  }
  html.light-theme .theme-grid-line {
    stroke: rgba(0, 50, 150, 0.08) !important;
  }

  /* Dark mode specific style rules */
  html.dark body {
    background-color: #121212;
    color: #e5e2e1;
  }
  html.dark .theme-sidebar {
    background-color: rgba(28, 27, 27, 0.8) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
  }
  html.dark .theme-header {
    background-color: rgba(14, 14, 14, 0.8) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  html.dark .theme-card {
    background-color: rgba(28, 27, 27, 0.7) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  html.dark .theme-card-sub {
    background-color: rgba(32, 31, 31, 0.6) !important;
    border-color: rgba(255, 255, 255, 0.05) !important;
  }
  html.dark .theme-input {
    background-color: rgba(14, 14, 14, 0.9) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    color: #e5e2e1 !important;
  }
  html.dark .theme-text-main {
    color: #e5e2e1 !important;
  }
  html.dark .theme-text-sub {
    color: #c2c6d8 !important;
  }
  html.dark .theme-gauge-track {
    stroke: rgba(53, 53, 52, 0.6) !important;
  }
  html.dark .theme-gauge-center {
    background-color: #1a1a1a !important;
  }
  html.dark .theme-chart-bg {
    background-color: rgba(14, 14, 14, 0.6) !important;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  html.dark .theme-grid-line {
    stroke: rgba(140, 144, 161, 0.2) !important;
  }
</style></head><body className="bg-[#f4f6fb] font-body-md text-body-md text-[#0f172a] min-h-screen relative selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden transition-colors duration-300"><div className="theme-ambient-dark fixed inset-0 pointer-events-none z-0 transition-opacity duration-500"><div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/10 blur-[130px]"></div><div className="absolute top-[25%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-400/12 blur-[140px]"></div><div className="absolute bottom-[-15%] left-[25%] w-[40vw] h-[40vw] rounded-full bg-indigo-300/10 blur-[120px]"></div></div><aside className="theme-sidebar fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,50,150,0.03)] z-50 flex flex-col justify-between transition-colors duration-300 border-r border-[#e2e8f0]"><div className="flex flex-col"><div className="h-16 px-space-md flex items-center gap-space-sm"><img alt="FIN SENTINEL Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WCUSakT6zpOUo0YGrPJg0HgtyLS1XOT89oPq77kHksE2bSOQUr6DA-Ld8P4WJEZlkAAoBxpCCpUPWJJndZO_c0IQ_IOOvqoDDXJ6fzIX4Ei33MsuD0ZqN6oUJpnEbGQSZTjxZm56IKVWQO5Yo4erGWDMv95rBRQDcQ9eFzIar9x00dRJ6-viUBmZg6_6_n6kzvcSXCOOGvV5ASHKbE3IdUB-YZLgNyXTEleKqM97vhmOsXs5ZwOPyWrtQ"/><div className="flex flex-col"><span className="font-headline-sm text-headline-sm tracking-tight text-on-surface theme-text-main font-bold">FIN SENTINEL</span><span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Intelligence Core</span></div></div><div className="px-space-md pt-space-md pb-space-xs"><span className="font-label-sm text-label-sm uppercase tracking-widest text-outline px-space-xs">Surveillance Navigation</span></div><nav className="flex flex-col gap-space-xs px-space-sm" data-active-classes="bg-primary-container text-on-primary-container font-headline-sm shadow-[0_0_16px_rgba(0,102,255,0.35)]"><a aria-current="page" className="group flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg transition-all bg-primary-container text-white font-headline-sm shadow-[0_4px_16px_rgba(0,102,255,0.3)]" data-path="overview" href="#"><span className="material-symbols-outlined text-white transition-colors">grid_view</span><span className="font-body-md text-body-md font-semibold text-white">Overview</span></a><a className="group flex items-center justify-between px-space-sm py-space-sm rounded-lg text-slate-600 hover:bg-blue-50/80 hover:text-primary transition-all theme-nav-hover theme-text-sub" data-path="notifications" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">notifications_active</span><span className="font-body-md text-body-md">Notifications</span></div><span className="px-space-xs py-0.5 rounded-full bg-purple-100 text-purple-700 font-label-sm text-label-sm font-semibold">12</span></a><a className="group flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg text-slate-600 hover:bg-blue-50/80 hover:text-primary transition-all theme-nav-hover theme-text-sub" data-path="calendar" href="#"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">calendar_today</span><span className="font-body-md text-body-md">Calendar</span></a><a className="group flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg text-slate-600 hover:bg-blue-50/80 hover:text-primary transition-all theme-nav-hover theme-text-sub" data-path="simulator" href="#"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">vital_signs</span><span className="font-body-md text-body-md">Simulator</span></a><a className="group flex items-center justify-between px-space-sm py-space-sm rounded-lg text-slate-600 hover:bg-blue-50/80 hover:text-primary transition-all theme-nav-hover theme-text-sub" data-path="ai-assistant" href="#"><div className="flex items-center gap-space-sm"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">smart_toy</span><span className="font-body-md text-body-md">AI Assistant</span></div><span className="px-space-xs py-0.5 rounded-full bg-blue-100 text-blue-700 font-label-sm text-label-sm font-semibold">v2.4</span></a><a className="group flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg text-slate-600 hover:bg-blue-50/80 hover:text-primary transition-all theme-nav-hover theme-text-sub" data-path="security-settings" href="#"><span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">shield</span><span className="font-body-md text-body-md">Security Settings</span></a></nav></div><div className="p-space-md"><div className="theme-card-sub p-space-sm rounded-xl bg-slate-100/90 backdrop-blur-md flex flex-col gap-space-xs border border-slate-200/80 shadow-sm"><div className="flex items-center justify-between"><span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Cluster Latency</span><span className="font-tabular-data-md text-tabular-data-md text-primary font-bold">18ms</span></div><div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden"><div className="bg-primary-container h-full w-[94%]"></div></div><div className="flex items-center justify-between pt-space-xs"><span className="font-label-sm text-label-sm text-outline">Quantum Vault</span><span className="font-label-sm text-label-sm text-emerald-600 font-semibold theme-text-sub">Armed</span></div></div></div></aside><div className="pl-64 min-h-screen flex flex-col"><header className="theme-header fixed top-0 left-64 right-0 h-16 bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,50,150,0.04)] z-40 flex items-center justify-between px-margin-desktop border-b border-slate-200/80 transition-colors duration-300"><div className="flex items-center gap-space-md"><div className="theme-card-sub inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-blue-50/80 backdrop-blur-md border border-blue-100"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span><span className="font-label-sm text-label-sm tracking-wide text-slate-700 theme-text-sub font-medium">Live Sentinel Sync <span className="text-slate-400">•</span> <span className="text-primary font-semibold">Real-Time Protection</span></span></div><div className="relative hidden lg:flex items-center"><span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">search</span><input className="theme-input h-9 pl-9 pr-space-md w-72 rounded-lg bg-white/90 font-body-sm text-body-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm border border-slate-200" placeholder="Telemetry query or asset hash (Ctrl+K)..." type="text"/></div></div><div className="flex items-center gap-space-md">
<!-- Interactive Theme Toggle Button (Light active state) -->
<div className="relative inline-flex items-center">
<button aria-label="Toggle visual theme" className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 theme-card border border-slate-200 hover:border-primary/40 text-slate-700 hover:text-slate-900 transition-all duration-300 cursor-pointer shadow-sm" id="theme-toggle-btn" onclick="toggleTheme()" type="button">
<div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
<!-- Dark Icon -->
<span className="material-symbols-outlined text-[19px] text-primary transition-all duration-300 transform rotate-90 scale-0 opacity-0 absolute" id="theme-icon-dark">dark_mode</span>
<!-- Light Icon -->
<span className="material-symbols-outlined text-[19px] text-amber-500 transition-all duration-300 transform rotate-0 scale-100" id="theme-icon-light">light_mode</span>
</div>
<span className="font-label-sm text-label-sm font-semibold tracking-wide theme-text-main hidden sm:inline-block" id="theme-label">Light</span>
<span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-0.5 transition-all"></span>
</button>
</div>
<button className="relative h-9 w-9 rounded-lg bg-white/90 theme-card text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all border border-slate-200 shadow-sm" type="button"><span className="material-symbols-outlined text-[20px] theme-text-sub">notifications</span><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary ring-2 ring-white"></span></button><div className="h-6 w-px bg-slate-200"></div><div className="flex items-center gap-space-sm"><img alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30 shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1UavT57Eckhwj1xtlqeind4CpYCuhIPFSFrkv8YbltG9GfJquKbyP1s6xrOeDWNOIcw54m-zTKMHIqlYLapPGTqHa5OdGsIX0rv8-ZzZzbHKV3w4ybP4IZU_r9is5GWB46Jeq66Dfmisv1XaUx5QrGRkmDs6tIQLWcqfFAHL-8tCGMVmVdw9H1LCliIHtQ4K8urM0AILrCc28aTJfSBY6Z6oUlrLRiOQj5p1xR1PrmfeW7dmg1abRbjn0XL"/><div className="hidden xl:flex flex-col text-left"><span className="font-headline-sm text-headline-sm leading-tight text-on-surface theme-text-main font-bold">Elena Vance</span><span className="font-label-sm text-label-sm text-outline">Chief Risk Officer</span></div></div></div></header><main className="relative pt-16 flex-1 w-full px-margin-desktop py-space-lg z-10"><div className="flex flex-col w-full gap-space-lg">
<!-- Top Glass HUD Bar / Live Telemetry -->
<div className="theme-card relative w-full rounded-2xl bg-white/75 backdrop-blur-xl p-space-md shadow-[0_4px_20px_-2px_rgba(0,50,150,0.06),0_2px_6px_rgba(0,0,0,0.04)] overflow-hidden border border-slate-200/80">
<div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none"></div>
<div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-purple-400/12 blur-3xl pointer-events-none"></div>
<div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
<!-- Title & Live Status -->
<div className="flex items-center gap-space-md">
<!-- Hologram Shield Beacon matching icon token -->
<div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-white/90 theme-card shadow-sm border border-slate-200">
<svg className="w-9 h-9 drop-shadow-[0_2px_8px_rgba(0,102,255,0.4)]" fill="none" viewbox="0 0 100 100">
<path d="M50 8L86 23V52C86 73.5 70.8 90.6 50 96C29.2 90.6 14 73.5 14 52V23L50 8Z" fill="rgba(0,102,255,0.08)" stroke="#0066FF" stroke-linejoin="round" stroke-width="4"></path>
<path d="M50 20L74 31V51C74 65.5 63.8 77.2 50 82C36.2 77.2 26 65.5 26 51V31L50 20Z" fill="none" stroke="#00C853" stroke-dasharray="5 4" stroke-width="3"></path>
<circle className="animate-pulse" cx="50" cy="50" fill="#0066FF" r="14"></circle>
<path d="M50 42V58M42 50H58" stroke="#ffffff" stroke-linecap="round" stroke-width="3"></path>
</svg>
<span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary-container"></span>
</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-space-xs">
<span className="font-headline-lg text-headline-lg text-on-surface theme-text-main tracking-tight font-bold">Financial Sentinel Core</span>
<span className="px-2 py-0.5 rounded-full bg-blue-100 text-primary font-label-sm text-label-sm tracking-widest uppercase font-semibold">Autonomous</span>
</div>
<p className="font-body-sm text-body-sm text-slate-500 theme-text-sub">Real-time systemic solvency surveillance • Quantum node <span className="font-tabular-data-md text-tabular-data-md text-primary font-semibold">US-EAST-4</span> active</p>
</div>
</div>
<!-- Quick Action Controls & Tab Switcher -->
<div className="flex flex-wrap items-center gap-space-xs bg-slate-100/90 theme-card-sub p-1 rounded-xl border border-slate-200">
<button className="tab-btn px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-all duration-200 bg-primary-container text-white shadow-[0_2px_12px_rgba(0,102,255,0.35)]" id="tab-btn-overview" onclick="switchTab('overview')">
<span className="inline-flex items-center gap-1.5 font-semibold"><span className="material-symbols-outlined text-[18px]">query_stats</span>Overview</span>
</button>
<button className="tab-btn px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-white/80 theme-text-sub font-semibold" id="tab-btn-notifications" onclick="switchTab('notifications')">
<span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">crisis_alert</span>Alerts <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-label-sm font-label-sm font-semibold">4</span></span>
</button>
<button className="tab-btn px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-white/80 theme-text-sub font-semibold" id="tab-btn-calendar" onclick="switchTab('calendar')">
<span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">event_repeat</span>Commitments</span>
</button>
<button className="tab-btn px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-white/80 theme-text-sub font-semibold" id="tab-btn-simulator" onclick="switchTab('simulator')">
<span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">ssid_chart</span>Stress Simulator</span>
</button>
<button className="tab-btn px-space-md py-2 rounded-lg font-headline-sm text-headline-sm transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-white/80 theme-text-sub font-semibold" id="tab-btn-assistant" onclick="switchTab('assistant')">
<span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">psychology</span>AI Risk Copilot</span>
</button>
<button className="px-space-sm py-2 rounded-lg font-label-md text-label-md text-primary hover:bg-blue-100/60 transition-all flex items-center gap-1 font-semibold" onclick="toggleCodeModal()" title="Inspect React Architecture">
<span className="material-symbols-outlined text-[18px]">terminal</span>Code
        </button>
</div>
</div>
</div>
<!-- TAB CONTAINER 1: OVERVIEW -->
<section className="tab-panel flex flex-col gap-space-lg transition-opacity duration-300" id="panel-overview">
<!-- Row 1: Metrics Bento Grid with Light Cyber Glass -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
<!-- Metric Card 1: Total Monthly Income -->
<div className="theme-card lg:col-span-4 rounded-2xl bg-white/75 backdrop-blur-xl p-space-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,102,255,0.14)] active:scale-[0.98] flex flex-col justify-between group cursor-pointer border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)]">
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-9 h-9 rounded-xl bg-blue-100/80 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
</div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Total Monthly Inflow</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-tabular-data-md text-tabular-data-md flex items-center gap-0.5 font-bold border border-emerald-200/60">
<span className="material-symbols-outlined text-[14px]">trending_up</span> +12.4%
          </span>
</div>
<div className="my-space-sm">
<div className="font-headline-xl text-headline-xl text-on-surface theme-text-main tracking-tight font-bold">$28,450.00</div>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">vs $25,310.00 prev period • High liquidity band</p>
</div>
<!-- Inline Sparkline SVG Chart with gradient fill -->
<div className="w-full pt-space-xs">
<svg className="w-full h-14 overflow-visible" fill="none" viewbox="0 0 260 55">
<defs>
<lineargradient id="blueSparkGrad" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#0066FF" stop-opacity="0.25"></stop>
<stop offset="100%" stop-color="#0066FF" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
<path d="M0 45 C 30 42, 50 30, 80 34 C 110 38, 130 18, 160 22 C 190 26, 210 10, 240 8 L 260 5 L 260 55 L 0 55 Z" fill="url(#blueSparkGrad)"></path>
<path d="M0 45 C 30 42, 50 30, 80 34 C 110 38, 130 18, 160 22 C 190 26, 210 10, 240 8 L 260 5" stroke="#0066FF" stroke-linecap="round" stroke-width="2.5"></path>
<circle className="filter drop-shadow-[0_2px_4px_rgba(0,102,255,0.4)]" cx="260" cy="5" fill="#0066FF" r="4.5" stroke="#ffffff" stroke-width="1.5"></circle>
</svg>
</div>
</div>
<!-- Metric Card 2: Recurring Commitments -->
<div className="theme-card lg:col-span-4 rounded-2xl bg-white/75 backdrop-blur-xl p-space-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(154,37,174,0.12)] active:scale-[0.98] flex flex-col justify-between group cursor-pointer border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)]">
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-space-xs">
<div className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center text-purple-700">
<span className="material-symbols-outlined text-[20px]">lock_clock</span>
</div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Fixed Commitments</span>
</div>
<span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-tabular-data-md text-tabular-data-md font-bold border border-purple-200/60">
            Scheduled Hedges
          </span>
</div>
<div className="my-space-sm">
<div className="font-headline-xl text-headline-xl text-on-surface theme-text-main tracking-tight font-bold">$8,120.00</div>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">Allocated to 6 syndicated loan &amp; credit tranches</p>
</div>
<!-- Tranche allocation progress bars -->
<div className="flex flex-col gap-1.5 pt-space-xs">
<div className="flex justify-between font-label-sm text-label-sm text-outline">
<span>Debt Obligations ($5,400)</span>
<span className="text-on-surface theme-text-main font-semibold">66.5%</span>
</div>
<div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
<div className="h-full bg-primary-container" style="width: 66.5%;"></div>
<div className="h-full bg-secondary" style="width: 22%;"></div>
<div className="h-full bg-amber-500" style="width: 11.5%;"></div>
</div>
<div className="flex items-center gap-space-md font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-container"></span>Senior Loans</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span>Hedge Collateral</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Yield Sweeps</span>
</div>
</div>
</div>
<!-- Metric Card 3: Debt-To-Income (DTI) Radial Gauge -->
<div className="theme-card lg:col-span-4 rounded-2xl bg-white/75 backdrop-blur-xl p-space-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,200,83,0.12)] active:scale-[0.98] flex items-center justify-between group cursor-pointer border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)]">
<div className="flex flex-col justify-between h-full">
<div>
<div className="flex items-center gap-space-xs">
<div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-on-surface theme-text-main">
<span className="material-symbols-outlined text-[20px] text-primary">speed</span>
</div>
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Solvency Ratio (DTI)</span>
</div>
<div className="mt-3">
<div className="font-headline-xl text-headline-xl text-on-surface theme-text-main tracking-tight font-bold">28.5%</div>
<p className="font-body-sm text-body-sm text-emerald-600 flex items-center gap-1 mt-0.5 font-semibold">
<span className="material-symbols-outlined text-[16px]">verified</span>
                Optimal (&lt; 35% safe ceiling)
              </p>
</div>
</div>
<div className="font-label-sm text-label-sm text-outline theme-text-sub font-medium">
            Max Tolerance: <span className="text-rose-600 font-tabular-data-md font-bold">45.0%</span>
</div>
</div>
<!-- Radial Gauge with Dual Gradient Arc -->
<div className="relative w-32 h-32 flex items-center justify-center">
<svg className="w-32 h-32 transform -rotate-90" viewbox="0 0 100 100">
<circle className="theme-gauge-track text-slate-200" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" stroke-width="9"></circle>
<circle className="transition-all duration-1000 ease-out" cx="50" cy="50" fill="transparent" r="38" stroke="url(#dtiGradient)" stroke-dasharray="238.76" stroke-dashoffset="170.7" stroke-linecap="round" stroke-width="9"></circle>
<defs>
<lineargradient id="dtiGradient" x1="0" x2="1" y1="0" y2="1">
<stop offset="0%" stop-color="#0066FF"></stop>
<stop offset="60%" stop-color="#9C27B0"></stop>
<stop offset="100%" stop-color="#00C853"></stop>
</lineargradient>
</defs>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
<span className="font-headline-sm text-headline-sm font-bold text-on-surface theme-text-main">28.5%</span>
<span className="font-label-sm text-label-sm text-emerald-600 font-bold tracking-wider">PRIME</span>
</div>
</div>
</div>
</div>
<!-- Row 2: Secondary Institutional Asset Stream & Quick Live Tape -->
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
<!-- Live Exposure Streams -->
<div className="theme-card lg:col-span-8 rounded-2xl bg-white/75 backdrop-blur-xl p-space-md flex flex-col gap-space-md border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)]">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary">ssid_chart</span>
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Portfolio Liquidity Velocity &amp; Outflow Bands</span>
</div>
<div className="flex items-center gap-2">
<span className="px-2.5 py-1 rounded-md bg-slate-100 theme-card-sub text-label-sm font-label-sm text-slate-700 font-semibold cursor-pointer">1W</span>
<span className="px-2.5 py-1 rounded-md bg-primary-container text-label-sm font-label-sm text-white shadow-[0_2px_8px_rgba(0,102,255,0.3)] font-semibold cursor-pointer">1M</span>
<span className="px-2.5 py-1 rounded-md bg-slate-100 theme-card-sub text-label-sm font-label-sm text-slate-700 font-semibold cursor-pointer">1Y</span>
</div>
</div>
<!-- Custom SVG Area chart with dual streams -->
<div className="theme-chart-bg w-full h-56 relative rounded-xl bg-white/60 p-2 overflow-hidden flex flex-col justify-end border border-slate-200/60">
<div className="absolute top-3 left-4 flex gap-4 text-label-sm font-label-sm font-semibold">
<span className="flex items-center gap-1.5 text-primary"><span className="w-2.5 h-2.5 rounded-sm bg-primary-container"></span>Net Inflow Trend</span>
<span className="flex items-center gap-1.5 text-purple-700"><span className="w-2.5 h-2.5 rounded-sm bg-purple-600"></span>Hedge Amortization</span>
</div>
<svg className="w-full h-44 overflow-visible" preserveaspectratio="none" viewbox="0 0 600 160">
<defs>
<lineargradient id="area1" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#0066FF" stop-opacity="0.22"></stop>
<stop offset="100%" stop-color="#0066FF" stop-opacity="0.01"></stop>
</lineargradient>
<lineargradient id="area2" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stop-color="#9C27B0" stop-opacity="0.15"></stop>
<stop offset="100%" stop-color="#9C27B0" stop-opacity="0.0"></stop>
</lineargradient>
</defs>
<!-- Grid Lines -->
<line className="theme-grid-line text-slate-200" stroke="currentColor" stroke-dasharray="4 4" x1="0" x2="600" y1="40" y2="40"></line>
<line className="theme-grid-line text-slate-200" stroke="currentColor" stroke-dasharray="4 4" x1="0" x2="600" y1="80" y2="80"></line>
<line className="theme-grid-line text-slate-200" stroke="currentColor" stroke-dasharray="4 4" x1="0" x2="600" y1="120" y2="120"></line>
<!-- Stream 2 (Hedge) -->
<path d="M0,130 C100,125 150,110 250,115 C350,120 420,95 520,80 L600,75 L600,160 L0,160 Z" fill="url(#area2)"></path>
<path d="M0,130 C100,125 150,110 250,115 C350,120 420,95 520,80 L600,75" fill="none" stroke="#9C27B0" stroke-width="2.5"></path>
<!-- Stream 1 (Inflow) -->
<path d="M0,110 C80,90 160,115 240,65 C320,30 400,75 500,40 L600,28 L600,160 L0,160 Z" fill="url(#area1)"></path>
<path d="M0,110 C80,90 160,115 240,65 C320,30 400,75 500,40 L600,28" fill="none" stroke="#0066FF" stroke-width="3"></path>
<!-- Focal Node Marker -->
<circle className="filter drop-shadow-[0_2px_6px_rgba(0,102,255,0.4)]" cx="500" cy="40" fill="#0066FF" r="5" stroke="#FFFFFF" stroke-width="2"></circle>
</svg>
<div className="flex justify-between items-center px-3 pt-2 font-tabular-data-md text-body-sm text-slate-500 font-semibold">
<span>Nov 01</span>
<span>Nov 08</span>
<span>Nov 15</span>
<span>Nov 22</span>
<span>Today (Nov 29)</span>
</div>
</div>
</div>
<!-- Live Rebalance Guardrails Card -->
<div className="theme-card lg:col-span-4 rounded-2xl bg-white/75 backdrop-blur-xl p-space-md flex flex-col justify-between border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)]">
<div>
<div className="flex items-center justify-between pb-space-xs">
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Autonomous Safeguards</span>
<span className="relative flex h-2.5 w-2.5">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
</div>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">Automated smart contract triggers</p>
<div className="flex flex-col gap-space-sm mt-space-md">
<div className="theme-card-sub p-space-sm rounded-xl bg-slate-50/90 flex items-center justify-between border border-slate-200/60">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
<div>
<div className="font-label-md text-label-md text-on-surface theme-text-main font-semibold">Auto-Deleverage Threshold</div>
<div className="font-body-sm text-body-sm text-outline">Liquidates bond tranches at 42% DTI</div>
</div>
</div>
<span className="font-tabular-data-md text-tabular-data-md text-primary font-bold">ARMED</span>
</div>
<div className="theme-card-sub p-space-sm rounded-xl bg-slate-50/90 flex items-center justify-between border border-slate-200/60">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-emerald-600 text-[18px]">swap_horizontal_circle</span>
<div>
<div className="font-label-md text-label-md text-on-surface theme-text-main font-semibold">Treasury Yield Sweep</div>
<div className="font-body-sm text-body-sm text-outline">Daily sweeps over $50k idle fiat</div>
</div>
</div>
<span className="font-tabular-data-md text-tabular-data-md text-emerald-600 font-bold">ACTIVE</span>
</div>
<div className="theme-card-sub p-space-sm rounded-xl bg-slate-50/90 flex items-center justify-between border border-slate-200/60">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-purple-700 text-[18px]">lock_reset</span>
<div>
<div className="font-label-md text-label-md text-on-surface theme-text-main font-semibold">Curve Hedging Lock</div>
<div className="font-body-sm text-body-sm text-outline">SOFR cap spread collar @ 4.85%</div>
</div>
</div>
<span className="font-tabular-data-md text-tabular-data-md text-purple-700 font-bold">SET</span>
</div>
</div>
</div>
<button className="w-full mt-4 py-2.5 rounded-xl bg-primary-container text-white font-headline-sm text-headline-sm flex items-center justify-center gap-2 hover:shadow-[0_4px_16px_rgba(0,102,255,0.4)] transition-all cursor-pointer font-bold" onclick="switchTab('simulator')">
<span className="material-symbols-outlined text-[18px]">play_arrow</span> Run Stress Rebalance
        </button>
</div>
</div>
</section>
<!-- TAB CONTAINER 2: NOTIFICATIONS PANEL -->
<section className="tab-panel hidden flex-col gap-space-md transition-opacity duration-300" id="panel-notifications">
<div className="flex items-center justify-between">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface theme-text-main font-bold">Surveillance Alerts &amp; Liquidity Warnings</h2>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">Hover to intensify telemetry. Click any alert tile to acknowledge &amp; slide out to archive.</p>
</div>
<div className="flex items-center gap-2">
<button className="theme-card-sub px-3 py-1.5 rounded-lg bg-slate-100 text-label-md font-label-md text-slate-700 font-semibold theme-text-main hover:bg-slate-200 flex items-center gap-1 border border-slate-200" onclick="resetNotifications()">
<span className="material-symbols-outlined text-[16px]">refresh</span> Reset List
        </button>
</div>
</div>
<!-- Notification Tiles Stack -->
<div className="flex flex-col gap-space-sm" id="notifications-list">
<!-- Tile 1: Margin Requirement (Amber) -->
<div className="theme-card group relative rounded-2xl bg-white/80 backdrop-blur-xl p-space-md transition-all duration-300 hover:bg-white cursor-pointer flex items-center justify-between shadow-[0_4px_18px_rgba(0,50,150,0.05)] border border-slate-200" id="notif-1" onclick="dismissNotif('notif-1')">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-200/60">
<span className="material-symbols-outlined text-[24px]">warning</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Margin requirement update</span>
<span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-label-sm text-label-sm font-semibold">High Priority</span>
</div>
<p className="font-body-md text-body-md text-slate-600 theme-text-sub mt-0.5">Account #4892 flagged for collateral rebalance within current settlement window.</p>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="text-right">
<div className="font-tabular-data-lg text-tabular-data-lg font-bold text-amber-600 group-hover:drop-shadow-[0_2px_8px_rgba(217,119,6,0.3)] transition-all">
              +$4,200.00 Required
            </div>
<span className="font-label-sm text-label-sm text-outline">Action Due: 3h 40m</span>
</div>
<button className="theme-card-sub w-8 h-8 rounded-lg bg-slate-100 text-outline group-hover:text-primary flex items-center justify-center border border-slate-200">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
</button>
</div>
</div>
<!-- Tile 2: Automated Treasury Yield Swept (Teal/Blue) -->
<div className="theme-card group relative rounded-2xl bg-white/80 backdrop-blur-xl p-space-md transition-all duration-300 hover:bg-white cursor-pointer flex items-center justify-between shadow-[0_4px_18px_rgba(0,50,150,0.05)] border border-slate-200" id="notif-2" onclick="dismissNotif('notif-2')">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-200/60">
<span className="material-symbols-outlined text-[24px]">savings</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Automated treasury yield swept</span>
<span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-label-sm text-label-sm font-semibold">Automated</span>
</div>
<p className="font-body-md text-body-md text-slate-600 theme-text-sub mt-0.5">High-yield institutional cash reserve credited across diversified repo desk.</p>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="text-right">
<div className="font-tabular-data-lg text-tabular-data-lg font-bold text-primary group-hover:drop-shadow-[0_2px_8px_rgba(0,102,255,0.3)] transition-all">
              +$18,450.00 Credited
            </div>
<span className="font-label-sm text-label-sm text-outline">Settled: Automated</span>
</div>
<button className="theme-card-sub w-8 h-8 rounded-lg bg-slate-100 text-outline group-hover:text-primary flex items-center justify-center border border-slate-200">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
</button>
</div>
</div>
<!-- Tile 3: Credit Facility Payment Due (Amber) -->
<div className="theme-card group relative rounded-2xl bg-white/80 backdrop-blur-xl p-space-md transition-all duration-300 hover:bg-white cursor-pointer flex items-center justify-between shadow-[0_4px_18px_rgba(0,50,150,0.05)] border border-slate-200" id="notif-3" onclick="dismissNotif('notif-3')">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-200/60">
<span className="material-symbols-outlined text-[24px]">schedule</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Credit facility payment due in 48h</span>
<span className="px-2 py-0.5 rounded-full bg-slate-100 theme-card-sub text-slate-700 font-label-sm text-label-sm font-semibold">Syndicate</span>
</div>
<p className="font-body-md text-body-md text-slate-600 theme-text-sub mt-0.5">Synthetic hedge syndicate commitment scheduled for automatic liquidation.</p>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="text-right">
<div className="font-tabular-data-lg text-tabular-data-lg font-bold text-amber-600 group-hover:drop-shadow-[0_2px_8px_rgba(217,119,6,0.3)] transition-all">
              $12,800.00 Due
            </div>
<span className="font-label-sm text-label-sm text-outline">Window: T-48 Hours</span>
</div>
<button className="theme-card-sub w-8 h-8 rounded-lg bg-slate-100 text-outline group-hover:text-primary flex items-center justify-center border border-slate-200">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
</button>
</div>
</div>
<!-- Tile 4: Risk Anomaly Detected -->
<div className="theme-card group relative rounded-2xl bg-white/80 backdrop-blur-xl p-space-md transition-all duration-300 hover:bg-white cursor-pointer flex items-center justify-between shadow-[0_4px_18px_rgba(0,50,150,0.05)] border border-slate-200" id="notif-4" onclick="dismissNotif('notif-4')">
<div className="flex items-center gap-space-md">
<div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-200/60">
<span className="material-symbols-outlined text-[24px]">bolt</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Risk anomaly detected</span>
<span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-label-sm text-label-sm font-semibold">Macro Spread</span>
</div>
<p className="font-body-md text-body-md text-slate-600 theme-text-sub mt-0.5">Sovereign bond spread spike (+18bps) detected across cross-currency hedging tranches.</p>
</div>
</div>
<div className="flex items-center gap-space-md">
<div className="text-right">
<div className="font-tabular-data-lg text-tabular-data-lg font-bold text-purple-700 group-hover:drop-shadow-[0_2px_8px_rgba(154,37,174,0.3)] transition-all">
              +18 bps
            </div>
<span className="font-label-sm text-label-sm text-outline">Simulation advisory ready</span>
</div>
<button className="theme-card-sub w-8 h-8 rounded-lg bg-slate-100 text-outline group-hover:text-primary flex items-center justify-center border border-slate-200">
<span className="material-symbols-outlined text-[18px]">check_circle</span>
</button>
</div>
</div>
</div>
</section>
<!-- TAB CONTAINER 3: CALENDAR PANEL -->
<section className="tab-panel hidden flex-col gap-space-md transition-opacity duration-300" id="panel-calendar">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface theme-text-main font-bold">Institutional Commitment Calendar</h2>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">Automated ledger of term debt maturities, capital calls, and liquidity sweeps.</p>
</div>
<!-- Calendar Controls -->
<div className="theme-card-sub flex items-center gap-space-sm bg-white/90 p-1.5 rounded-xl border border-slate-200 shadow-sm">
<button className="p-1 rounded-lg text-outline hover:text-slate-800 hover:bg-slate-100 transition-colors">
<span className="material-symbols-outlined text-[20px]">chevron_left</span>
</button>
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main px-space-sm font-bold">November 2025</span>
<button className="p-1 rounded-lg text-outline hover:text-slate-800 hover:bg-slate-100 transition-colors">
<span className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
<div className="h-5 w-px bg-slate-200 mx-1"></div>
<button className="px-2.5 py-1 rounded-md bg-white shadow-sm theme-card text-label-md font-label-md text-on-surface theme-text-main font-semibold">Month</button>
<button className="px-2.5 py-1 rounded-md text-label-md font-label-md text-outline hover:text-slate-800">Quarter</button>
</div>
</div>
<!-- Calendar Grid Matrix -->
<div className="theme-card rounded-2xl bg-white/75 backdrop-blur-xl p-space-md shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)] flex flex-col gap-2 border border-slate-200/80">
<!-- Weekday Headers -->
<div className="grid grid-cols-7 gap-2 text-center pb-2">
<span className="font-label-sm text-label-sm text-outline font-semibold">MON</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">TUE</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">WED</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">THU</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">FRI</span>
<span className="font-label-sm text-label-sm text-outline text-purple-700/80 font-semibold">SAT</span>
<span className="font-label-sm text-label-sm text-outline text-purple-700/80 font-semibold">SUN</span>
</div>
<!-- Month Dates Grid (5 rows of 7 days) -->
<div className="grid grid-cols-7 gap-2">
<!-- Day 1-3 -->
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/50 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">27</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/50 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">28</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/50 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">29</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/50 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">30</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">1</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">2</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">3</span>
</div>
<!-- Week 2 -->
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">4</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">5</span>
<!-- Paid Invoice Chip -->
<div className="px-2 py-1 rounded-md bg-blue-50 text-primary border border-blue-200 font-label-sm text-label-sm truncate font-semibold cursor-pointer">
            Paid: $14,200 Inv
          </div>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">6</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">7</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">8</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">9</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">10</span>
</div>
<!-- Week 3 -->
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">11</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">12</span>
<!-- Due Term Note Chip -->
<div className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-label-sm text-label-sm truncate font-semibold cursor-pointer">
            Due: $4,500 Term Note
          </div>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">13</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">14</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">15</span>
<div className="px-2 py-1 rounded-md bg-blue-50 text-primary border border-blue-200 font-label-sm text-label-sm truncate font-semibold cursor-pointer">
            Sweep: +$9,100
          </div>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">16</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">17</span>
</div>
<!-- Week 4: Today active highlighted with clean blue halo -->
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">18</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">19</span>
</div>
<div className="min-h-24 p-2 rounded-xl bg-blue-50/80 shadow-[0_4px_16px_rgba(0,102,255,0.15)] flex flex-col justify-between relative overflow-hidden border-2 border-primary">
<div className="flex items-center justify-between">
<span className="font-tabular-data-md text-tabular-data-md font-bold text-primary">20 Today</span>
<span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
</div>
<div className="px-2 py-1 rounded-md bg-primary-container text-white font-label-sm text-label-sm truncate shadow-sm font-semibold">
            Fed Hike 25bps
          </div>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">21</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">22</span>
<div className="px-2 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-label-sm text-label-sm truncate font-semibold cursor-pointer">
            Due: $12,800 Syn
          </div>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">23</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">24</span>
</div>
<!-- Week 5 -->
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">25</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">26</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">27</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">28</span>
<div className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-label-sm text-label-sm truncate font-semibold">
            Monthly Audit
          </div>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-white/90 hover:bg-slate-50 transition-colors flex flex-col justify-between border border-slate-200/80 shadow-xs">
<span className="font-tabular-data-md text-tabular-data-md text-on-surface theme-text-main font-bold">29</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/60 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">30</span>
</div>
<div className="theme-card-sub min-h-24 p-2 rounded-xl bg-slate-50/50 flex flex-col justify-between border border-slate-200/50">
<span className="font-tabular-data-md text-tabular-data-md text-slate-400">1</span>
</div>
</div>
</div>
</section>
<!-- TAB CONTAINER 4: SIMULATOR PANEL -->
<section className="tab-panel hidden flex-col gap-space-lg transition-opacity duration-300" id="panel-simulator">
<div className="flex items-center justify-between">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface theme-text-main font-bold">Interactive Debt &amp; Liquidity Stress Tester</h2>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">Model macro shocks in real-time. Compute dynamic DTI drift and cash runway impacts.</p>
</div>
<button className="theme-card-sub px-3 py-1.5 rounded-lg bg-slate-100 text-label-md font-label-md text-slate-700 font-semibold theme-text-main hover:bg-slate-200 transition-all flex items-center gap-1.5 border border-slate-200" onclick="resetSliders()">
<span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset Scenarios
      </button>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
<!-- Sliders Control Bay -->
<div className="theme-card lg:col-span-7 rounded-2xl bg-white/75 backdrop-blur-xl p-space-md shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)] flex flex-col gap-space-lg border border-slate-200/80">
<!-- Slider 1: Interest Rate Shock -->
<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-headline-sm text-headline-sm text-on-surface theme-text-main flex items-center gap-2 font-semibold" htmlFor="rate-shock-slider">
<span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              Interest Rate Shock (Fed/ECB Policy Shift)
            </label>
<span className="font-tabular-data-lg text-tabular-data-lg text-primary font-bold" id="rate-shock-val">+1.50%</span>
</div>
<div className="relative flex items-center w-full">
<input className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-container focus:outline-none" id="rate-shock-slider" max="5.0" min="0.5" oninput="updateSimulator()" step="0.25" type="range" value="1.50"/>
</div>
<div className="flex justify-between font-label-sm text-label-sm text-outline">
<span>+0.50% (Dovish)</span>
<span>+2.50% (Base Scenario)</span>
<span>+5.00% (Ultra Hawkish)</span>
</div>
</div>
<!-- Slider 2: Revenue Volatility -->
<div className="flex flex-col gap-2">
<div className="flex justify-between items-center">
<label className="font-headline-sm text-headline-sm text-on-surface theme-text-main flex items-center gap-2 font-semibold" htmlFor="rev-shock-slider">
<span className="material-symbols-outlined text-purple-700 text-[20px]">waterfall_chart</span>
              Revenue Volatility &amp; Liquidity Contraction
            </label>
<span className="font-tabular-data-lg text-tabular-data-lg text-purple-700 font-bold" id="rev-shock-val">-10.0%</span>
</div>
<div className="relative flex items-center w-full">
<input className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none" id="rev-shock-slider" max="10" min="-30" oninput="updateSimulator()" step="1" type="range" value="-10"/>
</div>
<div className="flex justify-between font-label-sm text-label-sm text-outline">
<span>-30% (Severe Drawdown)</span>
<span>0% (Steady State)</span>
<span>+10% (Expansion)</span>
</div>
</div>
<!-- Real-Time Projected Impact Display -->
<div className="grid grid-cols-2 gap-space-sm pt-space-sm">
<div className="theme-card-sub p-space-sm rounded-xl bg-slate-50/90 flex flex-col gap-1 border border-slate-200">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Projected DTI Ratio</span>
<div className="font-headline-xl text-headline-xl text-amber-700 font-bold tracking-tight" id="sim-dti">33.2%</div>
<span className="font-body-sm text-body-sm text-amber-700 flex items-center gap-1 font-medium" id="sim-dti-status">
<span className="material-symbols-outlined text-[16px]">warning</span> Alert • Close to 35% Limit
            </span>
</div>
<div className="theme-card-sub p-space-sm rounded-xl bg-slate-50/90 flex flex-col gap-1 border border-slate-200">
<span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">Projected Cash Runway</span>
<div className="font-headline-xl text-headline-xl text-on-surface theme-text-main font-bold tracking-tight" id="sim-runway">16.4 Mo</div>
<span className="font-body-sm text-body-sm text-emerald-600 flex items-center gap-1 font-medium">
<span className="material-symbols-outlined text-[16px]">verified</span> Safe Buffer (&gt; 12 Mo)
            </span>
</div>
</div>
</div>
<!-- 3D FLIP CARD: Risk Warning & Action Playbook -->
<div className="lg:col-span-5 h-[340px] [perspective:1000px] cursor-pointer group" onclick="toggle3DFlip(this)">
<div className="relative w-full h-full duration-700 [transform-style:preserve-3d] transition-transform" id="flip-card-inner">
<!-- Card Front: Risk Warning Amber Glass -->
<div className="theme-card absolute inset-0 w-full h-full rounded-2xl bg-white/85 backdrop-blur-2xl p-space-md shadow-[0_4px_20px_-2px_rgba(0,50,150,0.06)] [backface-visibility:hidden] flex flex-col justify-between border border-slate-200">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs">
<div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
<span className="material-symbols-outlined text-[24px]">crisis_alert</span>
</div>
<div>
<div className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Risk Warning Vector</div>
<div className="font-label-sm text-label-sm text-amber-700 font-semibold uppercase tracking-wider">Level 2 Vulnerability Detected</div>
</div>
</div>
<span className="theme-card-sub px-2.5 py-1 rounded-full bg-slate-100 text-label-sm font-label-sm text-slate-600 flex items-center gap-1 border border-slate-200 font-medium">
<span className="material-symbols-outlined text-[14px]">touch_app</span> Tap to Flip
              </span>
</div>
<div className="my-space-xs flex flex-col gap-2">
<p className="font-body-md text-body-md text-on-surface theme-text-main">
                Simulated rates at <span className="text-amber-700 font-bold">+1.50%</span> with a <span className="text-purple-700 font-bold">-10%</span> revenue dip compress overall debt service coverage below optimal tier.
              </p>
<div className="theme-card-sub p-space-sm rounded-xl bg-slate-50 flex items-center justify-between border border-slate-200">
<span className="font-label-md text-label-md text-outline font-semibold">Floating Rate Debt Tranche:</span>
<span className="font-tabular-data-md text-tabular-data-md text-amber-700 font-bold">$1.84M Exposed</span>
</div>
</div>
<div className="pt-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm">
<span>Model ID: STRESS-2025-V4</span>
<span className="text-primary font-semibold flex items-center gap-1">Why? View Recommended Hedging →</span>
</div>
</div>
<!-- Card Back: Why? Stress Analysis & Recommended Hedging -->
<div className="theme-card absolute inset-0 w-full h-full rounded-2xl bg-white/95 backdrop-blur-2xl p-space-md shadow-xl [transform:rotateX(180deg)] [backface-visibility:hidden] flex flex-col justify-between border border-slate-200">
<div>
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-space-xs">
<span className="material-symbols-outlined text-primary text-[22px]">shield_with_heart</span>
<span className="font-headline-sm text-headline-sm text-on-surface theme-text-main font-bold">Recommended Hedging Actions</span>
</div>
<span className="text-label-sm font-label-sm text-outline">Click to return</span>
</div>
<div className="flex flex-col gap-2 mt-2">
<div className="theme-card-sub p-2 rounded-lg bg-slate-50 flex items-start gap-2 border border-slate-200">
<span className="material-symbols-outlined text-primary text-[18px] mt-0.5">verified</span>
<div>
<div className="font-label-md text-label-md text-on-surface theme-text-main font-semibold">Execute SOFR Collar Hedge</div>
<div className="font-body-sm text-body-sm text-outline">Cap floating interest exposure on Tranche B at 4.25% through Q3 2026.</div>
</div>
</div>
<div className="theme-card-sub p-2 rounded-lg bg-slate-50 flex items-start gap-2 border border-slate-200">
<span className="material-symbols-outlined text-purple-700 text-[18px] mt-0.5">swap_calls</span>
<div>
<div className="font-label-md text-label-md text-on-surface theme-text-main font-semibold">Pre-fund Reserve Account #4892</div>
<div className="font-body-sm text-body-sm text-outline">Sweep $22,000 from overnight yields to insulate liquidity cushion.</div>
</div>
</div>
</div>
</div>
<button className="w-full py-2 rounded-xl bg-primary-container text-white font-headline-sm text-headline-sm flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(0,102,255,0.35)] hover:shadow-[0_4px_18px_rgba(0,102,255,0.5)] transition-all font-bold cursor-pointer" onclick="event.stopPropagation(); executeHedgeProtocol()">
<span className="material-symbols-outlined text-[18px]">bolt</span> Autonomous Hedge Execution
            </button>
</div>
</div>
</div>
</div>
</section>
<!-- TAB CONTAINER 5: ASSISTANT PANEL (FIN AI RISK COPILOT) -->
<section className="tab-panel hidden flex-col gap-space-md transition-opacity duration-300" id="panel-assistant">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-sm">
<div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[24px]">smart_toy</span>
</div>
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface theme-text-main font-bold">FIN Sentinel AI Risk Copilot</h2>
<p className="font-body-sm text-body-sm text-outline theme-text-sub">Continuous risk-modeling intelligence engine • Active Context: Basel III &amp; Dodd-Frank</p>
</div>
</div>
<span className="theme-card-sub px-2.5 py-1 rounded-full bg-blue-50 text-primary font-label-sm text-label-sm flex items-center gap-1.5 border border-blue-200 font-semibold">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Copilot Online
      </span>
</div>
<!-- Chat Console Shell -->
<div className="theme-card rounded-2xl bg-white/75 backdrop-blur-xl p-space-md shadow-[0_4px_20px_-2px_rgba(0,50,150,0.05)] flex flex-col justify-between min-h-[460px] border border-slate-200/80">
<!-- Chat Conversation Stream -->
<div className="flex flex-col gap-space-md overflow-y-auto max-h-[340px] pr-2" id="chat-stream">
<!-- Copilot Message -->
<div className="flex items-start gap-space-sm max-w-2xl">
<div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
<span className="material-symbols-outlined text-[18px]">psychology</span>
</div>
<div className="theme-card-sub p-space-md rounded-2xl rounded-tl-none bg-slate-50/95 backdrop-blur-md text-on-surface theme-text-main flex flex-col gap-1.5 shadow-sm border border-slate-200">
<div className="flex items-center justify-between gap-space-md font-label-sm text-label-sm text-outline">
<span className="font-semibold text-slate-700">FIN Sentinel Risk Copilot</span>
<span>10:42 AM</span>
</div>
<p className="font-body-md text-body-md leading-relaxed text-slate-800">
              Good morning Elena. I've audited today's liquidity stress simulations. Your overall portfolio DTI is comfortably within safe boundaries at <span className="text-primary font-bold">28.5%</span>.
            </p>
<p className="font-body-md text-body-md leading-relaxed text-slate-800">
              Would you like me to model the Federal Reserve 25bps hike scheduled for Thursday against your variable interest commitments?
            </p>
<div className="flex items-center gap-2 pt-1">
<button className="theme-card px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-primary font-label-md text-label-md transition-colors font-semibold border border-slate-200 shadow-xs" onclick="sendQuickPrompt('Yes, model the 25bps hike against floating tranches.')">
                Run 25bps Model →
              </button>
<button className="theme-card px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-on-surface theme-text-main font-label-md text-label-md transition-colors border border-slate-200 shadow-xs" onclick="sendQuickPrompt('Display current cash runway buffer breakdown.')">
                Inspect Runway
              </button>
</div>
</div>
</div>
<!-- User Message with Hover Actions -->
<div className="flex items-start justify-end gap-space-sm self-end max-w-xl group">
<div className="relative p-space-md rounded-2xl rounded-tr-none bg-blue-50/90 backdrop-blur-md text-on-surface theme-text-main flex flex-col gap-1 transition-all duration-200 group-hover:-translate-y-0.5 shadow-sm border border-blue-200">
<div className="flex items-center justify-between gap-space-md font-label-sm text-label-sm text-primary font-semibold">
<span>Elena Vance (CRO)</span>
<span>10:44 AM</span>
</div>
<p className="font-body-md text-body-md text-slate-800" id="user-msg-content">
              Please analyze the impact on our Syndicate #4892 credit facility if we lock in the fixed collar before 3:00 PM EST.
            </p>
<!-- Hover copy button -->
<button className="theme-card-sub absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-white text-slate-500 hover:text-slate-800 border border-slate-200 shadow-xs" onclick="copyMsg('user-msg-content')" title="Copy text">
<span className="material-symbols-outlined text-[14px]">content_copy</span>
</button>
</div>
<div className="theme-card-sub w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-on-surface theme-text-main shrink-0 border border-slate-200">
<span className="material-symbols-outlined text-[18px]">person</span>
</div>
</div>
<!-- Copilot Response -->
<div className="flex items-start gap-space-sm max-w-2xl">
<div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
<span className="material-symbols-outlined text-[18px]">psychology</span>
</div>
<div className="theme-card-sub p-space-md rounded-2xl rounded-tl-none bg-slate-50/95 backdrop-blur-md text-on-surface theme-text-main flex flex-col gap-1.5 shadow-sm border border-slate-200">
<div className="flex items-center justify-between gap-space-md font-label-sm text-label-sm text-outline">
<span className="font-semibold text-slate-700">FIN Sentinel Risk Copilot</span>
<span>Just Now</span>
</div>
<p className="font-body-md text-body-md leading-relaxed text-slate-800">
              Locking Syndicate #4892 collar will reduce your 12-month interest rate volatility by <span className="text-primary font-bold">78%</span> with an upfront premium requirement of <span className="text-amber-700 font-bold">$3,400</span>. Net savings projected at +$14,200 under the base 50bps tightening regime.
            </p>
</div>
</div>
</div>
<!-- Interactive Glass Input Bar -->
<div className="mt-space-md pt-space-sm flex items-center gap-space-sm relative">
<button className="theme-card-sub p-2.5 rounded-xl bg-slate-100 text-outline hover:text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200">
<span className="material-symbols-outlined text-[20px]">attach_file</span>
</button>
<div className="relative flex-1">
<input className="theme-input w-full h-12 pl-4 pr-12 rounded-xl bg-white font-body-md text-body-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm border border-slate-200" id="chat-input" onkeydown="handleChatKey(event)" placeholder="Ask FIN Sentinel to simulate shocks, review covenants, or audit liquidity..." type="text"/>
<button className="absolute right-2 top-2 p-1.5 rounded-lg text-primary hover:bg-blue-50 transition-colors" onclick="handleSendChat()">
<span className="material-symbols-outlined text-[20px]">send</span>
</button>
</div>
<!-- Glowing Voice Mic Button with Ripple Effect -->
<button className="relative w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-[0_2px_12px_rgba(0,102,255,0.35)] hover:shadow-[0_4px_18px_rgba(0,102,255,0.5)] transition-all overflow-visible cursor-pointer" id="mic-btn" onclick="triggerMicRipple(this)">
<span className="absolute inset-0 rounded-xl bg-primary pointer-events-none opacity-0 scale-100 transition-all duration-500" id="mic-ripple"></span>
<span className="material-symbols-outlined text-[22px] relative z-10">mic</span>
</button>
</div>
</div>
</section>
<!-- CODE ARCHITECTURE MODAL / DRAWER -->
<div className="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/60 backdrop-blur-md p-space-md" id="code-modal">
<div className="theme-card relative w-full max-w-4xl max-h-[870px] rounded-2xl bg-white p-space-lg shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-200">
<div className="flex items-center justify-between pb-space-sm">
<div className="flex items-center gap-space-sm">
<span className="material-symbols-outlined text-primary">code</span>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface theme-text-main font-bold">React / Next.js Architecture</h3>
<p className="font-body-sm text-body-sm text-outline">Component modularity tree &amp; Tailwind glass token definitions</p>
</div>
</div>
<button className="theme-card-sub w-8 h-8 rounded-lg bg-slate-100 text-outline hover:text-slate-800 flex items-center justify-center border border-slate-200" onclick="toggleCodeModal()">
<span className="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Code Tabs & Snippet Viewer -->
<div className="flex flex-col flex-1 overflow-hidden my-space-sm">
<div className="flex gap-2 pb-2">
<button className="px-3 py-1 rounded-md text-label-md font-label-md bg-primary-container text-white font-semibold shadow-xs" id="code-tab-comp" onclick="selectCodeTab('comp')">Components.tsx</button>
<button className="theme-card-sub px-3 py-1 rounded-md text-label-md font-label-md bg-slate-100 text-outline hover:text-slate-800 border border-slate-200" id="code-tab-glass" onclick="selectCodeTab('glass')">Tailwind.glass.config</button>
</div>
<pre className="flex-1 overflow-y-auto p-space-md rounded-xl bg-slate-900 font-mono text-[13px] leading-relaxed text-slate-200 overflow-x-auto border border-slate-800" id="code-view">// FIN Sentinel Architecture
// app/dashboard/page.tsx
import React, { useState } from 'react';
import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { NotificationsPanel } from '@/components/dashboard/NotificationsPanel';
import { CalendarPanel } from '@/components/dashboard/CalendarPanel';
import { SimulatorPanel } from '@/components/dashboard/SimulatorPanel';
import { AssistantPanel } from '@/components/dashboard/AssistantPanel';

export default function FinSentinelDashboard() {
  const [activeTab, setActiveTab] = useState&lt;'overview' | 'alerts' | 'calendar' | 'simulator' | 'assistant'&gt;('overview');
  
  return (
    &lt;main className="relative flex flex-col w-full gap-6 bg-[#f4f6fb] min-h-screen text-[#0f172a]"&gt;
      &lt;OverviewPanel dtiRatio={28.5} monthlyInflow={28450} commitments={8120} /&gt;
      &lt;NotificationsPanel /&gt;
      &lt;CalendarPanel /&gt;
      &lt;SimulatorPanel onSimulate={(rateShock, revDrop) =&gt; calculateStress(rateShock, revDrop)} /&gt;
      &lt;AssistantPanel copilotVersion="2.4" /&gt;
    &lt;/main&gt;
  );
}
        </pre>
</div>
<div className="flex justify-end gap-2 pt-space-xs">
<button className="theme-card-sub px-space-md py-2 rounded-xl bg-slate-100 text-slate-800 theme-text-main font-headline-sm text-headline-sm hover:bg-slate-200 transition-colors border border-slate-200 font-bold" onclick="toggleCodeModal()">
          Close Inspector
        </button>
</div>
</div>
</div>
</div>
<!-- Vanilla JS Interactions & State Control -->
</main></div></body></html>