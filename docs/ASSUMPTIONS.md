# SaansSaathi — Methodological Assumptions & Citations

This document details the scientific, regulatory, and mathematical foundations utilized in **SaansSaathi** for air quality index derivation, personal exposure mitigation, and transport greenhouse gas (GHG) calculations.

---

## 1. National Air Quality Index (AQI) Calculation

India's National Air Quality Index was established by the **Central Pollution Control Board (CPCB)** in October 2014 in collaboration with IIT Kanpur.

### Sub-Index Interpolation Formula

The sub-index ($I_p$) for a measured pollutant concentration ($C_p$) is calculated using piecewise linear interpolation across contiguous breakpoint boundaries:

$$I_p = \frac{I_{\text{HI}} - I_{\text{LO}}}{B_{\text{HI}} - B_{\text{LO}}} \times (C_p - B_{\text{LO}}) + I_{\text{LO}}$$

Where:
* $C_p$: Measured pollutant concentration averaged over its regulatory window:
  * **24-hour averages** for $\text{PM}_{2.5}, \text{PM}_{10}, \text{NO}_2, \text{SO}_2, \text{NH}_3, \text{Pb}$.
  * **8-hour averages** for $\text{CO}$ and $\text{O}_3$.
* $B_{\text{HI}}, B_{\text{LO}}$: Upper and lower concentration breakpoints for the corresponding category bracket.
* $I_{\text{HI}}, I_{\text{LO}}$: Upper and lower AQI bounds for the corresponding category bracket.

### Regulatory Minimum Data Completeness Rules (CPCB 2014 Section 3.2)

1. **16-Hour Rule for 24-Hour Averages**: A valid 24-hour average requires at least **16 hours** of valid monitoring data within that 24-hour window. Readings with fewer than 16 hours of data are strictly excluded from regulatory AQI computation.
2. **6-Hour Rule for 8-Hour Averages**: For $\text{CO}$ and $\text{O}_3$, a valid 8-hour average requires at least **6 hours** of valid monitoring data.
3. **Minimum Multi-Pollutant Criterion**: An overall Indian AQI is calculated **only if** at least **3 pollutants** meet regulatory averaging requirements, with **at least one** being a particulate pollutant ($\text{PM}_{2.5}$ or $\text{PM}_{10}$). If fewer than 3 pollutants or no PM pollutant is available, overall AQI is strictly returned as `null` ("Data Insufficient").

### Provenance Tracking: Official Supplied vs. Derived Estimate

* **Official CPCB Supplied AQI**: Directly reported by CPCB monitoring stations or bulletin feeds.
* **Derived CPCB Sub-Index Estimate**: Calculated client/server-side from valid multi-pollutant concentrations using the maximum sub-index method:
$$\text{Overall AQI} = \max(I_{\text{PM}2.5}, I_{\text{PM}10}, I_{\text{NO}2}, I_{\text{SO}2}, I_{\text{CO}}, I_{\text{O}3}, I_{\text{NH}3}, I_{\text{Pb}})$$
* The pollutant yielding the highest sub-index is designated as the **Prominent Pollutant**.

---

## 2. Health & Safety Advisories (MoHFW/NCDC October 2025 Alignment)

All health guidelines in SaansSaathi strictly align with the **Government of India Ministry of Health and Family Welfare (MoHFW) / National Centre for Disease Control (NCDC)** advisory of October 2025:

1. **Exposure Reduction is Primary**: Physical isolation from polluted ambient air (staying indoors, sealing window/door cracks, avoiding outdoor exertion) is the first line of defense.
2. **Conditional Respirator Guidance (N95/N99)**:
   * Respirators are conditionally recommended for unavoidable outdoor transit, not as blanket mandates.
   * Tight facial fit with an airtight seal is mandatory; facial hair and loose surgical or cloth masks fail to protect against $\text{PM}_{2.5}$.
   * Medical caution: Individuals with severe asthma, COPD, or cardiac disorders must consult their physician before using tight-fitting respirators due to increased breathing resistance.
3. **Thermal Inversion Reality**:
   * Nocturnal radiation inversion traps smoke in a shallow surface boundary layer (50–100 m) during early mornings (6–9 AM) and late nights (8–11 PM).
   * While afternoon solar warming deepens boundary layer mixing, afternoon air during severe winter smog episodes remains hazardous. Vulnerable populations must avoid outdoor exertion all day.
4. **Indoor Air Filtration**:
   * **Corsi-Rosenthal DIY Air Cleaners**: Validated as an affordable emergency alternative when commercial HEPA units are inaccessible. Requires box fans manufactured in 2012 or later with UL/ETL safety marks and thermal fused plugs, genuine MERV-13+ filters, airflow arrow oriented toward the fan, sealed perimeters, and adult electrical supervision.
   * **True HEPA Filtration**: Sizing must deliver 4 to 5 Air Changes per Hour ($\text{Target CADR} = \text{Room Area} \times \text{Ceiling Height} \times 4.5$). Particulate HEPA filters capture solid particles, not gases; gas removal requires activated carbon. **Ozone-generating air cleaners, ionizers, and electronic cleaners are strictly prohibited** due to severe lung toxicity.
   * **Indoor Plants**: Scientific literature (Cummings & Waring 2020) confirms potted plants cannot meaningfully purify $\text{PM}_{2.5}$ or VOCs in real homes. They are presented solely for biophilic and psychological wellness.

---

## 3. Transport CO₂e Emission Factors

Transport carbon calculations are evaluated per passenger-kilometer ($\text{g CO}_2\text{e} / \text{passenger-km}$) to account for real-world Indian vehicle fleet occupancy.

| Mode | Factor ($\text{g CO}_2\text{e} / \text{pkm}$) | Primary Source | Documented Assumptions |
|---|:---:|---|---|
| **Personal Car (Petrol)** | 150 | India GHG Program / Shakti Foundation | Indian compact/sedan fleet average; urban stop-and-go driving; 1.5 average passenger occupancy. |
| **Personal Car (Diesel)** | 130 | India GHG Program Transport Guidance | Compact diesel passenger vehicles in urban traffic conditions. |
| **Two-Wheeler (Petrol)** | 60 | SIAM (Society of Indian Automobile Manufacturers) | 110cc–150cc four-stroke commuter scooter/motorcycle with single rider. |
| **Auto-Rickshaw (CNG)** | 50 | Shakti Sustainable Energy Foundation | 4-stroke CNG auto-rickshaw with average 2–3 passenger occupancy. |
| **Public City Bus** | 55 | Urban Mass Transit Company (UMTC) | Standard city transit bus operating at ~50% average route occupancy. |
| **Metro Rail** | 28 | Delhi Metro Rail Corporation (DMRC) Clean Development Mechanism (CDM) & CEA | Audited lifecycle operational energy consumption factoring in Central Electricity Authority (CEA) national grid mix (~716 g CO₂/kWh), captive solar power, and regenerative braking. |
| **E-Rickshaw** | 16 | WRI India Electric Mobility Baseline | Zero direct tailpipe emissions; Well-to-Wheel assessment based on Central Electricity Authority (CEA) grid baseline (~716 g CO₂/kWh). |
| **Cycling / Walking** | 0 | IPCC National GHG Inventories | Non-motorized active transport with zero operational fossil combustion emissions. |

### Annual Tree Absorption Equivalent

Based on agroforestry assessments from the Ministry of Environment, Forest and Climate Change (MoEFCC), one mature tropical tree in urban conditions absorbs approximately **20 kg of $\text{CO}_2$ per year**.

$$\text{Annual Tree Equivalent} = \frac{\text{Annual Saved } \text{CO}_2\text{e (kg)}}{20}$$

---

## 4. Impact Separation & Safety Honesty Rules

1. **Emission Reductions $\neq$ Local AQI Changes**:
   Commuter modal shifts reduce personal and collective greenhouse gas footprints. They do not cause instantaneous drops in citywide ambient AQI, which is dictated by synoptic meteorology, regional biomass burning, and thousands of industrial/vehicular sources.
2. **Thermal Inversion Avoidance $\neq$ Biological Dose Elimination**:
   Cold-weather temperature inversion physically traps vehicle exhaust and smoke in the lowest 50–100m of the atmosphere between 6:00 AM and 9:00 AM. Shifting outdoor exposure to 1:00 PM – 4:00 PM leverages solar-driven vertical atmospheric mixing. This is an exposure-avoidance strategy and does not claim medical cure or biological dosage elimination.
