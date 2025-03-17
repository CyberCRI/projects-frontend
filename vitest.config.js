import { defineVitestConfig } from '@nuxt/test-utils/config'

import vue from '@vitejs/plugin-vue'
import path from 'path'
import { alias } from './alias'

// https://vitejs.dev/config/
export default defineVitestConfig({
  plugins: [],
  test: {
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    environment: 'nuxt',
    setupFiles: [
      './.vitest/setup.ts',
      './.vitest/setupVitest.js',
      './.vitest/setEnvVars.js',
      // './.vitest/register-context.ts',
      './.vitest/mockApiCookie.ts',
      './.vitest/mockOauth.ts',
      './.vitest/mockUseAPI.ts',
      './.vitest/mockMixpanel.ts',
    ],
    environmentOptions: {
      nuxt: {
        // rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
        domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
        overrides: {
          // other Nuxt config you want to pass
          runtimeConfig: {
            public: {
              appVersion: '',
              appApiOrgCode: '',
              appCaptchaKey: '',
              appMixpanelApiHost: '',
              appMixpanelProjectToken: '',
              appPublicBinariesPrefix: '',
              appMaxSizeFile: 5_000_000,
              appProfileExempleResearcherSlugOrId: '',
              appProfileExempleProfessionalSlugOrId: '',
              appProfileExempleStudentSlugOrId: '',
              appKeycloakUrl: 'http://localhost:8080/auth',
              appKeycloakClientId: '12346',
              appKeycloakClientSecret: 'abcd',
              appKeycloakRealm: 'foobar',
              appApiUrl: '',
              appApiDefaultVersion: '',
              appMetaPortalUrl: '',
              appWssHost: 'http://localhost:8080/',
              appEnvironment: '',
              appDoc: '',
              appI18nFallbackLocale: '',
              appI18nLocale: 'en',
              appShowDebug: 0,
              appDisconnectionGraceDuration: 0,
            },
          },
        },
      },
    },
  },
  resolve: {
    alias,
  },
})
