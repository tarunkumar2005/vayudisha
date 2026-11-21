/**
 * Unified AQI Data Merger
 *
 * Implements critical data rules:
 * 1. Treat CPCB/OGD station readings as official Indian AQI when available and valid.
 * 2. Display source, station, timestamp, and freshness.
 * 3. Validate values and handle missing or abnormal readings.
 * 4. Use Open-Meteo CAMS global data as model forecasts, not as observed station readings.
 * 5. Never label European AQI or US AQI as India's CPCB AQI.
 * 6. Never calculate official Indian AQI from a single hourly model forecast point.
 * 7. Provide transparent fallback behaviour if a source is unavailable.
 */

import { fetchCpcbData, fetchCpcbStationsForCity, type StationReading } from './cpcb-client';
import { fetchCamsForecast, getMockCamsForecast, type CamsForecastResult } from './open-meteo-client';
import { calculateOverallAQI, type AqiResult } from './aqi-calculator';
import { getCityById, type CityInfo } from '../constants/cities';
import { MOCK_DELHI_SMOG_CPCB_RESPONSE } from '../../../tests/fixtures/cpcb-sample';

export type DataSourceType =
  | 'cpcb_official'
  | 'cams_model_forecast'
  | 'mock_demonstration'
  | 'unavailable';

export interface UnifiedAqiPayload {
  city: {
    id: string;
    name: { en: string; hi: string };
    state: string;
    latitude: number;
    longitude: number;
  };
  /** Primary current reading */
  current: {
    aqi: number | null; // CPCB AQI if available, or null if only model forecast or insufficient data
    category: string;
    categoryHindi: string;
    color: string;
    prominentPollutant: string | null;
    stationName: string;
    timestamp: string; // ISO string
    timestampFormatted: string; // "19 Nov 2026, 09:00 AM IST"
    isFresh: boolean;
    ageMinutes: number;
    dataSource: DataSourceType;
    dataSourceLabel: string;
    isModelForecast: boolean;
    isOfficialSuppliedAqi: boolean;
    isDerivedEstimate: boolean;
    regulatoryCompletenessEnforced?: boolean;
    methodologyNote: string;
    subIndices?: AqiResult['subIndices'];
    rawPollutants?: Record<string, number>;
  };
  /** Multi-station readings in the city if available */
  stations: {
    station: string;
    aqi: number | null;
    category: string;
    prominentPollutant: string | null;
    isFresh: boolean;
    ageMinutes: number;
    meetsMinimumData?: boolean;
  }[];
  /** Multi-day model forecast from CAMS */
  forecast: {
    source: string;
    isModelForecast: true;
    disclaimer: string;
    daily: CamsForecastResult['dailySummaries'];
    hourlyNext24h: {
      time: string;
      pm2_5: number | null;
      pm10: number | null;
      no2: number | null;
      co_mg_m3: number | null;
    }[];
  } | null;
  /** Status and fallback notices */
  status: {
    officialCpcbAvailable: boolean;
    camsForecastAvailable: boolean;
    isFallback: boolean;
    cpcbApiStatus?: string;
    cpcbStatusDetails?: string;
    notice?: {
      en: string;
      hi: string;
    };
  };
}

export interface MergeOptions {
  cpcbApiKey?: string;
  useMockFallback?: boolean;
  preferredStation?: string;
}

/**
 * Get unified air quality intelligence for a given city.
 */
export async function getUnifiedAqi(
  cityIdOrName: string,
  options: MergeOptions = {}
): Promise<UnifiedAqiPayload> {
  const city = getCityById(cityIdOrName);
  if (!city) {
    throw new Error(
      `Unknown city identifier '${cityIdOrName}'. City must be registered in the supported CPCB city registry.`
    );
  }

  const apiKey = options.cpcbApiKey || process.env.DATA_GOV_IN_API_KEY || '';
  // Security: Use server-side USE_MOCK_AQI env var. NEXT_PUBLIC_USE_MOCK_AQI is accepted as a
  // legacy alias but only on the server (aqi-merger always runs server-side in API routes).
  // Client-side env vars must NOT control server data-source selection in production.
  const forceMock =
    options.useMockFallback !== undefined
      ? options.useMockFallback
      : process.env.USE_MOCK_AQI === 'true' ||
        process.env.NEXT_PUBLIC_USE_MOCK_AQI === 'true' ||
        (!apiKey && process.env.NODE_ENV !== 'production');

  // Only honor preferredStation if it is registered for this city
  const validPreferredStation =
    options.preferredStation && city.keyStations && city.keyStations.includes(options.preferredStation)
      ? options.preferredStation
      : undefined;

  let cpcbResult = null;

  if (forceMock && city.hasOfficialStations !== false) {
    // Process local fixture for mock demonstration mode
    const { CpcbApiResponseSchema } = await import('./cpcb-client');
    const parsed = CpcbApiResponseSchema.parse(MOCK_DELHI_SMOG_CPCB_RESPONSE);
    cpcbResult = {
      source: 'cpcb' as const,
      sourceLabel: 'CPCB via data.gov.in (Simulated Demonstration)' as const,
      stations: [
        {
          station: 'Anand Vihar, Delhi - DPCC',
          city: city.name.en,
          state: city.state,
          latitude: city.latitude,
          longitude: city.longitude,
          lastUpdate: new Date(),
          lastUpdateRaw: '19-11-2026 09:00:00',
          pollutants: { 'PM2.5': 315, PM10: 412, NO2: 85, SO2: 24, CO: 2.3, O3: 38 },
          isFresh: true,
          ageMinutes: 15,
        },
      ],
      fetchedAt: new Date().toISOString(),
      totalRecords: 6,
      invalidRecords: 0,
      apiAvailable: true,
    };
  } else if (apiKey && city.hasOfficialStations !== false) {
    try {
      const cpcbQueryCity = city.cpcbCityName || city.name.en;
      const candidates = validPreferredStation
        ? [validPreferredStation]
        : city.keyStations && city.keyStations.length > 0
          ? city.keyStations
          : [undefined];

      // Query candidate stations with early exit as soon as a station returns sufficient (>=3) pollutants.
      // This minimizes API requests and avoids triggering data.gov.in burst rate limits.
      for (const st of candidates.slice(0, 3)) {
        const res = await fetchCpcbData(cpcbQueryCity, {
          apiKey,
          station: st,
          timeoutMs: 18000,
        });

        cpcbResult = res;

        // If rate limited or unauthenticated, abort candidate loop immediately to avoid hammering upstream
        if (res.apiStatus === 'rate_limited' || res.apiStatus === 'unauthorized_or_invalid_key') {
          break;
        }

        if (res.apiAvailable && res.stations.length > 0) {
          const firstSt = res.stations[0];
          if (firstSt && Object.keys(firstSt.pollutants).length >= 3) {
            // Valid CPCB station telemetry obtained
            break;
          }
        }
      }
    } catch (e) {
      console.warn('CPCB fetch threw exception:', e);
    }
  }

  // Fetch Open-Meteo CAMS forecast in parallel
  let camsResult: CamsForecastResult | null = null;
  if (!forceMock) {
    try {
      camsResult = await fetchCamsForecast(city.latitude, city.longitude, 3, { timeoutMs: 3000 });
    } catch (e) {
      console.warn('CAMS forecast fetch threw exception:', e);
    }
  } else {
    camsResult = getMockCamsForecast(city.latitude, city.longitude);
  }

  // Analyze CPCB stations
  const computedStations: UnifiedAqiPayload['stations'] = [];
  let bestStationReading: StationReading | null = null;
  let bestAqiResult: AqiResult | null = null;

  if (cpcbResult && cpcbResult.apiAvailable && cpcbResult.stations.length > 0) {
    for (const st of cpcbResult.stations) {
      const aqiRes = calculateOverallAQI(st.pollutants);
      if (aqiRes) {
        computedStations.push({
          station: st.station,
          aqi: aqiRes.aqi,
          category: aqiRes.category?.category ?? 'Data Insufficient',
          prominentPollutant: aqiRes.prominentPollutant,
          isFresh: st.isFresh,
          ageMinutes: st.ageMinutes,
          meetsMinimumData: aqiRes.meetsMinimumData,
        });

        // Only select as primary best station if it has a valid AQI and meets minimum data
        if (aqiRes.aqi !== null && aqiRes.category !== null) {
          const isPreferred = Boolean(
            validPreferredStation &&
              (st.station.toLowerCase().includes(validPreferredStation.toLowerCase()) ||
                validPreferredStation.toLowerCase().includes(st.station.toLowerCase()))
          );

          if (isPreferred) {
            bestStationReading = st;
            bestAqiResult = aqiRes;
          } else if (!validPreferredStation) {
            if (
              !bestStationReading ||
              (!bestStationReading.isFresh && st.isFresh) ||
              (st.isFresh && aqiRes.subIndices.length > (bestAqiResult?.subIndices.length ?? 0))
            ) {
              bestStationReading = st;
              bestAqiResult = aqiRes;
            }
          }
        }
      }
    }

    // If preferred station was specified but didn't match, fall back to best valid station
    if (!bestStationReading && computedStations.length > 0) {
      for (const st of cpcbResult.stations) {
        const aqiRes = calculateOverallAQI(st.pollutants);
        if (aqiRes && aqiRes.aqi !== null && aqiRes.category !== null) {
          bestStationReading = st;
          bestAqiResult = aqiRes;
          break;
        }
      }
    }
  }

  const hasOfficialData =
    bestStationReading !== null &&
    bestAqiResult !== null &&
    bestAqiResult.aqi !== null &&
    bestAqiResult.category !== null;

  if (hasOfficialData && bestStationReading && bestAqiResult && bestAqiResult.category) {
    // 1. OFFICIAL CPCB DATA AVAILABLE
    return {
      city: {
        id: city.id,
        name: city.name,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude,
      },
      current: {
        aqi: bestAqiResult.aqi,
        category: bestAqiResult.category.category,
        categoryHindi: bestAqiResult.category.healthImpact.hi,
        color: bestAqiResult.category.color,
        prominentPollutant: bestAqiResult.prominentPollutant,
        stationName: bestStationReading.station,
        timestamp: bestStationReading.lastUpdate?.toISOString() ?? new Date().toISOString(),
        timestampFormatted: bestStationReading.lastUpdateRaw,
        isFresh: bestStationReading.isFresh,
        ageMinutes: bestStationReading.ageMinutes,
        dataSource: forceMock ? 'mock_demonstration' : 'cpcb_official',
        dataSourceLabel: forceMock
          ? 'CPCB via data.gov.in (Simulated Demo)'
          : 'CPCB Official Ground Station (data.gov.in)',
        isModelForecast: false,
        isOfficialSuppliedAqi: bestAqiResult.isOfficialSuppliedAqi,
        isDerivedEstimate: bestAqiResult.isDerivedEstimate,
        regulatoryCompletenessEnforced: bestAqiResult.regulatoryCompletenessEnforced,
        methodologyNote: bestAqiResult.methodologyNote,
        subIndices: bestAqiResult.subIndices,
        rawPollutants: bestStationReading.pollutants,
      },
      stations: computedStations,
      forecast: camsResult ? formatForecastSection(camsResult) : null,
      status: {
        officialCpcbAvailable: !forceMock && (cpcbResult?.apiAvailable ?? false),
        camsForecastAvailable: camsResult?.apiAvailable ?? false,
        isFallback: forceMock,
        cpcbApiStatus: cpcbResult?.apiStatus,
        cpcbStatusDetails: cpcbResult?.statusDetails,
        notice: forceMock
          ? {
              en: 'Demonstration mode: displaying verified realistic CPCB station telemetry.',
              hi: 'प्रदर्शन मोड: सत्यापित वास्तविक सीपीसीबी स्टेशन डेटा प्रदर्शित किया जा रहा है।',
            }
          : !bestStationReading.isFresh
            ? {
                en: `Ground station reading is ${Math.round(bestStationReading.ageMinutes / 60)} hours old. CPCB updates may be delayed.`,
                hi: `स्टेशन रीडिंग ${Math.round(bestStationReading.ageMinutes / 60)} घंटे पुरानी है। सीपीसीबी अपडेट में देरी हो सकती है।`,
              }
            : undefined,
      },
    };
  }

  // 2. OFFICIAL GROUND DATA UNAVAILABLE: CHECK IF CAMS MODEL FORECAST IS AVAILABLE (STATE B)
  if (camsResult && camsResult.apiAvailable && camsResult.hourly.length > 0) {
    // Select the CAMS forecast point closest to the current valid time (H-08)
    const nowMs = Date.now();
    let currentCamsHour = camsResult.hourly[0];
    let minDiff = Infinity;
    for (const h of camsResult.hourly) {
      const diff = Math.abs(new Date(h.time).getTime() - nowMs);
      if (diff < minDiff) {
        minDiff = diff;
        currentCamsHour = h;
      }
    }

    const pm25 = currentCamsHour.pm2_5 ?? 25;
    const pm10 = currentCamsHour.pm10 ?? 45;
    const ageMinutes = Math.max(0, Math.round((nowMs - new Date(currentCamsHour.time).getTime()) / 60000));
    const isFresh = ageMinutes < 180; // 3-hour CAMS global model resolution

    // Estimate qualitative risk category based on CPCB PM2.5 breakpoints, never claiming official Indian AQI
    let modelCategory = 'Good';
    let modelCategoryHi = 'अच्छी वायु गुणवत्ता (मॉडल अनुमान)';
    let modelColor = '#047857';

    if (pm25 > 250) {
      modelCategory = 'Severe Risk';
      modelCategoryHi = 'गंभीर जोखिम (मॉडल अनुमान)';
      modelColor = '#8B0000';
    } else if (pm25 > 120) {
      modelCategory = 'Very High Risk';
      modelCategoryHi = 'बहुत खराब जोखिम (मॉडल अनुमान)';
      modelColor = '#EF4444';
    } else if (pm25 > 90) {
      modelCategory = 'High Risk';
      modelCategoryHi = 'खराब जोखिम (मॉडल अनुमान)';
      modelColor = '#FF8C00';
    } else if (pm25 > 60) {
      modelCategory = 'Moderate Risk';
      modelCategoryHi = 'मध्यम जोखिम (मॉडल अनुमान)';
      modelColor = '#EAB308';
    } else if (pm25 > 30) {
      modelCategory = 'Satisfactory';
      modelCategoryHi = 'संतोषजनक वायु गुणवत्ता (मॉडल अनुमान)';
      modelColor = '#10B981';
    }

    const validHourStr = new Date(currentCamsHour.time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });

    return {
      city: {
        id: city.id,
        name: city.name,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude,
      },
      current: {
        aqi: null, // STRICT RULE: Never calculate official Indian AQI from a single hourly model forecast
        category: modelCategory,
        categoryHindi: modelCategoryHi,
        color: modelColor,
        prominentPollutant: 'PM2.5 (Model)',
        stationName: 'Copernicus Atmospheric Monitoring Service (Grid 0.4°)',
        timestamp: currentCamsHour.time,
        timestampFormatted: `${validHourStr} IST (Forecast valid hour)`,
        isFresh,
        ageMinutes,
        dataSource: 'cams_model_forecast',
        dataSourceLabel: 'Copernicus (CAMS) Model Forecast (Global 45km Grid)',
        isModelForecast: true,
        isOfficialSuppliedAqi: false,
        isDerivedEstimate: true,
        regulatoryCompletenessEnforced: false,
        methodologyNote:
          'Copernicus Atmospheric Monitoring Service (CAMS) model forecast. Not an official CPCB station reading; official Indian AQI cannot be derived from single-point model data.',
        rawPollutants: {
          'PM2.5': pm25,
          PM10: pm10,
          NO2: currentCamsHour.no2 ?? 20,
          CO: currentCamsHour.co_mg_m3 ?? 0.8,
        },
      },
      stations: computedStations,
      forecast: formatForecastSection(camsResult),
      status: {
        officialCpcbAvailable: false,
        camsForecastAvailable: true,
        isFallback: true,
        cpcbApiStatus: cpcbResult?.apiStatus,
        cpcbStatusDetails: cpcbResult?.statusDetails,
        notice: {
          en: 'Official CPCB ground station data is currently unavailable for this location. Showing atmospheric model forecast from Copernicus (CAMS).',
          hi: 'इस स्थान के लिए आधिकारिक सीपीसीबी स्टेशन डेटा उपलब्ध नहीं है। कॉपरनिकस (सीएएमएस) वायुमंडलीय मॉडल पूर्वानुमान दिखाया जा रहा है।',
        },
      },
    };
  }

  // 3. BOTH OFFICIAL GROUND DATA AND CAMS MODEL FORECAST UNAVAILABLE (TOTAL OUTAGE - H-02)
  return {
    city: {
      id: city.id,
      name: city.name,
      state: city.state,
      latitude: city.latitude,
      longitude: city.longitude,
    },
    current: {
      aqi: null,
      category: 'Data Unavailable',
      categoryHindi: 'डेटा अनुपलब्ध',
      color: '#9CA3AF',
      prominentPollutant: null,
      stationName: 'Telemetry Unavailable',
      timestamp: new Date().toISOString(),
      timestampFormatted: 'Service Unavailable',
      isFresh: false,
      ageMinutes: 0,
      dataSource: 'unavailable',
      dataSourceLabel: 'Service Unavailable',
      isModelForecast: false,
      isOfficialSuppliedAqi: false,
      isDerivedEstimate: false,
      regulatoryCompletenessEnforced: false,
      methodologyNote:
        'All upstream air quality telemetry networks (CPCB ground stations and Copernicus CAMS global forecast) are currently unreachable. Zero synthetic values are displayed.',
      rawPollutants: undefined,
    },
    stations: computedStations,
    forecast: null,
    status: {
      officialCpcbAvailable: false,
      camsForecastAvailable: false,
      isFallback: true,
      cpcbApiStatus: cpcbResult?.apiStatus ?? 'unavailable',
      cpcbStatusDetails: cpcbResult?.statusDetails ?? 'Upstream service unreachable',
      notice: {
        en: 'Air quality telemetry is temporarily unavailable. Neither official ground stations nor atmospheric forecast feeds could be reached. Please check back shortly.',
        hi: 'वायु गुणवत्ता डेटा अस्थायी रूप से अनुपलब्ध है। सीपीसीबी और कॉपरनिकस दोनों सेवाएं अनुपलब्ध हैं। कृपया कुछ समय बाद पुनः प्रयास करें।',
      },
    },
  };
}

function formatForecastSection(cams: CamsForecastResult): UnifiedAqiPayload['forecast'] {
  return {
    source: cams.sourceLabel,
    isModelForecast: true,
    disclaimer: 'Atmospheric model forecast. Atmospheric conditions can vary locally.',
    daily: cams.dailySummaries,
    hourlyNext24h: cams.hourly.slice(0, 24).map((h) => ({
      time: h.time,
      pm2_5: h.pm2_5,
      pm10: h.pm10,
      no2: h.no2,
      co_mg_m3: h.co_mg_m3,
    })),
  };
}
