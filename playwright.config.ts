import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './specs',
    testMatch: '**/*.test.ts',
    timeout: 30_000,
    retries: 1,
    reporter: [['list'], ['html', { open: 'never', outputFolder: '.playwright-mcp/report' }]],
    use: {
        baseURL: 'http://localhost:5173',
        screenshot: 'only-on-failure',
        video: 'off',
        trace: 'off',
    },
    projects: [
        {
            name: 'chromium-mobile',
            use: {
                browserName: 'chromium',
                viewport: { width: 390, height: 844 },
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
            },
        },
    ],
    // Dev server is expected to be running already
    webServer: {
        command: 'yarn dev',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 30_000,
    },
})
