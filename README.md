# VayuDisha (वायुदिशा)
### *Intelligent Urban Air Quality & Sustainability Assistant for Indian Families & Communities*

> **"Know your air. Choose a better direction."**  
> **"हवा की समझ, बेहतर कल।"**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-85%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright%20E2E-45%20Passed-brightgreen?style=flat&logo=playwright)](https://playwright.dev/)
[![WCAG 2.2 AA](https://img.shields.io/badge/axe--core-0%20Violations%20(AA)-brightgreen?style=flat)](https://www.deque.com/axe/)
[![Gemini API](https://img.shields.io/badge/Google%20Gemini-3.5--flash--lite%20%2F%203.1--flash--lite-4285F4?style=flat&logo=google)](https://aistudio.google.com/)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-<1MB%20(768%20KiB)-success?style=flat)](https://github.com/)

**PromptWars Virtual Challenge 06: Urban Air Quality Assistant**  
**Submission Deadline:** November 29, 2026, 11:59 PM IST

---

## 🌬️ Overview

Winter smog in northern and central India poses severe health risks to millions of households. During thermal inversions, fine particulate matter ($\text{PM}_{2.5}$ and $\text{PM}_{10}$) is trapped at ground level, creating dangerous exposure spikes for infants, school children, and senior citizens.

**VayuDisha (वायुदिशा)** bridges official Central Pollution Control Board (CPCB) continuous telemetry with actionable, low-emission daily routines, peer-reviewed indoor air filtration guidance across 3 budget tiers, verified transport carbon calculations, and a printable 1-page community clean-air charter for Resident Welfare Associations (RWAs).

### Architecture Highlights (V2 Redesign)
- **Separation of Concerns**: Dedicated storytelling marketing homepage (`/`) inspired by the editorial craft and warmth of modern product showcases, and a dedicated telemetry workstation (`/dashboard`) for in-depth ground telemetry, multi-station switching, 24-hour CAMS inversion forecasting, and pollutant sub-indices.
- **CPCB Multi-Station Registry (`src/lib/aqi/cpcb-registry.ts`)**: Built-in station directory with exact data.gov.in CAAQMS station names, city aliases (e.g. Bangalore ➔ Bengaluru, Bombay ➔ Mumbai, Dilli ➔ Delhi), operating agencies (DPCC, MPCB, KSPCB, BSPCB, WBPCB, TSPCB, UPPCB), and verified active stations for Indian metros.
- **Multi-City Ground Station Reliability**: Solves data.gov.in's 10-record pagination ceiling by targeting registered CAAQMS stations (e.g. Colaba for Mumbai, Jayanagar for Bengaluru, Anand Vihar for Delhi).
- **Graceful Fallback Matrix**: State A (Verified CPCB ground station data with badge, station name, timestamp), State B (Atmospheric Model Forecast from Copernicus CAMS for locations without continuous stations, e.g. Jamshedpur), State C (Graceful unavailable).
- **Interactive Storytelling ("A Smoggy Tuesday")**: 5-step daily inversion journey tracking morning inversion (7:30 AM), workday filtration (11:00 AM), afternoon solar ventilation window (2:00 PM), evening commute rush (6:30 PM), and nighttime bedroom clean air (10:00 PM).
- **Try It: 3 Steps to Clean Indoor Air**: Interactive tool computing Clean Air Delivery Rate (CADR in m³/h) and air changes per hour (ACH) based on room size (120, 200, 350 sq ft) and budget tier (Free, DIY Corsi-Rosenthal ₹2k, HEPA ₹9k).

---

## 🎨 Visual Identity & Brand Assets

VayuDisha introduces an original, approachable brand identity inspired by modern environmental intelligence:

- **Primary Colors**: Forest Green (`#174B36`), Emerald Teal (`#0F766E`), Soft Sage (`#A7C5A0`), Saffron Accent (`#EBA347`), and Warm Cream Canvas (`#F6F4EB`).
- **Official CPCB Palette**: Strict regulatory colors for AQI brackets (Good `#00B050`, Satisfactory `#92D050`, Moderate `#FFD700`, Poor `#FF8C00`, Very Poor `#FF0000`, Severe `#8B0000`).
- **Brand Companion**: "Vayu" (वायु) — an empathetic breeze/leaf mascot with expressive SVG poses (`greeting`, `explaining`, `celebrating`, `cautious`, `thinking`, `alert`, `peeking`).

---

## 🏛️ Routes & Architecture

| Route | Purpose | Highlights |
| :--- | :--- | :--- |
| `/` | **Marketing & Storytelling Home** | Hero narrative, companion greeting, floating live AQI card, "A Smoggy Tuesday" timeline, habit bento grid, 3-step CADR calculator, FAQ accordion, closing banner. |
| `/dashboard` | **Air Quality Telemetry Workstation** | City dropdown, station dropdown selector, AqiGauge, official CPCB SourceBadge, multi-station city grid, 24h CAMS inversion forecast chart, pollutant sub-indices, CPCB standard limits. |
| `/planner` | **Family Routine Planner** | Household profile tailoring (infants, asthmatics, seniors, commute mode), budget filter tabs, Gemini AI personalized guidance with deterministic guardrails, evidence citations. |
| `/impact` | **Travel & Impact Calculator** | Modal split comparison (Metro, Bus, EV, Two-Wheeler, Car), personal $\text{CO}_2\text{e}$ savings calculation, explicit disclaimer that personal carbon savings do not change city AQI. |
| `/community` | **Community Action Plan** | 1-page printable RWA clean-air charter, waste burning bans, DG set restrictions, carpool coordination, anti-dust mitigation guidelines. |

---

## 🧪 Verification & Quality Scorecard

| Quality Domain | Metric | Result | Verification Command |
| :--- | :--- | :--- | :--- |
| **Unit & Integration Tests** | 14 Test Files | **85 Passed**, 11 Skipped (Offline CI) | `npm test` |
| **End-to-End Tests** | 8 Playwright Specs | **45 of 45 Passed** (100%) | `npm run test:e2e` |
| **Accessibility (WCAG 2.2 AA)** | axe-core automated audit | **0 Critical / 0 Serious Violations** across all 5 routes (`/`, `/dashboard`, `/planner`, `/impact`, `/community`) | `npm run test:e2e` (accessibility.spec.ts) |
| **Type Safety** | TypeScript `tsc --noEmit` | **0 Errors** | `npm run typecheck` |
| **Code Linting** | Next.js ESLint | **0 Warnings / 0 Errors** | `npm run lint` |
| **Production Build** | Next.js 15.5.29 Static Pages | **Compiled in 1.48s (9/9 static pages)** | `npm run build` |
| **Live Multi-City CPCB API** | data.gov.in Authenticated Telemetry | **HTTP 200 (Delhi, Mumbai, Bengaluru, Pune, Chennai, Jorapokhar; CAMS fallback for Jamshedpur)** | `npm run test:live:multicity` |
| **Gemini AI Developer API** | Google GenAI Flash-Lite (3.5 / 3.1) | **1.23s - 1.95s latency, 6s timeout, 100% structured JSON** | `LIVE_INTEGRATION=true npx vitest run tests/integration/gemini-live.test.ts` |
| **Git Repository Size** | Tracked Git History | **< 1 MB (768 KiB)** (Strictly < 10 MB limit) | `git count-objects -vH` |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+
- (Optional) Free API keys for data.gov.in and Google AI Studio

### Setup

```bash
# Clone the repository
git clone https://github.com/tarunkumar2005/vayudisha.git
cd vayudisha

# Install clean dependencies
npm ci

# Configure environment variables (optional for mock mode)
cp .env.example .env.local

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view VayuDisha.

---

## 📄 Documentation Links

- [Brand Guidelines](docs/BRAND-GUIDELINES.md)
- [Design System & UI Components](docs/DESIGN-SYSTEM.md)
- [Production Readiness Audit](docs/PRODUCTION-READINESS.md)
- [PromptWars Evaluation & Rubric Mapping](docs/EVALUATION.md)
- [Data Sources & Methodology](docs/DATA-SOURCES.md)
- [Assumptions & Regulatory Baselines](docs/ASSUMPTIONS.md)

---

## ⚖️ License & Disclaimer

VayuDisha provides public health and environmental awareness guidance based on official Central Pollution Control Board (CPCB) methodology and Ministry of Health and Family Welfare (MoHFW) directives. It is not a medical diagnostic device. Consult a qualified physician for acute respiratory symptoms.
