import * as Sentry from '@sentry/vue'
import router from '@/router'

export default async function initSentry(app) {
    const SENTRY_ENABLED = import.meta.env.VITE_APP_SENTRY_ENABLED
    if (SENTRY_ENABLED) {
        Sentry.init({
            app,
            dsn: import.meta.env.VITE_APP_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration({ router }),
                Sentry.replayIntegration(),
            ],
            environment: import.meta.env.VITE_APP_ENVIRONMENT,
            tracePropagationTargets: ['localhost', import.meta.env.VITE_APP_API_URL],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for tracing.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,

            // Capture Replay for 10% of all sessions,
            // plus for 100% of sessions with an error
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            release: import.meta.env.VITE_APP_SENTRY_RELEASE,
        })
    }
}
