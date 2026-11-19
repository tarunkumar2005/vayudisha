# SaansSaathi (साँस साथी)
### *GenAI-Powered Urban Air Quality Assistant for Indian Families & Communities*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-41%20Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)
[![Gemini API](https://img.shields.io/badge/Google%20Gemini-3.8--flash-4285F4?style=flat&logo=google)](https://aistudio.google.com/)
[![Repository Size](https://img.shields.io/badge/Repo%20Size-624%20KB%20(<10MB)-success?style=flat)](https://github.com/)

**PromptWars Virtual Challenge 06: Urban Air Quality Assistant**  
**Submission Deadline:** November 29, 2026, 11:59 PM IST

---

## 🌬️ Overview

Winter smog in northern and central India poses severe health risks to millions of households. During thermal inversions, particulate matter ($\text{PM}_{2.5}$ and $\text{PM}_{10}$) is trapped in the breathing zone, leading to acute respiratory stress for infants, school children, and seniors.

**SaansSaathi ("Breath Companion")** bridges official government atmospheric telemetry with actionable, low-emission daily routines, indoor air solutions across 3 budget tiers, verified transport carbon calculations, and a printable 1-page community clean-air action plan.

---

## 🏛️ Architecture & Critical Data Compliance

SaansSaathi is built upon a **safety-first, deterministic foundation**. Artificial intelligence is strictly restricted to personalization and empathetic explanation of pre-approved scientific guidance:

```
[CPCB Station Telemetry (data.gov.in)] ──┐
                                          ├─► [AQI Merger & Sanitizer] ──► [Deterministic Safety Engine]
[Copernicus CAMS Model (Open-Meteo)] ─────┘                                      │
                                                                                 ▼
                                                                 [Gemini 3.8 Flash (Server-Side)]
                                                                                 │
                                                                                 ▼
                                                                 [Zod & Regex Safety Validator]
                                                                                 │
                                                                                 ▼
                                                                 [React UI: Dashboard, Routine, Impact]
```

### Critical Rules Adherence

1. **Official CPCB Ground Station Telemetry**: Treated as authoritative Indian AQI only when valid and fresh (<6 hours). Always displays monitoring station name, last updated timestamp, and source attribution.
2. **Open-Meteo CAMS Global Model**: Explicitly labeled as **"Copernicus (CAMS) Model Forecast"**, never as official CPCB station data.
3. **No Fabricated AQI**: Never calculates official Indian AQI from a single hourly model point. If ground telemetry is down, official AQI is rendered as `--` with transparent fallback notices.
4. **Deterministic Health & Mask Safety**: N95 mask requirements and exercise prohibitions under Poor/Severe AQI are evaluated deterministically by code—**never left to LLM guesswork**.
5. **Zero PII & Medical Data Leakage**: Privacy sanitizer ensures no names, addresses, or clinical diagnoses reach the Gemini API.
6. **Impact Separation**: Commuter transport $\text{CO}_2\text{e}$ reductions are kept strictly separate from personal exposure indicators. Never claims individual choices reduce city-level ambient AQI.

---

## ✨ Key Features

### 1. Location-Aware AQI & Multi-Pollutant Dashboard
* **Dynamic CPCB Gauge**: Visual circular gauge using official Indian AQI breakpoints and WCAG-AA compliant colors.
* **Pollutant Sub-Indices Breakdown**: Shows measured concentration, regulatory averaging window, and sub-index for $\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{SO}_2, \text{CO}, \text{O}_3$.
* **24-Hour Forecast & 3-Day Risk Outlook**: Recharts visual area chart of Copernicus CAMS particulate predictions.
* **Multi-Station Comparison**: Compares air quality across multiple monitoring stations in the same city.

### 2. Family Routine & Indoor Air Quality Planner
* **Household Setup**: Tailors advice for infants/toddlers, school children, seniors, and respiratory sensitivity.
* **Indoor Interventions across 3 Budget Tiers**:
  * **Low Budget (₹0 – ₹500)**: Wet mopping protocol, damp towel window/door draft seals, elimination of incense/mosquito coils.
  * **Medium Budget (₹500 – ₹5,000)**: DIY box fan MERV-13 air cleaner (Corsi-Rosenthal method), certified N95 respirators, NASA clean-air plants.
  * **High Budget (₹5,000+)**: True HEPA H13 air purifiers with activated carbon, indoor laser $\text{PM}_{2.5}$ monitors.
* **Evidence Links**: Every intervention cites official research (CPCB, WHO, ICMR, Harvard Public Health, NASA).

### 3. Sustainable Travel & Impact Calculator
* **Indian Modal Shift Calculation**: Compare your current travel mode (petrol car, diesel car, two-wheeler) with clean alternatives (Metro rail, electric bus, e-rickshaw, cycling).
* **Documented Factors**: Sourced from India GHG Program, DMRC sustainability filings, and SIAM.
* **Thermal Inversion Guidance**: Explains the physics of the morning smog trap (6–9 AM) and preferred afternoon dispersion window (1–4 PM).

### 4. Shareable 1-Page Community Action Plan
* **RWA & Society Toolkit**: Clean layout for apartment complexes and neighborhood associations.
* **Quick Wins**: Immediate ban on open leaf burning, electric heaters for night security guards, water sprinkling for dust control.
* **Print & PDF Ready**: Optimized for 1-page A4 printing via browser `@media print` with zero household PII.

### 5. Hybrid Bilingual Support (English ↔ हिंदी)
* Instant language switching between English and natural Hindi in Devanagari script.
* Static reviewed translations for all safety warnings and disclaimers, with Gemini handling dynamic localized explanations.

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ (tested on Node v20 & v26)
* npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/your-username/saanssaathi.git
cd saanssaathi
npm install
```

### 2. Configure Environment Variables
Copy the template and fill in your keys:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATA_GOV_IN_API_KEY` | Free API key from [data.gov.in](https://data.gov.in/) for CPCB AQI resource `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`. |
| `GEMINI_API_KEY` | Developer API key from [Google AI Studio](https://aistudio.google.com/) for `gemini-3.8-flash`. |
| `NEXT_PUBLIC_USE_MOCK_AQI` | Set to `true` to test using realistic simulated CPCB telemetry without an external key. |

*Note: If no API keys are provided during local testing, SaansSaathi gracefully activates verified demonstration telemetry and deterministic bilingual guidance without crashing.*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Code Quality

SaansSaathi includes **41 automated unit and integration tests** covering all data parsers, sub-index math, safety matrices, impact equations, and privacy sanitizers:

```bash
# Run unit & integration tests
npm test

# Typecheck TypeScript
npm run typecheck

# Production build test
npm run build
```

### Test Coverage Highlights
* **AQI Calculator**: Verifies CPCB piecewise interpolation, minimum 3-pollutants rule, and sensor anomaly rejection.
* **CPCB Client**: Verifies IST date parsing, Zod schema validation, stale record flagging (>6h), and API error recovery.
* **Open-Meteo Client**: Verifies CAMS model tagging, $\mu\text{g/m}^3 \rightarrow \text{mg/m}^3$ CO conversion, and forecast summaries.
* **Safety Rules**: Verifies N95 mandates under Severe AQI and budget tier filtering.
* **Impact Calculator**: Verifies car-to-metro CO₂e savings and mature tree absorption equivalents.
* **Gemini Sanitizer**: Verifies complete stripping of PII and regex blocking of forbidden medical claims.

---

## 📦 Submission & Repository Compliance

* **Repository Size**: **624 KB** (Strict requirement: under 10 MB).
* **Git Cleanliness**: Excludes `node_modules`, `.next`, build artifacts, videos, and secrets via strict `.gitignore`.
* **Zero Client-Side Secrets**: All API keys remain isolated inside server-side Route Handlers.

---

## ⚖️ Evaluation Rubric Alignment

| Evaluation Parameter | How SaansSaathi Delivers |
|---|---|
| **Code Quality** | Strict TypeScript, ESLint, clean modular separation (`lib/aqi`, `lib/rules`, `lib/impact`, `lib/gemini`), Zod runtime validation. |
| **Security & Privacy** | Server-side API key containment, PII sanitization before AI calls, regex medical claim guards, Content Security Policy headers. |
| **Efficiency** | Client-side React context with localStorage persistence, Next.js route caching (`s-maxage=300`), deterministic rules bypassing unnecessary LLM latency. |
| **Testing** | 41 comprehensive Vitest tests across unit and integration layers with mocked fixtures for edge cases. |
| **Accessibility** | Mobile-first responsive UI, WCAG AA color contrast, semantic HTML5, keyboard accessible controls, and screen-reader labels. |
| **Problem Alignment** | 100% targeted to winter smog in India: CPCB ground telemetry, 3 budget tiers, sustainable transit impact, and RWA community action. |

---

## 📜 Regulatory Disclaimers

1. **Not Medical Advice**: SaansSaathi provides environmental awareness and public health exposure reduction guidance based on CPCB and WHO guidelines. It does not provide medical diagnoses, clinical treatment, or prescriptions. Consult a physician for acute respiratory symptoms.
2. **Attribution**: Air quality telemetry derived from the Central Pollution Control Board (CPCB) via data.gov.in and Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo.
