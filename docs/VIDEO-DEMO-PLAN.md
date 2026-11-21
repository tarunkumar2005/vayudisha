# VayuDisha (वायुदिशा) — Hackathon Demo Video Production Plan & Narration Guide

**PromptWars Virtual Challenge 06: Urban Air Quality Assistant**  
**Product Name:** VayuDisha (वायुदिशा)  
**Tagline:** *"Know your air. Choose a better direction."* | *"हवा की समझ, बेहतर कल।"*  
**Production URL:** [https://vayudisha.vercel.app/](https://vayudisha.vercel.app/)  
**GitHub Repository:** [https://github.com/tarunkumar2005/vayudisha](https://github.com/tarunkumar2005/vayudisha)  
**Target Video Duration:** **3 minutes 45 seconds** (Strictly within the $< 4\text{ minute}$ competition limit)

---

## 1. Executive Product Understanding & Development Journey

### 1.1 The Real-World Problem
Every winter across northern and central India, nocturnal radiation inversions trap fine particulate matter ($\text{PM}_{2.5}$ and $\text{PM}_{10}$) within a shallow atmospheric boundary layer (50–100 m). AQI levels frequently surge above 400 ("Severe"), exposing infants, school-age children, and seniors to toxic smoke. 

Most public air-quality tools stop at displaying an alarming numerical index without actionable guidance. Meanwhile, ordinary citizens face contradictory advice, unscientific myths (such as relying on house plants to filter smog), unaffordable air purifiers, and lack of community coordination.

### 1.2 The Architecture Journey (How VayuDisha Evolved)
1. **Original Concept & Inception (SaansSaathi)**: Began as an intelligent conversational assistant designed to bridge India’s official Central Pollution Control Board (CPCB) continuous air monitoring stations (CAAQMS) with actionable daily family routines.
2. **CPCB Ground Telemetry Integration (`api.data.gov.in`)**: Integrated real-time OGD resource `3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`. Overcame the government API's 10-record pagination ceiling by engineering a deterministic multi-station registry (`src/lib/aqi/cpcb-registry.ts`) mapping cities, regional pollution control boards (DPCC, MPCB, KSPCB, BSPCB, WBPCB, TSPCB), and key stations.
3. **Copernicus CAMS Forecast Fallback (Open-Meteo)**: Integrated global 24-hour boundary-layer dispersion forecasts. Strictly separated satellite atmospheric model forecasts from observed ground station telemetry so synthetic or model data is never falsely labelled as official CPCB Indian AQI.
4. **Deterministic Safety Engine (MoHFW/NCDC Oct 2025 Alignment)**: Safety-critical health rules (outdoor exercise safety, school outdoor play restrictions, conditional N95 respirator guidance with airtight facial seal warnings, and indoor room air sealing) were codified into deterministic TypeScript rules rather than delegated to an unconstrained LLM.
5. **Google Gemini GenAI Integration (`@google/genai`)**: Engineered a hybrid AI personalization layer using `gemini-3.5-flash-lite` (with cascading fallback to `gemini-3.1-flash-lite` and deterministic static fallbacks). Gemini receives strictly sanitized, anonymized demographic profiles (zero PII, zero medical records) and generates warm, practical, culturally contextualized daily explanations.
6. **Indoor Air Filtration Engine (CADR & ACH)**: Implemented 3-tier room sizing calculations ($\text{CADR} = \text{Area} \times \text{Height} \times 4.5$) comparing ₹0 behavioral sealing, ₹2,000 DIY Corsi-Rosenthal MERV-13 box fans, and ₹9,000 True HEPA H13 units. Strictly debunked indoor plants as particulate cleaners (citing Cummings & Waring 2020) and banned ozone generators.
7. **Transport Carbon & Exposure Modeler**: Integrated passenger-kilometer emission factors ($\text{g CO}_2\text{e}/\text{pkm}$) from DMRC, SIAM, and Shakti Foundation, calculating annual $\text{CO}_2\text{e}$ savings (e.g. 81.3% reduction switching from car to metro) and tree equivalents, while explicitly maintaining that individual modal shifts reduce lifecycle GHG emissions rather than ambient outdoor city AQI.
8. **Community Clean Air Charter**: Built a printable one-page RWA action charter with high-contrast print stylesheets (`@media print`), enabling housing societies to mandate leaf-burning bans, security guard electric heaters, and wet walkway sweeping.
9. **The 35-Issue Release Audit Remediation**: Successfully resolved 10 High, 22 Medium, and 3 Low audit issues across data completeness, rate limits, PII sanitization, race conditions, and station identity integrity (e.g., separating Jamshedpur from Jorapokhar).
10. **Rebranding to VayuDisha (वायुदिशा)**: Crafted an editorial brand identity inspired by modern tactile product design—warm cream surfaces (`#FDFBF7`), deep forest green (`#174B36`), terracotta accents (`#C85A32`), custom bilingual SVG typography, and the friendly "Vayu" wind-companion mascot.
11. **Production Release**: Released on GitHub (`tarunkumar2005/vayudisha`) under 1.31 MiB (well below the 10 MB limit), passing 89/89 unit tests, 45/45 Playwright E2E tests with 0 axe-core accessibility violations, and deployed to Vercel at `https://vayudisha.vercel.app/`.

---

## 2. Product Story & Core Differentiators

### The Central Story
> *"Most air apps tell you the air is bad and leave you feeling helpless. VayuDisha combines official ground sensors, atmospheric inversion physics, and Google Gemini to give every Indian household and housing society a scientifically sound, budget-conscious daily direction."*

### Why VayuDisha Wins (The 5 Key Differentiators)
1. **Uncompromised Data Integrity**: Real continuous CPCB ground stations (DPCC, MPCB, KSPCB) with transparent Copernicus CAMS atmospheric forecast fallbacks. Model estimates are never falsely branded as official regulatory AQI.
2. **Deterministic Safety + GenAI Personalization**: Health decisions are locked into deterministic code aligned with MoHFW/NCDC guidelines; Google Gemini 3.5 Flash-Lite provides empathetic, culturally contextualized explanations.
3. **Scientific Honesty & Demystification**: Prominently separates carbon reductions ($\text{CO}_2\text{e}$) from ambient smog (AQI); debunks the myth of indoor air-cleaning plants; provides safe DIY Corsi-Rosenthal box fan specifications.
4. **Three Budget Tiers**: Realistic protection for every family—from Free (₹0 wet mopping and damp towel door draft seals) to DIY (₹2,000) to Premium True HEPA (₹9,000).
5. **From Individual to Community**: Bridges personal household safety with a printable, single-page RWA Clean Air Charter for apartment complexes.

---

## 3. Video Structure & Time Budget

| Scene | Route | Key Feature / Subject | Time | Running Time |
| :---: | :--- | :--- | :---: | :---: |
| **1** | `/` | Hook: The Winter Smog Crisis & VayuDisha Identity | 0:25 | 0:00 – 0:25 |
| **2** | `/dashboard` | Live CPCB Ground Telemetry & Station Switching | 0:40 | 0:25 – 1:05 |
| **3** | `/planner` | Household Profile Setup & Deterministic Rules | 0:35 | 1:05 – 1:40 |
| **4** | `/planner` | Live GenAI in Action: Gemini 3.5 Flash-Lite & Dynamic Change | 0:45 | 1:40 – 2:25 |
| **5** | `/` | In-Situ CADR Calculator & 3 Budget Tiers | 0:30 | 2:25 – 2:55 |
| **6** | `/impact` | Modal Shift Commute Calculator & Honest Scientific Disclaimer | 0:25 | 2:55 – 3:20 |
| **7** | `/community` | Printable 1-Page RWA Clean Air Charter | 0:15 | 3:20 – 3:35 |
| **8** | `/dashboard` | Transparent Edge-Case Fallback (Jamshedpur) & Closing | 0:10 | 3:35 – 3:45 |
| **Buffer** | — | Safety Margin (Strictly under 4:00) | 0:15 | 3:45 – 4:00 |

---

## 4. Time-Coded Storyboard

### Scene 1: Introduction & The Problem (0:00 – 0:25)
* **Route**: `https://vayudisha.vercel.app/`
* **Visual**: Clean desktop view showing the VayuDisha hero section, warm palette (`#FDFBF7`), custom logo, "Vayu" wind companion, and floating live AQI card. Toggle language button to Hindi (`हिन्दी`) and back to English (`English`) once to show bilingual readiness.
* **Actions**:
  1. Open homepage.
  2. Cursor hovers smoothly over the live AQI pill and companion greeting.
  3. Click language toggle (`हिन्दी` $\rightarrow$ `English`).
* **Narration**:
  *"Every winter across India, cold atmospheric inversions trap toxic vehicle exhaust and dust near the ground, pushing AQI past 400. Most air apps just show a red warning number and stop there. We built **VayuDisha**—an intelligent urban air quality and sustainability assistant that combines official Indian ground sensors, atmospheric physics, and Google Gemini to help families and housing societies take clear, practical daily action."*
* **Competition Requirement Satisfied**: Problem Statement, Branding, Bilingual Support.

---

### Scene 2: Live CPCB Air Telemetry Workstation (0:25 – 1:05)
* **Route**: Click **"Open Air Telemetry"** CTA $\rightarrow$ navigate to `/dashboard`
* **Visual**: Telemetry dashboard loads. Shows circular AQI gauge, prominent pollutant tag, SourceBadge (`CPCB Official Ground Station via data.gov.in`), and 24-hour CAMS inversion forecast curve.
* **Actions**:
  1. Click **"Open Air Telemetry"**.
  2. In the City dropdown, ensure **Delhi NCR** is selected. Point to `Anand Vihar, Delhi - DPCC`, AQI ~420 ("Severe"), and the 7 live continuous pollutant sub-indices ($\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{CO}, \text{SO}_2, \text{O}_3, \text{NH}_3$).
  3. Click on the station selector dropdown or multi-station card to switch to another verified station (e.g. `Shadipur` or switch city to `Bengaluru` $\rightarrow$ `Jayanagar 5th Block - KSPCB`).
  4. Point to the **SourceBadge** showing the exact station name, data freshness timestamp, and operating state pollution control board.
* **Narration**:
  *"Starting on our Telemetry Workstation: VayuDisha connects directly to the Central Pollution Control Board via data.gov.in. Here in Delhi, we see live ground readings from Anand Vihar—AQI 424, Severe, driven by PM2.5. We display all seven regulatory pollutant sub-indices, verified averaging windows, and operating boards like DPCC. Below it, we plot a 24-hour atmospheric inversion forecast from Copernicus CAMS, showing families exactly when surface air warms up for safer afternoon ventilation."*
* **Competition Requirement Satisfied**: Official CPCB Ground Telemetry, Multi-Station Switching, Transparent Data Provenance.

---

### Scene 3: Household Profile & Deterministic Safety Rules (1:05 – 1:40)
* **Route**: Click **"Planner"** in top navbar $\rightarrow$ `/planner`
* **Visual**: Routine Protection Planner. Left side shows Household Setup & Lifestyle Profile. Right side displays Activity Safety Matrix and Mask Guidance.
* **Actions**:
  1. Navigate to `/planner`.
  2. Enter **Scenario 1**:
     - Check: **Infants / Toddlers (under 5)**
     - Check: **School Children (5-17)**
     - Commute: **Metro Rail**
     - Budget: **Low-Cost DIY (₹2,000 - ₹3,000)**
  3. Observe the instant deterministic update in the Activity Safety Card:
     - Outdoor Exercise: **Unsafe (Red cross)**
     - School Play: **Restricted Indoors**
     - Mask Guidance: **Certified N95 Respirator strongly recommended with airtight facial seal**
* **Narration**:
  *"Now let’s visit the Family Routine Planner. Health safety decisions should never be left to an unconstrained AI hallucination. In VayuDisha, all health rules are strictly deterministic, codified directly from the Ministry of Health and NCDC October 2025 guidelines. Selecting school children and toddlers immediately updates our activity matrix: outdoor sports are flagged unsafe, and conditional N95 respirator guidance is triggered with explicit medical cautions against loose cloth masks."*
* **Competition Requirement Satisfied**: Deterministic Safety Engine, MoHFW/NCDC Alignment, Transparent Safety Guardrails.

---

### Scene 4: Visible GenAI in Action — Gemini 3.5 Flash-Lite (1:40 – 2:25)
* **Route**: `/planner` (Scrolling down to Personalized Advisory section)
* **Visual**: **"Gemini 3.5 Flash Lite Advisory"** badge with sparkle icon. Shows opening encouragement tailored to Delhi and children, followed by personalized advice cards and verified evidence citations.
* **Actions**:
  1. Scroll down to show Gemini’s dynamic response:
     - Opening encouragement mentioning Delhi winter smog and protecting young children.
     - Personalized tip: *"Switch to Damp Microfiber Mopping"* (explaining why dry broom sweeping resuspends PM2.5 into toddler breathing zones).
     - Door/window draft sealing with damp towels.
  2. **Demonstrate Dynamic AI Response**: Change the household setup live:
     - Check **"Senior Citizens (65+)"** and **"Asthma / Respiratory Condition"**.
     - Change Commute to **"Personal Car"**.
     - Change Budget to **"Commercial Premium"**.
  3. Watch the subtle loading indicator and observe Gemini dynamically regenerate:
     - Opening greeting updates for elderly respiratory care.
     - Advice shifts to True HEPA CADR air cleaning (4.5 ACH) and vehicle HVAC cabin recirculate mode with PM2.5 filter checks.
     - Point out the evidence citation from WHO and EPA.
* **Narration**:
  *"Here is where Generative AI creates real value. Before calling Google Gemini 3.5 Flash-Lite, our backend privacy sanitizer strips all personal identifiers and emails. Gemini receives only an anonymized profile and our approved scientific interventions. Notice the generated output: it doesn't give generic advice—it explains specifically why damp mopping protects a toddler's breathing zone during morning inversion. Watch what happens when I switch our profile to senior citizens with asthma and commercial budget: Gemini dynamically re-analyzes the scenario in under 1.5 seconds, delivering verified True HEPA room sizing and in-car recirculate tips with citations to WHO and EPA studies."*
* **Competition Requirement Satisfied**: Visible GenAI Integration, Real-Time Dynamic Response, Privacy Sanitization, Model Cascading.

---

### Scene 5: Indoor Air Quality & The 3-Step CADR Tool (2:25 – 2:55)
* **Route**: Click logo or Home $\rightarrow$ `/` (Scroll to *"Try It: 3 Steps to Clean Indoor Air"*)
* **Visual**: Interactive in-situ clean air calculator with Room Size pills (120, 200, 350 sq ft) and Budget Tier pills (Free, DIY, HEPA).
* **Actions**:
  1. Scroll to the **"Try It"** calculator on the homepage.
  2. Click **200 sq ft (Master Bedroom)**.
  3. Click **₹2,000 DIY Corsi-Rosenthal Box Fan**.
  4. Point out the live calculations:
     - Room Volume: $50.9\text{ m}^3$
     - Target Clean Air Delivery Rate: $229\text{ m}^3\text{/h}$
     - Air Changes per Hour: $4.9\text{ ACH}$
     - Safety note: Post-2012 thermal fuse fan + MERV-13 filter.
  5. Toggle to **₹0 Free**: Shows wet mopping and door draft damp towel seal.
* **Narration**:
  *"Indoor air quality shouldn't require a ₹30,000 commercial machine. In our interactive 3-step calculator, a family selects their room size and budget. For a 200-square-foot bedroom with a ₹2,000 budget, VayuDisha sizes an EPA-tested Corsi-Rosenthal box fan, computing a target CADR of 229 cubic meters per hour to achieve 4.9 clean air changes per hour. We explicitly debunk indoor plants as particulate filters and prohibit dangerous ozone generators."*
* **Competition Requirement Satisfied**: Budget-Conscious Interventions, CADR/ACH Calculations, Scientific Demystification.

---

### Scene 6: Sustainable Commute & Transport Impact (2:55 – 3:20)
* **Route**: Click **"Impact"** in navbar $\rightarrow$ `/impact`
* **Visual**: Commute Carbon & Smog Exposure Modeler. Mode dropdowns, distance slider, and live GHG savings summary card.
* **Actions**:
  1. Navigate to `/impact`.
  2. Set Current Mode: **Personal Car (Petrol) [150 g CO₂e/km]**.
  3. Set Alternative Mode: **Metro Rail [28 g CO₂e/km]**.
  4. Adjust Distance slider to **14 km** (10 trips/week).
  5. Point to the calculated results:
     - **888 kg CO₂e saved per year** (**81.3% reduction**)
     - Equivalent to **44 mature urban trees** absorbing carbon.
     - In-cabin exhaust exposure reduction: **~65%**.
  6. Point out the **Scientific Disclaimer Banner**: *Individual carbon savings reduce personal lifecycle GHG footprint; they do not claim to reduce citywide ambient AQI.*
* **Narration**:
  *"On the Impact page, users model sustainable transport alternatives using audited Indian emission factors from SIAM and DMRC. Switching a 14-kilometer daily car commute to Metro Rail cuts personal transport emissions by 81%—saving 888 kilograms of CO2e annually, equal to 44 mature trees. Crucially, we maintain absolute scientific honesty: we explain that modal shifts reduce personal carbon and toxic in-cabin exhaust exposure, without making false claims that one person's commute lowers citywide ambient AQI."*
* **Competition Requirement Satisfied**: Environmental Impact Calculations, Audited Indian Emission Factors, Scientific Honesty Disclaimer.

---

### Scene 7: Community Clean Air Charter (3:20 – 3:35)
* **Route**: Click **"Community"** in navbar $\rightarrow$ `/community`
* **Visual**: RWA Clean Air Action Plan with RWA name input and clean printable certificate layout.
* **Actions**:
  1. Navigate to `/community`.
  2. Type in Society Name: **"Gulmohar Enclave RWA"**.
  3. Point to the dynamic rendering of Top 3 Immediate Actions (electric leaf blowing, guard electric heaters to prevent biomass burning, wet suppression).
  4. Click the **"Print / Save PDF"** button. The browser print preview dialog opens, demonstrating the clean single-page legal charter format with official verification seal. Click Cancel/Close.
* **Narration**:
  *"Clean air requires collective action. Our Community tool lets Resident Welfare Associations enter their society name and instantly generate a tailored Clean Air Charter. With one click on 'Print / Save PDF', our print stylesheet formats a crisp one-page action plan banning security guard biomass fires and walkway dry-sweeping, ready for society noticeboards."*
* **Competition Requirement Satisfied**: Community Action Plan, Printable PDF/Charter Feature.

---

### Scene 8: Transparent Edge-Case Fallback & Closing (3:35 – 3:45)
* **Route**: `/dashboard`
* **Visual**: Switch City dropdown to **Jamshedpur**. Show the clean CAMS atmospheric model fallback banner.
* **Actions**:
  1. Select **Jamshedpur** from the city dropdown.
  2. Point to the transparent fallback notice: *"Official CPCB ground station data is currently unavailable for this location. Showing atmospheric model forecast from Copernicus (CAMS)."*
  3. Show that numerical AQI is honestly kept `null`, category is labelled source-neutral, and zero fake synthetic data is displayed.
* **Narration**:
  *"Finally, our edge-case resilience: when a city like Jamshedpur has no active CPCB ground station, VayuDisha never fabricates fake numbers or maps to distant towns. It transparently falls back to Copernicus atmospheric modeling with a clear provenance banner. VayuDisha—know your air, choose a better direction. Thank you!"*
* **Competition Requirement Satisfied**: Edge-Case Demonstration, Graceful Fallback, Final Branding.

---

## 5. Complete Spoken Narration Script

> **Speaking Pace**: 125 words per minute  
> **Total Word Count**: 468 words  
> **Estimated Spoken Duration**: **3 minutes 45 seconds** (including natural pauses and UI transitions)

```text
[0:00 - 0:25 | Homepage]
"Every winter across northern India, cold atmospheric inversions trap toxic vehicle exhaust and dust near the ground, pushing AQI past 400. Most air apps just show an alarming red number and stop there. We built VayuDisha—an intelligent urban air quality and sustainability assistant that combines official Indian ground sensors, atmospheric physics, and Google Gemini to help families and housing societies take clear, practical daily action."

[0:25 - 1:05 | Dashboard]
"Starting on our Telemetry Workstation: VayuDisha connects directly to the Central Pollution Control Board via data.gov.in. Here in Delhi, we see live ground readings from Anand Vihar—AQI 424, Severe, driven by PM2.5. We display all seven regulatory pollutant sub-indices, verified averaging windows, and operating boards like DPCC. Below it, we plot a 24-hour atmospheric inversion forecast from Copernicus CAMS, showing families exactly when surface air warms up for safer afternoon ventilation."

[1:05 - 1:40 | Planner: Profile & Rules]
"Now let’s visit the Family Routine Planner. Health safety decisions should never be left to an unconstrained AI hallucination. In VayuDisha, all health rules are strictly deterministic, codified directly from the Ministry of Health and NCDC October 2025 guidelines. Selecting school children and toddlers immediately updates our activity matrix: outdoor sports are flagged unsafe, and conditional N95 respirator guidance is triggered with explicit medical cautions against loose cloth masks."

[1:40 - 2:25 | Planner: Gemini GenAI]
"Here is where Generative AI creates real value. Before calling Google Gemini 3.5 Flash-Lite, our backend privacy sanitizer strips all personal identifiers and emails. Gemini receives only an anonymized profile and our approved scientific interventions. Notice the generated output: it doesn't give generic advice—it explains specifically why damp mopping protects a toddler's breathing zone during morning inversion. Watch what happens when I switch our profile to senior citizens with asthma and commercial budget: Gemini dynamically re-analyzes the scenario in under 1.5 seconds, delivering verified True HEPA room sizing and in-car recirculate tips with citations to WHO and EPA studies."

[2:25 - 2:55 | Homepage: Try It CADR]
"Indoor air quality shouldn't require a ₹30,000 commercial machine. In our interactive 3-step calculator, a family selects their room size and budget. For a 200-square-foot bedroom with a ₹2,000 budget, VayuDisha sizes an EPA-tested Corsi-Rosenthal box fan, computing a target CADR of 229 cubic meters per hour to achieve 4.9 clean air changes per hour. We explicitly debunk indoor plants as particulate filters and prohibit dangerous ozone generators."

[2:55 - 3:20 | Impact Page]
"On the Impact page, users model sustainable transport alternatives using audited Indian emission factors from SIAM and DMRC. Switching a 14-kilometer daily car commute to Metro Rail cuts personal transport emissions by 81%—saving 888 kilograms of CO2e annually, equal to 44 mature trees. Crucially, we maintain absolute scientific honesty: we explain that modal shifts reduce personal carbon and toxic in-cabin exhaust exposure, without making false claims that one person's commute lowers citywide ambient AQI."

[3:20 - 3:35 | Community Page]
"Clean air requires collective action. Our Community tool lets Resident Welfare Associations enter their society name and instantly generate a tailored Clean Air Charter. With one click on 'Print / Save PDF', our print stylesheet formats a crisp one-page action plan banning security guard biomass fires and walkway dry-sweeping, ready for society noticeboards."

[3:35 - 3:45 | Dashboard: Edge Case & Outro]
"Finally, our edge-case resilience: when a city like Jamshedpur has no active CPCB ground station, VayuDisha never fabricates fake numbers or maps to distant towns. It transparently falls back to Copernicus atmospheric modeling with a clear provenance banner. VayuDisha—know your air, choose a better direction. Thank you!"
```

---

## 6. Condensed Fast-Paced Backup Script

> **Target Duration**: **3 minutes 15 seconds** | **Word Count**: 395 words (Use if your natural cadence is slower or if browser network latency requires longer pauses)

```text
[0:00 - 0:20 | Homepage]
"Every winter, thermal inversions trap toxic particulate matter across Indian cities, pushing AQI past 400. VayuDisha is an intelligent urban air quality assistant connecting official CPCB ground telemetry, atmospheric physics, and Google Gemini to give families practical, budget-conscious daily direction."

[0:20 - 0:55 | Dashboard]
"On our Telemetry Dashboard, VayuDisha streams live CPCB data via data.gov.in. In Delhi, Anand Vihar reports an AQI of 424, Severe. We display all seven pollutant sub-indices alongside a 24-hour Copernicus CAMS inversion forecast curve, predicting diurnal boundary-layer shifts."

[0:55 - 1:30 | Planner: Deterministic Rules]
"In our Family Planner, safety decisions are 100% deterministic, aligned with Government of India MoHFW October 2025 guidelines. Selecting school children and toddlers immediately restricts outdoor physical activity and triggers certified N95 respirator guidance with airtight seal cautions."

[1:30 - 2:10 | Planner: Gemini GenAI]
"Generative AI provides personalized family guidance. Our backend strips all PII before sending anonymized parameters to Google Gemini 3.5 Flash-Lite. Gemini contextualizes approved interventions—such as wet microfiber mopping to protect toddler breathing zones. When I update the profile to senior citizens with asthma, Gemini dynamically regenerates tailored True HEPA advice in under two seconds."

[2:10 - 2:35 | Homepage: CADR Tool]
"Our interactive 3-step CADR calculator sizes air filtration for any room. For a 200-square-foot bedroom on a ₹2,000 budget, it computes a target CADR of 229 cubic meters per hour for a DIY Corsi-Rosenthal box fan, delivering 4.9 air changes per hour while strictly prohibiting ozone generators."

[2:35 - 3:00 | Impact Page]
"On the Impact page, commuter modal shifts are calculated using DMRC and SIAM factors. Switching a 14-kilometer commute from a petrol car to Metro Rail cuts personal emissions by 81%—saving 888 kilograms of CO2e annually. We clearly distinguish individual greenhouse gas savings from regional outdoor AQI."

[3:00 - 3:15 | Community Page]
"For residential societies, our Community tool generates a tailored Clean Air Charter with a one-click printable PDF stylesheet, implementing idling bans and electric guard heaters."

[3:15 - 3:25 | Edge Case & Outro]
"For cities without active CPCB stations like Jamshedpur, VayuDisha honestly falls back to Copernicus CAMS modeling without fabricating data. VayuDisha: know your air, choose a better direction. Thank you!"
```

---

## 7. GenAI Demonstration Architecture

Judges specifically inspect the GenAI component. The table below details what happens under the hood during the demo:

```
[User Input in Planner] 
  ├── Checkboxes: School Children + Toddlers
  ├── Commute: Metro Rail
  └── Budget: Low-Cost DIY (₹2,000)
             │
             ▼
[Privacy Sanitizer (src/lib/gemini/sanitizer.ts)]
  ├── Strips emails, phone numbers, Indian street addresses
  ├── Anonymizes profile to boolean vulnerability categories
  └── Injects ONLY pre-approved MoHFW/EPA scientific recommendations
             │
             ▼
[Gemini 3.5 Flash-Lite (@google/genai)]
  ├── System Prompt enforces: No medical prescriptions, No false AQI claims
  ├── Fallback model: gemini-3.1-flash-lite (6-second timeout race)
  └── Returns Structured JSON (Opening Encouragement + Personalized Advice)
             │
             ▼
[Output Validator (Zod Schema)]
  ├── Verifies IDs belong to approved template allowlist
  ├── Regex filters reject forbidden terms (/\bcure\b/, /\breduce city aqi\b/)
  └── Renders dynamically in Planner UI (<ActivitySafetyCard />)
```

---

## 8. Exact Live Demo Input Dataset

| Tool / Page | Parameter | Scenario 1 (Initial Setup) | Scenario 2 (Dynamic AI Change) |
| :--- | :--- | :--- | :--- |
| **Dashboard** | City | **Delhi NCR** | Switch to **Bengaluru** or **Pune** |
| **Dashboard** | Station | `Anand Vihar, Delhi - DPCC` | `Jayanagar 5th Block - KSPCB` |
| **Planner** | Toddlers / Infants | **Checked (True)** | Unchecked (False) |
| **Planner** | School Children | **Checked (True)** | Unchecked (False) |
| **Planner** | Senior Citizens | Unchecked (False) | **Checked (True)** |
| **Planner** | Respiratory Vulnerability | Unchecked (False) | **Checked (True)** |
| **Planner** | Commute Mode | **Metro Rail** | **Personal Car** |
| **Planner** | Budget Tier | **Low-Cost DIY (₹2,000–₹3,000)** | **Commercial Premium (₹8,000–₹15,000)** |
| **Homepage** | Room Size Pill | **200 sq ft (Master Bedroom)** | 350 sq ft (Living Room) |
| **Homepage** | Budget Pill | **₹2,000 DIY Corsi-Rosenthal** | ₹9,000 True HEPA H13 |
| **Impact** | Current Mode | **Personal Car (Petrol)** | Two-Wheeler (Petrol) |
| **Impact** | Alternative Mode | **Metro Rail** | Public City Bus |
| **Impact** | Commute Distance | **14 km** (10 trips/week) | 18 km (10 trips/week) |
| **Community** | Society Name | **"Gulmohar Enclave RWA"** | "Green Meadows Heights" |
| **Edge Case** | Fallback City | **Jamshedpur** (CAMS Fallback) | — |

---

## 9. MacBook Screen Recording Instructions

### 9.1 Display & Browser Setup
1. **Resolution**: Set display to standard 1080p scaling ($1920 \times 1080$).
2. **Browser**: Use Google Chrome in clean Full Screen mode (`Cmd + Shift + F`).
3. **Zoom Level**: Set Chrome zoom to **100%** or **110%** so typography and pollutant numbers are crystal clear.
4. **URL to open**: `https://vayudisha.vercel.app/`
5. **Clean Session**:
   - Close all bookmarks bar items (`Cmd + Shift + B`).
   - Close all other tabs.
   - Turn on macOS **Do Not Disturb / Focus Mode** to prevent incoming notifications.

### 9.2 Recording with macOS Native Tool
1. Press **`Cmd + Shift + 5`**.
2. Select **"Record Entire Screen"** (or drag the marquee over the full $1920 \times 1080$ browser area).
3. Under **Options**:
   - **Microphone**: Select your external USB mic or MacBook built-in mic.
   - **Show Mouse Clicks**: Check **ON** (shows a helpful circle on clicks).
   - **Timer**: 5 seconds (gives you time to prepare).
4. Click **Record**.

### 9.3 Free Editing & Post-Production Workflow
1. **Trim Head and Tail**: Open the recorded `.mov` file in **QuickTime Player** (`Cmd + T`) or **iMovie** / **Shotcut** (free, open source).
2. **Audio Balancing**:
   - Apply a gentle noise reduction filter and normalize volume to **-14 LUFS** (standard YouTube loudness).
   - Ensure the voice is clear, crisp, and contains zero background hiss or keyboard clatter.
3. **Subtitles / Captions**:
   - YouTube automatically generates accurate captions, but adding simple lower-third chapter titles (e.g., *"01: Live CPCB Telemetry"*, *"02: Gemini 3.5 AI Personalization"*, *"03: CADR Calculator"*) enhances clarity.
4. **Export Settings**:
   - Resolution: **1080p (1920x1080)**
   - Format: **MP4 (H.264 / AAC)**
   - Framerate: **30 FPS**
   - Target File Size: Under 150 MB for rapid upload.

---

## 10. YouTube Upload & Verification Checklist

1. **Upload to YouTube Studio**:
   - Go to [studio.youtube.com](https://studio.youtube.com).
   - Set Visibility to **"Unlisted"** (or **"Public"**). *Do not select Private.*
   - Title: `VayuDisha (वायुदिशा) — Intelligent Urban Air Quality Assistant | PromptWars 06`
2. **Description & Links**: Include the production URL, GitHub repo, and time-stamped chapters.
3. **Incognito Verification**:
   - Open an Incognito window (`Cmd + Shift + N`).
   - Paste the YouTube link.
   - Verify that the video plays immediately without login, audio is synchronized, and resolution defaults to 1080p HD.

---

## 11. Judge Q&A Defense & Architectural Explanations

### Q1: Why not let Gemini directly calculate the AQI and health safety recommendations?
**Answer:** *"Air quality indices and medical safety advisories have zero tolerance for stochastic hallucination. India's CPCB regulatory AQI requires exact piecewise linear interpolation over strict 16-hour data completeness windows. Health advisories follow the Ministry of Health and NCDC October 2025 guidelines. We use deterministic TypeScript algorithms for all mathematical calculations, AQI category mappings, and activity restrictions. Gemini’s role is strictly generative: translating those deterministic constraints into empathetic, culturally nuanced, household-specific explanations."*

### Q2: How does VayuDisha handle upstream government API rate limits or outages?
**Answer:** *"India's data.gov.in portal operates on a free tier with burst rate limits. VayuDisha implements a 3-tier resilient architecture: first, a 15-minute in-memory server-side cache prevents burning quota; second, if data.gov.in returns HTTP 429 or goes down, our merger immediately breaks redundant calls and transparently activates Copernicus CAMS atmospheric model forecasting via Open-Meteo. The UI displays an honest provenance notice and keeps numerical AQI null to preserve scientific integrity."*

### Q3: Why do you claim individual actions don't reduce outdoor city AQI?
**Answer:** *"Winter smog in northern India is driven by meteorological thermal inversions trapping thousands of tons of vehicular, industrial, and agricultural emissions across entire airsheds. Claiming that one family choosing not to drive reduces citywide ambient AQI is scientifically false. We educate users that modal shifts significantly lower their personal transport greenhouse gas footprint (CO2e) and in-cabin exhaust exposure, while indoor air filtration protects their immediate breathing space."*

### Q4: Why do you advise against indoor potted plants for smog filtration?
**Answer:** *"While plants offer biophilic and psychological wellness, rigorous scientific reviews (such as Cummings & Waring 2020) prove that potted plants in real building volumes have virtually zero impact on particulate matter (PM2.5) or VOC reduction compared to mechanical ventilation. Suggesting plants as smog protection creates dangerous complacency. We steer families toward proven mechanical filtration: ₹0 wet mopping, ₹2,000 DIY Corsi-Rosenthal box fans, or True HEPA H13 purifiers."*

---

## 12. Pre-Recording Pre-Flight Checklist

- [ ] **Live Telemetry Check**: Open `https://vayudisha.vercel.app/api/aqi?city=Delhi` in a tab; confirm `"officialCpcbAvailable": true` and live DPCC station data loads in $< 1\text{s}$.
- [ ] **Live AI Check**: Open `/planner`; toggle a profile checkbox and confirm the Gemini advisory card generates with `"isAiGenerated": true`.
- [ ] **Display Setup**: 1080p landscape scaling, Chrome at 100%, bookmarks bar hidden.
- [ ] **Distraction Free**: macOS Do Not Disturb active; Slack/WhatsApp/Mail closed.
- [ ] **Audio Test**: Record a 10-second mic test; verify clear voice pickup with zero echo.
- [ ] **Rehearsal**: Practice the 468-word script once with a stopwatch; verify finishing between **3:35 and 3:45**.
- [ ] **Final Link Check**: Test video link in a private/incognito window before submitting to Hack2Skill.