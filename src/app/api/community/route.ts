import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';

export const dynamic = 'force-dynamic';

const CommunityRequestSchema = z.object({
  cityName: z.string().default('delhi'),
  communityName: z.string().max(80).default('Resident Welfare Association'),
  language: z.enum(['en', 'hi']).default('en'),
});

const COMMUNITY_ACTIONS = [
  {
    id: 'ban_leaf_burning',
    category: 'waste_management',
    costTier: 'free',
    timeframe: 'immediate',
    title: {
      en: 'Strict Ban on Leaf, Garbage & Garden Waste Burning',
      hi: 'पत्तियों और कचरे को जलाने पर पूर्ण प्रतिबंध',
    },
    description: {
      en: 'Open burning in residential pockets causes dangerous localized PM2.5 spikes up to 800+ µg/m³. Set up a compost pit for fallen leaves instead.',
      hi: 'सोसायटी परिसर में पत्तियां जलाने से स्थानीय स्तर पर धुआं खतरनाक रूप से बढ़ जाता है। पत्तियों के लिए कम्पोस्ट गड्ढा बनाएं।',
    },
    enforcementNotice: 'Subject to National Green Tribunal (NGT) penalty under environmental protection laws.',
  },
  {
    id: 'guard_electric_heaters',
    category: 'welfare_infrastructure',
    costTier: 'low',
    timeframe: '1_week',
    title: {
      en: 'Provide Electric Heaters & Warm Gear for Night Security Staff',
      hi: 'सुरक्षा गार्डों के लिए इलेक्ट्रिक हीटर और गर्म कपड़े',
    },
    description: {
      en: 'Night guards frequently burn twigs, plastics, and coal to stay warm, breathing toxic smoke directly. Society-provided electric blowers eliminate this health hazard.',
      hi: 'रात के गार्ड ठंड से बचने के लिए लकड़ी या कोयला जलाते हैं। उन्हें इलेक्ट्रिक हीटर देने से इस हानिकारक धुएं से बचा जा सकता है।',
    },
    enforcementNotice: 'Direct social protection and clean air intervention.',
  },
  {
    id: 'dust_water_sprinkling',
    category: 'dust_control',
    costTier: 'low',
    timeframe: 'immediate',
    title: {
      en: 'Water Sprinkling on Unpaved Lanes & Construction Covers',
      hi: 'कच्चे रास्तों पर पानी का छिड़काव और निर्माण सामग्री को ढकना',
    },
    description: {
      en: 'Fine road dust and sand resuspension accounts for up to 30% of winter PM10. Sprinkling treated or recycled water twice daily settles particulate matter.',
      hi: 'सर्दियों में उड़ने वाली धूल PM10 का मुख्य कारण है। रास्तों पर पानी छिड़कने से यह धूल हवा में नहीं उड़ती।',
    },
    enforcementNotice: 'Follows CPCB Graded Response Action Plan (GRAP) guidelines.',
  },
  {
    id: 'school_carpooling_network',
    category: 'mobility',
    costTier: 'free',
    timeframe: '1_week',
    title: {
      en: 'Organize Society School-Run & Commuter Carpooling',
      hi: 'स्कूल और दफ्तर के लिए कारपूलिंग और साझा बस',
    },
    description: {
      en: 'Grouping 4 children into one pooled vehicle eliminates 3 idling cars queuing outside school gates during toxic morning smog hours.',
      hi: 'एक ही स्कूल जाने वाले बच्चों के लिए कारपूल करने से सुबह के समय गाड़ियों की कतार और धुआं दोनों कम होते हैं।',
    },
    enforcementNotice: 'Community voluntary initiative.',
  },
  {
    id: 'staff_mask_distribution',
    category: 'health_equity',
    costTier: 'medium',
    timeframe: 'immediate',
    title: {
      en: 'Equip Sanitation, Gardening & Maintenance Workers with N95 Masks',
      hi: 'सफाई कर्मचारियों और मालियों को N95 मास्क उपलब्ध कराना',
    },
    description: {
      en: 'Outdoor workers sustain 8+ hours of continuous smog and dust exposure daily. The society clean-air fund should supply certified N95 masks.',
      hi: 'बाहर काम करने वाले कर्मचारी पूरे दिन धुएं और धूल के संपर्क में रहते हैं। सोसायटी की ओर से उन्हें N95 मास्क दिए जाएं।',
    },
    enforcementNotice: 'Occupational health protection recommended by MoHFW.',
  },
];

// Community plan: 30 req/min per IP
const RATE_LIMIT = { limit: 30, windowMs: 60_000 };
const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB payload cap

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large. Maximum allowed size is 32 KB.' },
      { status: 413, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const clientKey = `community:${getClientKey(request)}`;
  const rl = checkRateLimit(clientKey, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)), 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const body = await request.json();
    const parsed = CommunityRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { cityName, communityName, language } = parsed.data;
    const aqiData = await getUnifiedAqi(cityName);

    const isHindi = language === 'hi';

    const actions = COMMUNITY_ACTIONS.map((a) => ({
      id: a.id,
      category: a.category,
      costTier: a.costTier,
      timeframe: a.timeframe,
      title: isHindi ? a.title.hi : a.title.en,
      description: isHindi ? a.description.hi : a.description.en,
      enforcementNotice: a.enforcementNotice,
    }));

    return NextResponse.json({
      success: true,
      planMetadata: {
        communityName,
        cityName: aqiData.city.name.en,
        cityNameHindi: aqiData.city.name.hi,
        currentAqi: aqiData.current.aqi,
        aqiCategory: aqiData.current.category,
        color: aqiData.current.color,
        generatedDate: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        isShareable: true,
        hasNoPii: true,
      },
      quickWins: isHindi
        ? [
            'पत्तियां और कूड़ा जलाने पर तत्काल रोक',
            'गार्डों को कोयले की जगह इलेक्ट्रिक हीटर देना',
            'सफाई कर्मचारियों को N95 मास्क वितरित करना',
          ]
        : [
            'Zero tolerance on open biomass and leaf burning',
            'Provide electric heaters to night guards to eliminate smoky fires',
            'Distribute N95 respirators to outdoor maintenance and sanitation staff',
          ],
      actions,
      disclaimer: isHindi
        ? 'यह सामुदायिक कार्ययोजना सीपीसीबी और एनजीटी के नियमों पर आधारित है। इसे अपनी सोसायटी के नोटिस बोर्ड पर साझा किया जा सकता है।'
        : 'This community clean-air action plan references CPCB Graded Response Action Plan (GRAP) and NGT guidelines. Printable and shareable without personal data.',
    });
  } catch (error) {
    console.error('Community plan error:', error);
    return NextResponse.json(
      { error: 'Failed to generate community action plan. Please try again shortly.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
