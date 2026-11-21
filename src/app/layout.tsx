import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';

export const metadata: Metadata = {
  metadataBase: new URL('https://vayudisha.in'),
  title: 'VayuDisha (वायुदिशा) — Urban Air Quality & Sustainability Assistant',
  description:
    'Know your air. Choose a better direction. VayuDisha is an intelligent air-quality and sustainability assistant helping Indian families understand local air conditions, reduce pollution exposure, and adopt sustainable lifestyles.',
  keywords: [
    'VayuDisha',
    'AQI India',
    'CPCB',
    'Air Pollution',
    'Delhi Smog',
    'N95 Mask',
    'Air Purifier',
    'PromptWars',
    'Gemini API',
    'MoHFW Guidelines',
  ],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'VayuDisha (वायुदिशा) — Know your air. Choose a better direction.',
    description:
      'Intelligent air-quality and sustainability assistant for Indian cities. CPCB ground telemetry, atmospheric forecasts, safe indoor filtration, and community action.',
    url: 'https://vayudisha.in',
    siteName: 'VayuDisha',
    images: [
      {
        url: '/brand/vayudisha-og.svg',
        width: 1200,
        height: 630,
        alt: 'VayuDisha Urban Air Intelligence',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VayuDisha — Urban Air Quality & Sustainability Assistant',
    description: 'Know your air. Choose a better direction.',
    images: ['/brand/vayudisha-og.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F6F4EB] text-[#174B36] min-h-screen flex flex-col font-sans antialiased selection:bg-[#159C89]/20 selection:text-[#174B36]">
        <AppProvider>
          {/* Skip to main content — WCAG 2.4.1 (A) */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#174B36] focus:text-[#F6F4EB] focus:rounded-xl focus:font-bold focus:text-sm focus:shadow-lg focus:outline-none"
          >
            Skip to main content
          </a>
          <Navbar />
          <main
            id="main-content"
            className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
          >
            {children}
          </main>
          <footer className="bg-white border-t border-[#E2DDD1] mt-16 py-12 text-xs text-[#2D4A3E]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-[#174B36] tracking-tight">
                      Vayu<span className="text-[#0F766E]">Disha</span>
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#174B36]/10 text-[#174B36]">
                      वायुदिशा
                    </span>
                  </div>
                  <p className="text-xs text-[#2D4A3E] mt-1 font-medium">
                    Know your air. Choose a better direction. · हवा की समझ, बेहतर कल।
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#174B36]">
                  <Link href="/" className="hover:text-[#0F766E] transition-colors">Air Quality</Link>
                  <Link href="/planner" className="hover:text-[#0F766E] transition-colors">Family Routine</Link>
                  <Link href="/impact" className="hover:text-[#0F766E] transition-colors">Travel &amp; Impact</Link>
                  <Link href="/community" className="hover:text-[#0F766E] transition-colors">Community Plan</Link>
                </div>
              </div>

              <div className="border-t border-[#E2DDD1]/70 pt-6 flex flex-col md:flex-row justify-between gap-4">
                <p className="max-w-2xl leading-relaxed text-[#2D4A3E]">
                  Public health &amp; environmental guidance based on official Central Pollution Control Board (CPCB) methodology and the Ministry of Health and Family Welfare (MoHFW/NCDC) October 2025 advisory. Not a medical diagnostic device. Consult a qualified physician for acute respiratory distress.
                </p>
                <div className="text-right text-[#2D4A3E] shrink-0 font-medium">
                  <div>Official CPCB &amp; Copernicus (CAMS) Telemetry</div>
                  <div className="text-[11px] text-[#2D4A3E] font-bold">PromptWars AI Code Submission</div>
                </div>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
