# VayuDisha (वायुदिशा) — Brand Identity & Guidelines

> **"Know your air. Choose a better direction."**  
> **"हवा की समझ, बेहतर कल।"**

---

## 1. Brand Overview & Mission

**VayuDisha** is an intelligent urban air-quality and sustainability companion designed specifically for Indian families, schools, and apartment communities navigating winter smog episodes.

- **English Name**: VayuDisha
- **Devanagari Name**: वायुदिशा
- **Name Etymology**: *Vayu* (वायु – Air, Wind, Breath of Life) + *Disha* (दिशा – Direction, Guidance, Purposeful Choice).
- **Mission**: Transform complex atmospheric and environmental telemetry into honest, actionable, and compassionate daily choices—guiding citizens toward lower pollution exposure and reduced personal emissions.

---

## 2. Brand Personality & Tone of Voice

VayuDisha is:
1. **Scientifically Rigorous**: Never fabricates AQI readings or claims that potted houseplants purify indoor room air. References official CPCB benchmarks and the October 2025 MoHFW/NCDC advisory.
2. **Empathetic & Calm**: Understands the anxiety winter smog creates for parents and elderly caregivers. Never sensationalizes or causes panic; offers clear, realistic steps.
3. **Approachable & Warm**: Inspired by natural environmental intelligence (clean greens, soft creams, warm saffron accents) with generous whitespace and friendly illustrations.
4. **Transparent & Unpretentious**: Clearly differentiates official continuous ground station telemetry (CPCB) from regional atmospheric models (Copernicus CAMS). Never claims government endorsement or uses official national emblems.

---

## 3. Brand Color Palette

The VayuDisha visual identity balances ecological calm with high-contrast scientific legibility:

| Token | Hex | RGB | Purpose |
| :--- | :--- | :--- | :--- |
| **Forest Green (Primary)** | `#174B36` | `rgb(23, 75, 54)` | Primary typography, headers, main brand accents, anchor buttons |
| **Emerald Teal** | `#159C89` | `rgb(21, 156, 137)` | Active links, secondary brand highlights, focus states, Disha arrow |
| **Soft Sage** | `#A7C5A0` | `rgb(167, 197, 160)` | Ambient breeze rings, badges, soft positive indicators |
| **Saffron (Accent)** | `#EBA347` | `rgb(235, 163, 71)` | Disha compass direction pointer, warm highlights, alerts |
| **Warm Cream (Background)** | `#F6F4EB` | `rgb(246, 244, 235)` | Page canvas, soft section containers, input backgrounds |
| **Warm Sand** | `#ECE7D8` | `rgb(236, 231, 216)` | Card dividers, chart gridlines, subtle borders |
| **Card Border** | `#E2DDD1` | `rgb(226, 221, 209)` | Standard border for elevated cards, tabs, and modals |
| **Muted Slate** | `#587668` | `rgb(88, 118, 104)` | Secondary body copy, timestamps, scientific citations |

### Official CPCB Regulatory Palette (Air Quality Only)
To ensure zero public confusion and strict regulatory compliance, AQI severity brackets remain untouched:
- **Good (0–50)**: `#10B981` / `#00B050`
- **Satisfactory (51–100)**: `#84CC16` / `#92D050`
- **Moderate (101–200)**: `#FBBF24` / `#FFD700`
- **Poor (201–300)**: `#F97316` / `#FF8C00`
- **Very Poor (301–400)**: `#EF4444` / `#FF0000`
- **Severe (401–500)**: `#7F1D1D` / `#8B0000`

---

## 4. Logo Assets & Variants

All brand assets are available in resolution-independent SVG format under `public/brand/`:

1. **Brand Mark** (`public/brand/vayudisha-mark.svg`):
   - Minimalist circle symbol combining an upward leaf, dual breeze contours, and an upward saffron directional compass point.
2. **Horizontal Logo** (`public/brand/vayudisha-logo.svg`):
   - Primary mark + Latin wordmark ("Vayu" in Forest Green, "Disha" in Emerald Teal) + Devanagari badge ("वायुदिशा") + uppercase tagline.
3. **Light Background Logo** (`public/brand/vayudisha-logo-light.svg`):
   - Optimized for warm cream (`#F6F4EB`) and pure white (`#FFFFFF`) backgrounds.
4. **Dark Background Logo** (`public/brand/vayudisha-logo-dark.svg`):
   - High-contrast variant with cream typography and teal accents for dark mode and presentation slides.
5. **Stacked Logo** (`public/brand/vayudisha-stacked.svg`):
   - Centered vertical layout for splash screens, mobile drawers, and merchandise.
6. **Monochrome Logo** (`public/brand/vayudisha-monochrome.svg`):
   - Pure black and white silhouette for single-color offset printing, community flyers, and receipts.
7. **Social OpenGraph Banner** (`public/brand/vayudisha-og.svg`):
   - 1200x630 pixel preview card with typography, telemetry badges, and live interface preview.

---

## 5. Mascot: "Vayu" (वायु)

**Vayu** is VayuDisha’s friendly breeze-and-leaf companion. Vayu helps demystify atmospheric science without being intimidating or childish.

### Character Design:
- **Body**: Soft teardrop leaf shape in sage-to-forest gradient (`#A7C5A0` to `#174B36`) with gentle chest shine.
- **Features**: Large expressive eyes, cheerful saffron blush (`#EBA347`), and sprout antennae.
- **Poses** (`src/components/brand/VayuMascot.tsx`):
  1. `greeting`: Friendly waving hand welcoming the user.
  2. `explaining`: Holding a saffron directional pointer to highlight actionable guidance.
  3. `celebrating`: Both hands raised with clean air sparkle stars for sustainable milestones.
  4. `cautious`: Wearing a mini protective mask and holding an AQI badge during severe smog conditions.

---

## 6. Typography & Hierarchy

- **Latin Sans**: Inter / system-ui (`-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`)
  - Headings: `font-black` (weight 900) or `font-extrabold` (weight 800) with tight letter-spacing (`-0.02em`).
  - Body: `font-medium` (weight 500) and `font-normal` (weight 400).
- **Devanagari Sans**: `"Noto Sans Devanagari"`, `"Kohinoor Devanagari"`, `sans-serif`.
  - Ensures clean vowel matra rendering and proper baseline alignment alongside Latin characters.

---

## 7. Brand Prohibitions

1. **NO Government Misrepresentation**: Never use the Lion Capital of Ashoka, the national flag, or official ministry seals. Always maintain the identity of an independent public-interest technology project.
2. **NO Unscientific Health Claims**: Never suggest that indoor plants purify room air, that outdoor afternoon smog is "safe", or that cloth bandanas protect against PM2.5.
3. **NO Blanket Mandates**: Present N95/N99 respirators as conditional for unavoidable outdoor exposure, prioritizing exposure reduction (staying indoors).
4. **NO Data Deception**: Always label model forecasts (Copernicus CAMS) distinctly from verified ground CAAQMS station telemetry (CPCB).
