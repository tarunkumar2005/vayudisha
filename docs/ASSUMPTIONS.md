# SaansSaathi — Methodological Assumptions & Citations

This document details the scientific, regulatory, and mathematical foundations utilized in **SaansSaathi** for air quality index derivation, personal exposure mitigation, and transport greenhouse gas (GHG) calculations.

---

## 1. National Air Quality Index (AQI) Calculation

India's National Air Quality Index was established by the **Central Pollution Control Board (CPCB)** in October 2014 in collaboration with IIT Kanpur.

### Sub-Index Interpolation Formula

The sub-index ($I_p$) for a measured pollutant concentration ($C_p$) is calculated using piecewise linear interpolation:

$$I_p = \frac{I_{\text{HI}} - I_{\text{LO}}}{B_{\text{HI}} - B_{\text{LO}}} \times (C_p - B_{\text{LO}}) + I_{\text{LO}}$$

Where:
* $C_p$: Measured pollutant concentration averaged over its regulatory window (24 hours for PM2.5, PM10, NO2, SO2, NH3, Pb; 8 hours for CO and O3).
* $B_{\text{HI}}, B_{\text{LO}}$: Upper and lower concentration breakpoints for the corresponding category bracket.
* $I_{\text{HI}}, I_{\text{LO}}$: Upper and lower AQI bounds for the corresponding category bracket.

### Overall Aggregation & Minimum Data Rule

$$\text{Overall AQI} = \max(I_{\text{PM}2.5}, I_{\text{PM}10}, I_{\text{NO}2}, I_{\text{SO}2}, I_{\text{CO}}, I_{\text{O}3}, I_{\text{NH}3}, I_{\text{Pb}})$$

* **Minimum Requirement**: According to CPCB norms, an overall index is calculated **only if** at least **3 pollutants** are monitored, with **at least one** being a particulate pollutant ($\text{PM}_{2.5}$ or $\text{PM}_{10}$).
* The pollutant yielding the highest sub-index is designated as the **Prominent Pollutant**.

---

## 2. Transport CO₂e Emission Factors

Transport carbon calculations are evaluated per passenger-kilometer ($\text{g CO}_2\text{e} / \text{passenger-km}$) to account for real-world Indian vehicle fleet occupancy.

| Mode | Factor ($\text{g CO}_2\text{e} / \text{pkm}$) | Primary Source | Documented Assumptions |
|---|:---:|---|---|
| **Personal Car (Petrol)** | 150 | India GHG Program / Shakti Foundation | Indian compact/sedan fleet average; urban stop-and-go driving; 1.5 average passenger occupancy. |
| **Personal Car (Diesel)** | 130 | India GHG Program Transport Guidance | Compact diesel passenger vehicles in urban traffic conditions. |
| **Two-Wheeler (Petrol)** | 60 | SIAM (Society of Indian Automobile Manufacturers) | 110cc–150cc four-stroke commuter scooter/motorcycle with single rider. |
| **Auto-Rickshaw (CNG)** | 50 | Shakti Sustainable Energy Foundation | 4-stroke CNG auto-rickshaw with average 2–3 passenger occupancy. |
| **Public City Bus** | 55 | Urban Mass Transit Company (UMTC) | Standard city transit bus operating at ~50% average route occupancy. |
| **Metro Rail** | 28 | Delhi Metro Rail Corporation (DMRC) Clean Development Mechanism (CDM) | Audited lifecycle traction power consumption including captive solar power & regenerative braking. |
| **E-Rickshaw** | 16 | WRI India Electric Mobility Baseline | Zero tailpipe emissions; Well-to-Wheel estimate based on India's national grid carbon intensity (~700 g CO₂/kWh). |
| **Cycling / Walking** | 0 | IPCC National GHG Inventories | Non-motorized active transport with zero operational fossil combustion emissions. |

### Annual Tree Absorption Equivalent

Based on agroforestry assessments from the Ministry of Environment, Forest and Climate Change (MoEFCC), one mature tropical tree in urban conditions absorbs approximately **20 kg of $\text{CO}_2$ per year**.

$$\text{Annual Tree Equivalent} = \frac{\text{Annual Saved } \text{CO}_2\text{e (kg)}}{20}$$

---

## 3. Impact Separation & Safety Honesty Rules

1. **Emission Reductions $\neq$ Local AQI Changes**:
   Commuter modal shifts reduce personal and collective greenhouse gas footprints. They do not claim to cause instantaneous drops in citywide ambient AQI, which is dictated by synoptic meteorology, regional biomass burning, and thousands of industrial/vehicular sources.
2. **Thermal Inversion Avoidance $\neq$ Biological Dose Elimination**:
   Cold-weather temperature inversion physically traps vehicle exhaust and smoke in the lowest 50–100m of the atmosphere between 6:00 AM and 9:00 AM. Shifting outdoor exposure to 1:00 PM – 4:00 PM leverages solar-driven vertical atmospheric mixing. This is an exposure-avoidance strategy and does not claim medical cure or biological dosage elimination.
