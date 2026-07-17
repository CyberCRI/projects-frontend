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
    dedupe: [
      'prosemirror-state',
      'prosemirror-model',
      'prosemirror-view',
      'prosemirror-transform',

      '@tiptap/core',
      '@tiptap/extension-blockquote',
      '@tiptap/extension-bold',
      '@tiptap/extension-bullet-list',
      '@tiptap/extension-code-block',
      '@tiptap/extension-code-block-lowlight',
      '@tiptap/extension-collaboration',
      '@tiptap/extension-collaboration-cursor',
      '@tiptap/extension-color',
      '@tiptap/extension-heading',
      '@tiptap/extension-image',
      '@tiptap/extension-italic',
      '@tiptap/extension-link',
      '@tiptap/extension-list-item',
      '@tiptap/extension-ordered-list',
      '@tiptap/extension-table',
      '@tiptap/extension-table-cell',
      '@tiptap/extension-table-header',
      '@tiptap/extension-table-row',
      '@tiptap/extension-text-align',
      '@tiptap/extension-text-style',
      '@tiptap/extension-underline',
      '@tiptap/html',
      '@tiptap/pm',
      '@tiptap/starter-kit',
      '@tiptap/vue-3',
    ],
  },
  test: {
    onConsoleLog: (msg) => {
      // ignore some logs (i18n/suspense)
      const IGNORED_LOG = [
        `[Vue warn]: App already provides property with key "Symbol(pinia)". It will be overwritten with the new value.`,
        `[Vue warn]: Component "i18n-t" has already been registered in target app.`,
        `[Vue warn]: Component "I18nT" has already been registered in target app.`,
        `[Vue warn]: Component "i18n-n" has already been registered in target app.`,
        `[Vue warn]: Component "I18nN" has already been registered in target app.`,
        `[Vue warn]: Component "i18n-d" has already been registered in target app.`,
        `[Vue warn]: Component "I18nD" has already been registered in target app.`,
        `[Vue warn]: Directive "t" has already been registered in target app.`,
        `<Suspense> is an experimental feature and its API will likely change.`,
      ]
      return !IGNORED_LOG.includes(msg.trim())
    },
    server: {
      deps: {
        // Force all @tiptap packages through Vite's ESM bundler so they share
        // a single prosemirror-state instance. Without this, the CJS extension
        // packages and the ESM @tiptap/core each load their own copy, both
        // generating 'plugin$' as their first auto-keyed plugin → conflict.
        inline: [/@tiptap/, /prosemirror/, /yjs/, /y-js/, 'vue3-popper'],
      },
    },
    include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    environment: 'nuxt',
    hookTimeout: 30_000,
    setupFiles: [
      './tests/setup/setup.ts',
      './tests/setup/setEnvVars.ts',
      './tests/setup/mockMixpanel.ts',
      './tests/setup/mockApi.ts',
      './tests/setup/mockOauth.ts',
      './tests/setup/mockPatatoids.ts',
    ],
    environmentOptions: {
      nuxt: {
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
