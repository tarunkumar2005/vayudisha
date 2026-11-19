import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'SaansSaathi (साँस साथी) — Urban Air Quality Assistant',
  description:
    'AI-powered urban air quality companion for Indian families and communities navigating severe winter smog. Low-emission routines, indoor air solutions, and sustainable travel tailored to location and lifestyle.',
  keywords: [
    'AQI India',
    'CPCB',
    'Air Pollution',
    'Delhi Smog',
    'N95 Mask',
    'Air Purifier',
    'PromptWars',
    'Gemini API',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>
          <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="font-bold text-slate-700">
                  SaansSaathi (साँस साथी) — PromptWars Challenge 06
                </span>
                <span>
                  Official CPCB Ground Station & Copernicus (CAMS) Model Data
                </span>
              </div>
              <p className="max-w-3xl leading-relaxed text-slate-400">
                Public health & environmental guidance based on official Central Pollution Control Board (CPCB) benchmarks. Not a medical diagnostic device. Consult a physician for acute respiratory distress.
              </p>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
