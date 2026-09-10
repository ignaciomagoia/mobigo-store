import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5174', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run dev -- --port 5174 --strictPort`,
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: false,
    // Valores ficticios exclusivos de pruebas. Todas las respuestas se interceptan.
    env: {
      VITE_SUPABASE_URL: 'https://mobigo-test.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'test-only-not-a-real-key',
      VITE_SUPABASE_ANON_KEY: 'test-only-not-a-real-key',
      VITE_WHATSAPP_NUMBER: '',
      VITE_INSTAGRAM_USERNAME: '',
    },
  },
});
