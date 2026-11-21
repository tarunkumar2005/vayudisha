# VayuDisha (वायुदिशा) — Design System Documentation

> **Design Philosophy: Friendly Environmental Intelligence**  
> *Inspired by approachable, human-centered public interfaces (e.g. Curet) combined with rigorous Indian scientific standards.*

---

## 1. Core Principles

1. **Approachability Without Triviality**: Environmental data can be intimidating. We use generous whitespace, warm natural tones, and rounded card geometry to make air intelligence feel supportive rather than frightening.
2. **Honesty & Transparency in Typography**: Data sources are explicitly attributed at every level. Continuous CPCB ground stations and Copernicus CAMS atmospheric models are given distinct visual badges.
3. **Inclusive Accessibility (WCAG 2.2 AA)**: All foreground/background color combinations meet or exceed the 4.5:1 contrast threshold for normal text and 3:1 for large graphical controls. All interactive elements have visible focus indicators (`#0F766E`), and skip navigation is built-in.
4. **Bilingual Equity**: Devanagari Hindi and Latin English receive equal visual weight, matching font scales, and natural phrasing.

---

## 2. Color Palette & Semantic Tokens

```css
/* Natural Palette */
--brand-forest:  #174B36; /* Primary deep green: headings, buttons, solid containers */
--brand-teal:    #0F766E; /* High-contrast emerald teal: active links, badges, focus rings */
--brand-sage:    #A7C5A0; /* Ambient aura rings, soft illustrations */
--brand-saffron: #EBA347; /* Direction pointer, warm alerts, active highlights */
--brand-cream:   #F6F4EB; /* Primary warm canvas background */
--brand-sand:    #ECE7D8; /* Subtle dividers, inactive sliders, borders */
--brand-border:  #E2DDD1; /* Standard card border */
--brand-dark:    #0E291D; /* Hover states for primary green */
--brand-muted:   #2D4A3E; /* High-contrast secondary text (contrast ratio > 7:1) */

/* CPCB Regulatory Palette (Air Quality Spectrum) */
--aqi-good:         #00B050; /* 0–50 */
--aqi-satisfactory: #92D050; /* 51–100 */
--aqi-moderate:     #FFD700; /* 101–200 */
--aqi-poor:         #FF8C00; /* 201–300 */
--aqi-very-poor:    #FF0000; /* 301–400 */
--aqi-severe:       #8B0000; /* 401–500 */
```

---

## 3. Typography Hierarchy

| Level | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | `3rem` – `3.25rem` (48–52px) | Black (900) | `-0.025em` | Hero main proposition |
| **H1 Title** | `1.75rem` – `2rem` (28–32px) | Black (900) | `-0.02em` | Page header titles |
| **H2 Section** | `1.25rem` – `1.5rem` (20–24px) | Black (900) | `-0.015em` | Section headings |
| **H3 Card** | `1rem` – `1.125rem` (16–18px) | Extrabold (800) | `normal` | Card & modal titles |
| **Body Primary** | `0.875rem` – `1rem` (14–16px) | Medium (500) | `normal` | Explanations & summaries |
| **Body Secondary**| `0.75rem` – `0.8125rem` (12–13px)| Medium (500) | `normal` | Sub-labels, citations, tips |
| **Badge / Tag** | `0.6875rem` (11px) | Black (900) | `+0.05em` | Micro-tags, uppercase badges |

---

## 4. Component Library

### 1. `VayuDishaLogo` (`src/components/brand/VayuDishaLogo.tsx`)
- Renders the official brand emblem, Latin wordmark, and Devanagari badge.
- **Props**:
  - `variant`: `'horizontal' | 'stacked' | 'mark'`
  - `theme`: `'light' | 'dark'`
  - `size`: `'sm' | 'md' | 'lg' | 'xl'`
  - `showTagline`: boolean

### 2. `VayuMascot` (`src/components/brand/VayuMascot.tsx`)
- Renders the original companion "Vayu".
- **Props**:
  - `pose`: `'greeting' | 'explaining' | 'celebrating' | 'cautious'`
  - `size`: `'sm' | 'md' | 'lg' | 'xl'`
  - `speechBubble`: optional string containing empathetic contextual tip

### 3. `AqiGauge` (`src/components/aqi/AqiGauge.tsx`)
- High-legibility circular SVG arc calibrated 0 to 500.
- Inner dial shows large numeric AQI, category pill, and prominent pollutant badge.
- Fully accessible with decorative SVG hidden from assistive tech and dedicated screen-reader summary paragraph.

### 4. `SourceBadge` (`src/components/aqi/SourceBadge.tsx`)
- Differentiates CPCB official station monitoring from Copernicus (CAMS) model forecast.
- Freshness indicator flags delayed data (>6 hours) and provides timestamp.

### 5. `ForecastChart` (`src/components/aqi/ForecastChart.tsx`)
- 24-hour hourly Recharts area chart plotting PM2.5 and PM10 concentrations.
- Displays thermal inversion warning alerting users to morning vs afternoon dispersion.

### 6. `ActivitySafetyCard` (`src/components/routine/ActivitySafetyCard.tsx`)
- Deterministic 3-pillar evaluation: Outdoor Workouts, Children Outdoor Play, and Conditional N95 Respirator Guidance.
- Embedded disclaimer emphasizing that exposure reduction (indoor sheltering) is the primary defense.

---

## 5. Print Optimization (`@media print`)

For the Community Clean-Air Action Plan (`/community`):
- Navigation bar, buttons, header, and footer are suppressed (`display: none !important`).
- Background colors force pure white (`#ffffff`) and text to pure black (`#000000`).
- Card layout uses crisp 1px borders avoiding page-breaks (`page-break-inside: avoid`), fitting cleanly on standard A4 paper for RWA notice boards.
