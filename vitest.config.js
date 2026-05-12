import { defineVitestConfig } from '@nuxt/test-utils/config'
import { extname } from 'path'

// Vite plugin to resolve extensionless relative imports inside the Prisma generated
// client before Nuxt's nuxt:resolve-bare-imports (enforce:'post') runs.
// That plugin calls pathe.normalize('./enums') which strips './' → 'enums', then
// tries to resolve it as a bare package specifier, fails, and falls through to
// this.environment.name — a Vite 6 API absent in Vitest's bundled Vite 5 —
// producing a plain-object throw that tinypool serialises as "[object Object]".
const fixPrismaExtensionlessImports = {
  name: 'fix-prisma-extensionless-imports',
  enforce: 'pre',
  async resolveId(id, importer) {
    if (
      importer &&
      importer.includes('prisma-chatbot-db/generated') &&
      (id.startsWith('./') || id.startsWith('../')) &&
      extname(id) === ''
    ) {
      return this.resolve(id + '.ts', importer, { skipSelf: true })
    }
  },
}

// https://vitejs.dev/config/
export default defineVitestConfig({
  plugins: [fixPrismaExtensionlessImports],
  root: './',
  resolve: {
    dedupe: ['prosemirror-state'],
  },
  test: {
    server: {
      deps: {
        // Force all @tiptap packages through Vite's ESM bundler so they share
        // a single prosemirror-state instance. Without this, the CJS extension
        // packages and the ESM @tiptap/core each load their own copy, both
        // generating 'plugin$' as their first auto-keyed plugin → conflict.
        inline: [/@tiptap/, /prosemirror/],
      },
    },
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    environment: 'nuxt',
    hookTimeout: 30_000,
    setupFiles: [
      './.vitest/setup.ts',
      './.vitest/setupVitest.js',
      './.vitest/setEnvVars.js',
      // './.vitest/register-context.ts',
      './.vitest/mockApiCookie.ts',
      './.vitest/mockOauth.ts',
      './.vitest/mockMixpanel.ts',
      './.vitest/mockPatatoids.ts',
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
              appMixpanelApiUrl: '',
              appMixpanelProjectToken: '',
              appPublicBinariesPrefix: 'http://localhost:8080',
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
              appDoc: 'http://localhost:8080/',
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
})
