# SaansSaathi — Data Sources & API Integrations

## 1. Central Pollution Control Board (CPCB) / data.gov.in

* **Platform**: Open Government Data (OGD) Platform India (`data.gov.in`)
* **Ministry**: Ministry of Environment, Forest and Climate Change (MoEFCC)
* **Resource Identifier**: `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`
* **Base Endpoint**: `https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`
* **Authentication**: Developer API Key passed via query param `api-key`.
* **Nature of Data**: Official observed ground station readings across India (Continuous Ambient Air Quality Monitoring Stations - CAAQMS).
* **Update Frequency**: Approximately hourly.
* **Freshness Threshold**: Telemetry older than 6 hours is explicitly marked as "Delayed / Stale".
* **Validation**:
  * Records validated via strict Zod schemas.
  * Corrupted negative values (`pollutant_avg < 0`) and unphysical sensor spikes (`> 999 µg/m³` for particulates) are automatically discarded.
  * Timestamps parsed from Indian Standard Time (IST) format `DD-MM-YYYY HH:MM:SS`.

---

## 2. Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo

* **Provider**: Open-Meteo Air Quality API
* **Base Endpoint**: `https://air-quality-api.open-meteo.com/v1/air-quality`
* **Domain Model**: `cams_global` (~45 km spatial resolution)
* **Authentication**: None required (10,000 free requests/day).
* **Nature of Data**: Numerical atmospheric model forecast, **never** an observed ground station reading.
* **Variables Queried**:
  * `pm2_5`: Fine particulate matter ($\mu\text{g/m}^3$)
  * `pm10`: Coarse particulate matter ($\mu\text{g/m}^3$)
  * `nitrogen_dioxide`: $\text{NO}_2$ ($\mu\text{g/m}^3$)
  * `sulphur_dioxide`: $\text{SO}_2$ ($\mu\text{g/m}^3$)
  * `carbon_monoxide`: $\text{CO}$ (returned in $\mu\text{g/m}^3$; converted to $\text{mg/m}^3$ by SaansSaathi for CPCB alignment)
  * `ozone`: $\text{O}_3$ ($\mu\text{g/m}^3$)
* **Strict Rule**: CAMS data is **never** labeled as official CPCB AQI. When official ground stations are unavailable, CAMS data is shown clearly labeled as a model forecast and official AQI is rendered as `--`.

---

## 3. Google Gemini Developer API

* **Model Identifier**: `gemini-3.8-flash`
* **SDK**: `@google/genai` (v3.6.1)
* **Execution**: Strictly server-side via Next.js Route Handlers.
* **Role**: Personalized natural language explanation and routine synthesis for pre-approved safety recommendations.
* **Privacy & Security**:
  * PII sanitizer completely strips names, exact coordinates, addresses, and clinical medical records.
  * Structured JSON output validated using Zod.
  * RegEx filters strictly block any medical diagnosis, prescription advice, or false claims regarding ambient city AQI reduction.
  * Fully transparent fallback to reviewed static bilingual guidance when API keys are absent or rate-limited.
