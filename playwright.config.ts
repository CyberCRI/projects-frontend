import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

dotenv.config()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    /* Maximum time the whole test suite can run for. */
    globalTimeout: 45 * 60 * 1000,
    testDir: './tests/playwright',
    /* Maximum time one test can run for. */
    timeout: 15 * 60 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 45 * 1000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: 1,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 45 * 1000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.FRONTEND_URL,
        permissions: ['clipboard-read', 'clipboard-write'],
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: process.env.CI ? 'on' : 'on-first-retry',
        video: process.env.CI ? 'on' : 'off',
    },

    /* Configure projects for major browsers */
    projects: [
        // {
        //     name: 'chromium',
        //     use: { ...devices['Desktop Chrome'] },
        // },
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //     name: 'mobilechrome',
        //     use: { ...devices['Pixel 5'] },
        // },
        // {
        //     name: 'mobilesafari',
        //     use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //     name: 'edge',
        //     use: { channel: 'msedge' },
        // },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },

        },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
})
