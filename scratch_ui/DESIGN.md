---
name: FIN Sentinel
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#424656'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#9a25ae'
  on-secondary: '#ffffff'
  secondary-container: '#ed76fd'
  on-secondary-container: '#69007a'
  tertiary: '#006645'
  on-tertiary: '#ffffff'
  tertiary-container: '#008259'
  on-tertiary-container: '#e1ffec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#ffd6fe'
  secondary-fixed-dim: '#f9abff'
  on-secondary-fixed: '#35003f'
  on-secondary-fixed-variant: '#7b008f'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  numeric-metric:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes an institutional-grade, hyper-lucid risk intelligence environment. Built for risk officers, treasury executives, and solvency analysts, the visual personality projects mathematical precision, absolute clarity, and serene authority under high-volatility scenarios.

The style synthesizes structured modern corporate utility with a refined, luminous glassmorphic aesthetic:
- **Frosted Translucency:** Panels maintain high clarity through multi-layered semi-transparent surfaces (`rgba(255, 255, 255, 0.75)` with `16px` backdrop blur) that expose background context without sacrificing data legibility.
- **Ultra-Crisp Borders:** Hairline perimeter borders define boundaries cleanly without visual heaviness.
- **High-Fidelity Typography:** Humanist yet geometric text metrics provide scanning efficiency across dense numerical tables and mission-critical metrics.

## Colors
The color architecture reinforces high-stakes risk evaluation through clear semantic separation against an ultra-clean base canvas:

- **Canvas & Backdrops:** Base canvas runs on `#FAFAFA`, with structural section wells rendered in `#F4F6F9`. Glass structural layers rely on tinted whites (`rgba(255, 255, 255, 0.75)` to `rgba(255, 255, 255, 0.90)`).
- **Core Semantic Roles:**
  - **Primary (`#0066FF`):** Solvency indicators, primary actions, core platform navigational focus.
  - **Secondary (`#9C27B0`):** Algorithmic indicators, predictive risk models, deep quantitative analysis tags.
  - **Tertiary / Success (`#10B981`):** Capital surplus, compliant buffers, safe liquidity ratios.
  - **Warning Accent (`#FFB300`):** Solvency watchlists, liquidity threshold warnings, volatility spikes.
- **Text & Contrast Hierarchy:**
  - **Primary Text (`#111827`):** Strict tabular figures, primary metric values, card headlines.
  - **Secondary Text (`#1F2937`):** Field labels, standard copy, table data rows.
  - **Muted Text (`#6B7280`):** Metadata, axis labels, baseline references, helper microcopy.
- **Structural Lines:** Structural division and glass borders strictly leverage `rgba(0, 0, 0, 0.06)` or inner top-edge highlights of `rgba(255, 255, 255, 0.8)`.

## Typography
Plus Jakarta Sans is utilized across all platform tiers to merge architectural geometric clarity with high legibility. 

- **Tabular Figures:** All numerical tables, solvency rates, stress-test ratios, and time-series tickers must enforce `font-variant-numeric: tabular-nums` to maintain vertical decimal alignment.
- **Labels & Micro-headers:** Data labels, table column headers, and status flags employ medium/semibold weights with slight tracking expansion (`0.01em` to `0.03em`) for immediate readability at compact dimensions.
- **Scale Handling:** On viewports under 768px, display metrics and primary headline tiers step down using `-mobile` tokens to prevent horizontal overflow in high-density multi-column widgets.

## Layout & Spacing
The layout model follows a 12-column fluid grid system engineered for information-dense operational workflows:

- **Desktop (1200px+):** 12-column fluid layout with `gutter: 1.5rem` and `margin: 2rem`. Sidebar analytics navigations stay pinned at a fixed width while main dashboards flex dynamically.
- **Tablet (768px - 1199px):** 8-column layout with `gutter: 1rem` and `margin: 1.5rem`. Secondary analytic rails collapse into sliding drawers or lower rows.
- **Mobile (< 768px):** 4-column stack with `gutter-sm: 1rem` and `margin-sm: 1rem`. Glass metric panels stack vertically with single-column horizontal carousels for streaming ticker telemetry.
- **Spacing Rhythm:** Internal card structures adhere strictly to a 4px/8px rhythm. Compact telemetry units use `space-xs` and `space-sm`, while analytical panels and split views utilize `space-md` through `space-xl` for clean optical breathing room.

## Elevation & Depth
Depth is created through optical glass layers and soft ambient illumination rather than heavy opaque drop shadows:

- **Base Layer (Level 0):** Flat background `#FAFAFA` with subtle background ambient gradients (`radial-gradient` meshes in `#F4F6F9` with low opacity color tints).
- **Glass Panel Surface (Level 1):** `background: rgba(255, 255, 255, 0.75)`, `backdrop-filter: blur(16px)`, bordered by a 1px continuous stroke of `rgba(0, 0, 0, 0.06)`. Shadows are ultra-diffuse: `0 8px 32px 0 rgba(0, 102, 255, 0.03), 0 1px 2px 0 rgba(0, 0, 0, 0.04)`.
- **Floating / Elevated Glass (Level 2):** Dropdowns, scenario tooltips, and floating control bars employ `background: rgba(255, 255, 255, 0.88)`, `backdrop-filter: blur(20px)`, with an ambient lift: `0 12px 40px -4px rgba(17, 24, 39, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)`.
- **Modal Overlays & Critical Scenarios (Level 3):** Modal cards sit on a `backdrop-filter: blur(8px)` scrim (`rgba(17, 24, 39, 0.2)`), utilizing `background: rgba(255, 255, 255, 0.95)` with dual boundary rings: a 1px border `rgba(0, 0, 0, 0.08)` paired with an inner white rim `inset 0 1px 0 rgba(255, 255, 255, 0.9)`.

## Shapes
The design system embraces a calibrated, softened architectural curvature (`roundedness: 2`):

- **Data Cards & Analytics Glass Panels:** Default to `1rem` (`rounded-lg`) border-radius, imparting a polished, modern dashboard feel without looking excessively rounded.
- **Controls & Form Elements:** Buttons, inputs, filter dropdowns, and toggle tracks utilize `0.5rem` (`rounded-md` / base roundedness) to preserve precise data entry perception.
- **Badges, Tickers & Solvency Status Pills:** Formed with full continuous curvature (`rounded-full` / pill) to immediately distinguish categorical flags and health states from structural interactive cards.

## Components

### Buttons
- **Primary:** Solid `#0066FF` fill with white `#FFFFFF` text, subtle inset top highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.2)`), and light outer glow on hover (`0 4px 14px rgba(0, 102, 255, 0.3)`).
- **Secondary / Glass Button:** `background: rgba(255, 255, 255, 0.8)`, `backdrop-filter: blur(12px)`, border `1px solid rgba(0, 0, 0, 0.08)`, text `#1F2937`. Hover brings `background: rgba(255, 255, 255, 0.95)` with subtle primary border accent.
- **Destructive / Capital Call Action:** Solid `#EF4444` or bordered crimson with soft red ambient hover halos.

### Cards & Analytical Panels
- Composed of standard Level 1 glass: `rgba(255, 255, 255, 0.75)` surface, `16px` backdrop blur, `1px solid rgba(0, 0, 0, 0.06)`, and `1rem` radius.
- Cards feature top header bars with tabular title, real-time status pip, and a soft horizontal separator rendered via `rgba(0, 0, 0, 0.04)`.

### Chips & Solvency Pills
- Semi-transparent status indicators:
  - **Surplus/Safe:** `background: rgba(16, 185, 129, 0.12)`, text `#047857`, border `1px solid rgba(16, 185, 129, 0.2)`.
  - **Warning/Volatile:** `background: rgba(255, 179, 0, 0.12)`, text `#B45309`, border `1px solid rgba(255, 179, 0, 0.2)`.
  - **Algorithmic/Model:** `background: rgba(156, 39, 176, 0.12)`, text `#7E22CE`, border `1px solid rgba(156, 39, 176, 0.2)`.
- Shape: 100% full pill radius, compact internal padding (`space-xs` vertical, `space-sm` horizontal).

### Form Inputs & Selectors
- `background: rgba(255, 255, 255, 0.6)`, `backdrop-filter: blur(8px)`, `border: 1px solid rgba(0, 0, 0, 0.1)`, `border-radius: 0.5rem`.
- Focus state activates a sharp `border-color: #0066FF` with an exterior ring `box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15)`.
- Monospaced numeric alignment for financial currency values.

### Checkboxes & Radios
- Size `18px`, `border: 1.5px solid rgba(0, 0, 0, 0.2)`, `border-radius: 4px` (checkbox) or `50%` (radio).
- Checked state: `#0066FF` background with pure white `#FFFFFF` tick or dot; subtle blue glow `0 2px 6px rgba(0, 102, 255, 0.25)`.

### Lists & Ledger Tables
- Alternating row styling using transparent and low-tint rows (`rgba(244, 246, 249, 0.5)`).
- Hover rows highlight with `rgba(0, 102, 255, 0.03)` with a smooth `150ms` transition.
- Grid dividers use ultra-light `1px solid rgba(0, 0, 0, 0.04)`.

### Domain-Specific Components
- **Solvency Gauge:** Circular or arc meters containing glowing gradient strokes transitioning from `#10B981` through `#FFB300` to `#EF4444`, centered inside a frosted glass lens.
- **Stress-Test Delta Badges:** Micro-badges showing positive/negative variance with micro arrow icons, utilizing fixed tabular numbers to prevent text jitter during high-frequency live websocket recalculations.