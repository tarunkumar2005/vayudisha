import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

// Crucial: bypass local proxy for loopback testing
process.env.NO_PROXY = 'localhost,127.0.0.1,::1';
process.env.no_proxy = 'localhost,127.0.0.1,::1';

// Locate existing chromium binary in cache
const CHROMIUM_TESTING_PATH =
  '/Users/tarunkumar/Library/Caches/ms-playwright/chromium-1254/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const HEADLESS_SHELL_PATH =
  '/Users/tarunkumar/Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell';

const executablePath = fs.existsSync(CHROMIUM_TESTING_PATH)
  ? CHROMIUM_TESTING_PATH
  : fs.existsSync(HEADLESS_SHELL_PATH)
    ? HEADLESS_SHELL_PATH
    : undefined;

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * SaansSaathi Playwright E2E Test Configuration
 * Tests run against a local Next.js production server on port 3100.
 * Uses mock AQI data (USE_MOCK_AQI=true) so tests are deterministic without external API keys.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  reporter: [['list']],

  use: {
    baseURL: BASE_URL,
    trace: 'off',
    screenshot: 'only-on-failure',
    launchOptions: executablePath
      ? {
          executablePath,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--proxy-bypass-list=<-loopback>',
          ],
        }
      : {},
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: executablePath
          ? {
              executablePath,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--proxy-bypass-list=<-loopback>',
              ],
            }
          : {},
      },
    },
  ],

  webServer: {
    command: `USE_MOCK_AQI=true NO_PROXY=localhost,127.0.0.1,::1 npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 30_000,
    env: {
      USE_MOCK_AQI: 'true',
      GEMINI_API_KEY: '',
      NO_PROXY: 'localhost,127.0.0.1,::1',
      no_proxy: 'localhost,127.0.0.1,::1',
    },
  },
});
