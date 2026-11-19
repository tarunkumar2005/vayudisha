# SaansSaathi (साँस साथी) — Comprehensive Evaluation & Audit Scorecard

**Challenge**: PromptWars Virtual Challenge 06 — Urban Air Quality Assistant  
**Auditor**: Principal Software Engineer & Production Readiness Auditor  
**Date**: 19 November 2026  
**Status**: Production Candidate Verified  
**Public Git Repo Size**: 808 KiB ($< 10\text{ MB}$)

---

## 1. Verified Execution Matrix

| Step | Command | Exit Code | Verified Output / Metric |
| :--- | :--- | :---: | :--- |
| **Dependency Install** | `npm ci` | `0` | 474 packages installed cleanly in 4s. |
| **Code Quality Lint** | `npm run lint` | `0` | 0 warnings, 0 errors across all routes. |
| **Typecheck** | `npm run typecheck` | `0` | `tsc --noEmit` exited clean. |
| **Vitest Test Suite** | `npm test` | `0` | **11 test files passed, 54 passed**, 3 skipped (offline network guards). |
| **Production Build** | `npm run build` | `0` | Clean build in 1.4s, all 7 pages static/dynamic compiled. |
| **Playwright E2E Suite**| `npx playwright test` | `0` | **8 spec files, 41 passed** in 27.4s. |
| **axe-core Accessibility**| Automated Playwright check | `0` | **0 critical / serious violations** across `/`, `/planner`, `/impact`, `/community`. |
| **Live CPCB Test** | `LIVE_INTEGRATION=true vitest run tests/integration/cpcb-live.test.ts` | `0` | Anand Vihar AQI: 404 (Severe), $\text{PM}_{2.5}$, CPCB official source, notice cleared. |
| **Live Gemini Test** | `LIVE_INTEGRATION=true vitest run tests/integration/gemini-live.test.ts` | `0` | Model cascade verified (`gemini-3.8-flash` $\to$ `gemini-3.5-flash-lite`), structured JSON generated. |
| **Git Pack Size** | `git count-objects -vH` | `0` | Pack size: 156.39 KiB; total repo: 808 KiB ($< 10\text{ MB}$). |
| **Secrets Audit** | `git log -p \| grep -E "(AIzaSy\|...)"` | `0` | Zero secrets found in commit history. |

---

## 2. Test Breakdown by File

```
Test Files (11 passed / 11 total):
  ✓ tests/unit/aqi-calculator.test.ts (12 tests)
  ✓ tests/unit/safety-rules.test.ts (8 tests)
  ✓ tests/unit/cpcb-client.test.ts (7 tests)
  ✓ tests/unit/emission-calculator.test.ts (5 tests)
  ✓ tests/unit/open-meteo-client.test.ts (3 tests)
  ✓ tests/unit/rate-limit.test.ts (5 tests)
  ✓ tests/unit/sanitizer.test.ts (5 tests)
  ✓ tests/unit/aqi-merger.test.ts (3 tests)
  ✓ tests/integration/api-routes.test.ts (4 tests)
  ✓ tests/integration/cpcb-live.test.ts (3 tests: 2 passed live, 1 skipped offline guard)
  ✓ tests/integration/gemini-live.test.ts (2 tests: 1 passed live, 1 skipped offline guard)

Total Tests: 54 passed | 3 skipped (live network guards during offline execution)
```

---

## 3. Playwright E2E & Accessibility Suite Breakdown

```
Playwright Specs (8 passed / 8 total, 41 tests):
  ✓ tests/e2e/accessibility.spec.ts (6 tests: axe-core WCAG 2.2 AA on 4 pages, focus visible, skip-to-content)
  ✓ tests/e2e/dashboard.spec.ts (7 tests: title, AQI gauge, source badge, refresh, landmark)
  ✓ tests/e2e/location-selection.spec.ts (3 tests: selector, city update, localStorage persistence)
  ✓ tests/e2e/language.spec.ts (4 tests: toggle button, Hindi switch, roundtrip, navigation persistence)
  ✓ tests/e2e/planner.spec.ts (6 tests: heading, profile panel, budget tabs, filtering, evidence links, keyboard accessibility)
  ✓ tests/e2e/impact.spec.ts (6 tests: transport selectors, distance input, chart rendering, CO2e!=AQI disclaimer, mode update)
  ✓ tests/e2e/community.spec.ts (6 tests: heading, print button, community input, action items, Hindi rendering, disclaimer)
  ✓ tests/e2e/api-fallback.spec.ts (3 tests: CAMS fallback banner, numeric placeholder, notice text)
```

---

## 4. Debunked Assumptions & Verified Realities

| Previous Claim / Assumption | Verified Reality | Corrective Action Taken |
| :--- | :--- | :--- |
| *"CPCB API returned 4,004 records in 694 ms."* | **Debunked**: Upstream OGD resource hard-caps at **10 records per request**. City query returned scattered 1–2 pollutants per station, failing CPCB 3-pollutant threshold. | Implemented key-station targeting (`filters[station]=Anand Vihar, Delhi - DPCC`). Returns all 7 pollutants monitored in 1 request. |
| *"NASA clean-air plants purify indoor air."* | **Debunked**: NASA chamber studies (1989) do not scale to real residential air exchange rates ($0.5\text{ ACH}$). | Plants reframed strictly as aesthetic/psychological decor; filtration relies on true mechanical HEPA/MERV-13. |
| *"Afternoon air is always clean."* | **Debunked**: Afternoon boundary layer expansion offers only relative dispersion; ambient air remains Dangerous/Severe during winter episodes. | Time-of-day advice made strictly conditional on live AQI and forecast. |
| *"Personal CO2e savings directly reduce city AQI."* | **Debunked**: Transport CO2e is a global climate metric; localized particulate smog is driven by meteorological thermal inversion. | Clear disclaimer separating personal carbon savings from ambient city AQI. |
| *"In-memory rate limit is sufficient on Vercel."* | **Debunked**: In-memory `Map` is process-local; concurrent requests across serverless functions can bypass local limits. | Added optional Upstash Redis REST sliding-window limiter for `/api/recommendations` with local fail-open fallback. |

---

## 5. Production Readiness Blockers Ranking

- **P0 Blockers (Deploy Blockers)**: **0 remaining** (All resolved and verified).
- **P1 Considerations (Post-Deploy Optimization)**:
  - Add production Vercel project environment variables (`DATA_GOV_IN_API_KEY`, `GEMINI_API_KEY`, and optional `UPSTASH_REDIS_REST_URL`).
  - Configure Custom Domain on Vercel Hobby (e.g. `saanssaathi.vercel.app`).
- **P2 Minor Enhancements (Future Iterations)**:
  - Add service worker for offline Progressive Web App (PWA) manifest caching.
  - Expand `keyStations` list to additional Tier-2 Indian cities (Jaipur, Kanpur, Varanasi).
