import * as dotenv from 'dotenv'
import path from 'node:path'
import fs from 'node:fs'

// Determine the environment file
const customEnvFile = process.env.ENV_FILE ? `.env.${process.env.ENV_FILE}` : '.env'

// not load env when we are in tests
if (fs.existsSync(customEnvFile) && import.meta.env.VITEST !== 'true') {
  console.log(`Overriding environment variables with: ${customEnvFile}`)
  dotenv.config({ path: customEnvFile, override: true })
}

// const apiProxy = {
//     '^/v[0-9]+/': {
//         target: `${process.env.NUXT_PUBLIC_APP_API_URL}`,
//         changeOrigin: true,
//         secure: false, // required because local frontend is served over non secure http
//         withCredentials: true,
//     },
// }
// https://nuxt.com/docs/api/configuration/nuxt-config

// const binPrefix = process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX
// console.log(binPrefix)

const directoryPath = path.join(__dirname, '/src/i18n/locales')
let ALL_LOCALES: any = []
try {
  const files = fs.readdirSync(directoryPath)
  ALL_LOCALES = files.reduce((acc, file) => {
    const code = file.replace(/\.json$/, '')
    acc.push({ code, file: file })
    return acc
  }, [])
} catch (err) {
  console.error('Error listing tranlation files :', err)
}

// console.log(ALL_LOCALES)

export default defineNuxtConfig({
  ssr: true,
  // compatibilityDate: '2024-11-01',
  devtools: {
    enabled: import.meta.dev,

    timeline: {
      enabled: true,
    },
  },
  srcDir: 'src/',
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/test-utils/module', 'nuxt-svgo', '@nuxt/eslint'],
  // disable caching
  routeRules: {
    '/**': {
      cache: false,
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  },
  plugins: [
    '~/directives/index.ts',
    '~/plugins/appInit.ts',
    '~/plugins/errorHandler.ts',
    '~/plugins/router-before-each.client.ts',
    '~/plugins/router-after-each.client.ts',
    '~/plugins/lang-switch.ts',
  ],
  css: ['@/design/scss/reset.scss', '@/design/scss/main.scss'],
  imports: {
    autoImport: true, //false,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  vue: {
    compilerOptions: {
      // treat all tags with a dash as custom elements
      // isCustomElement: (tag) => tag.includes('-')
      isCustomElement: (tag) => ['deep-chat'].includes(tag),
    },
  },
  vite: {
    plugins: [
      {
        // Vitest 2.x bundles Vite 5 internally. Nuxt 3.19+ uses this.environment.name
        // (Vite 6 Environment API) in nuxt:resolve-bare-imports (enforce:'post').
        // When this.environment is undefined (Vite 5 context), that plugin throws a
        // plain object that tinypool serialises as "[object Object]" → "Unknown Error".
        // Intercept optional-peer-dep virtual IDs before Nuxt's post-plugin runs so the
        // crash is never reached. Safe in production: Vite 6 has this.environment, and
        // optional deps that are missing should produce empty modules anyway.
        name: 'fix-vite5-optional-peer-dep',
        enforce: 'pre' as const,
        resolveId(id: string) {
          if (id.startsWith('__vite-optional-peer-dep:')) return '\0' + id
        },
        load(id: string) {
          if (id.startsWith('\0__vite-optional-peer-dep:')) return ''
        },
      },
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      // Force all prosemirror packages to resolve to a single instance.
      // prosemirror-dropcursor and prosemirror-gapcursor ship their own nested
      // prosemirror-state (v1.4.4) with an independent key counter, while the
      // rest of the app uses the top-level v1.4.3. Both create keyless plugins
      // (new Plugin({})) that each get key "plugin$1" from their counter — a
      // collision that causes "Adding different instances of a keyed plugin".
      alias: {
        'prosemirror-state': path.resolve('./node_modules/prosemirror-state'),
        'prosemirror-view': path.resolve('./node_modules/prosemirror-view'),
        'prosemirror-model': path.resolve('./node_modules/prosemirror-model'),
        'prosemirror-transform': path.resolve('./node_modules/prosemirror-transform'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
                        @use 'sass:math';
                        @import '@/design/scss/variables.scss';
                        $PUBLIC_BINARIES_PREFIX: '/public-assets';
                    `,
        },
      },
    },

    server: {
      //host: '0.0.0.0',
      //port: 8080,
      // proxy: {
      //     ...apiProxy,
      // },
      watch: {
        usePolling: true,
      },
      hmr: {
        port: 3010,
      },
    },
  },
  devServer: {
    port: 8080,
  },

  runtimeConfig: {
    appGeocodingApiKey: '',
    appOpenaiApiKey: '',
    appOpenaiApiPromptId: '',
    appOpenaiApiPromptVersion: '',
    appOpenaiApiVectorStoreId: '',
    appMcpServerUrl: '',
    appSorbobotApiToken: '',
    appMcpServerTrace: 0,
    appLangchainTrace: 0,
    appSorbobotApiTrace: 0,
    appGotenbergServerUrl: '',
    appLangchainPrompt: '',
    appLangchainModelName: '',
    appLangchainModelApiKey: '',
    appLangchainTemperature: '',
    appVectorDbUrl: '',
    appVectorEmbeddingApiKey: '',
    appVectorExtensionSchema: '',
    appVectorTableName: '',
    appVectorEmbeddingModel: '',
    appVectorEmbeddingDimensions: '',
    appVectorToolPrompt: '',
    appChatbotPromptDb: '',
    public: {
      appVersion: '',
      appApiOrgCode: '',
      appFavicon: '',
      appCaptchaKey: '',
      appMixpanelApiUrl: '',
      appMixpanelProjectToken: '',
      appPublicBinariesPrefix: '',
      appMaxSizeFile: 5_000_000,
      appProfileExempleResearcherSlugOrId: '',
      appProfileExempleProfessionalSlugOrId: '',
      appProfileExempleStudentSlugOrId: '',
      appKeycloakUrl: '',
      appKeycloakClientId: '',
      appKeycloakClientSecret: '',
      appKeycloakRealm: '',
      appApiUrl: '',
      appApiDefaultVersion: '',
      appMetaPortalUrl: '',
      appWssHost: '',
      appEnvironment: '',
      appDoc: '',
      appI18nFallbackLocale: '',
      appI18nLocale: '',
      appShowDebug: 0,
      appDisconnectionGraceDuration: 0,
      allLocales: ALL_LOCALES.map((l) => l.code),
      appGeocodingApiUrl: '',
      appChatbotEnabled: 0,
      appChatbotWithoutStream: 0,
      appChatbotBackend: '',
      appChatbotExemples: '',
      appSorbobotApiUrl: '',
      appGotenbergEnabled: '',
      appHasVectorDb: 0,
      appHasChatbotPromptDb: 0,
    },
  },
  i18n: {
    locales: ALL_LOCALES,
    defaultLocale: 'en',
    restructureDir: './src/i18n',
    // detectBrowserLanguage: {
    //   useCookie: true,
    //   cookieKey: 'i18n_redirected',
    //   alwaysRedirect: true,
    // },
  },

  nitro: {
    minify: import.meta.dev,
  },

  app: {
    head: {
      title: 'Projects',
      charset: 'urf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      // link: [
      //   {
      //     rel: 'icon',
      //     href: `${binPrefix}/favicon.ico`,
      //   },
      // ],
      meta: [
        {
          name: 'description',
          content: 'Projects is a platform to document and promote projects for common good',
        },

        // Open Graph

        {
          property: 'og:title',
          content: 'Share your projects to increase impact',
        },

        {
          property: 'og:type',
          content: 'website',
        },

        {
          property: 'og:description',
          content: 'Projects is a platform to document and promote projects for common good',
        },

        // {
        //   // TODO change to frontend url
        //   name: 'og:url',
        //   content: process.env.NUXT_PUBLIC_APP_API_URL,
        // },

        // {
        //   name: 'og:image',
        //   content: `${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}/social/meta_background_og.png`,
        // },

        // Twitter

        {
          name: 'twitter:title',
          content: 'Share your projects to increase impact',
        },

        {
          name: 'twitter:description',
          content: 'Projects is a platform to document and promote projects for common good',
        },

        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },

        // {
        //   name: 'twitter:image',
        //   content: `${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}/social/meta_background_twt.png`,
        // },
      ],
    },
  },
})
