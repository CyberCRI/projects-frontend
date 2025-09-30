import { alias } from './alias'
import fs from 'node:fs'
import path from 'node:path'
import * as dotenv from 'dotenv'

// Determine the environment file
const customEnvFile = process.env.ENV_FILE ? `.env.${process.env.ENV_FILE}` : '.env'

if (fs.existsSync(customEnvFile)) {
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
    acc.push({ code, /*name: 'English',*/ file: file })
    return acc
  }, [])
} catch (err) {
  console.error('Error listing tranlation files :', err)
}

// console.log(ALL_LOCALES)

export default defineNuxtConfig({
  // ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: import.meta.dev,

    timeline: {
      enabled: true,
    },
  },
  srcDir: 'src/',
  modules: ['@pinia/nuxt', '@nuxt/test-utils/module', '@nuxtjs/i18n', '@nuxt/test-utils/module'],

  plugins: [
    '~/filters/index.ts',
    '~/directives/index.ts',
    '~/plugins/appInit.ts',
    '~/plugins/errorHandler.ts',
    '~/plugins/router-before-each.client.ts',
    '~/plugins/router-after-each.client.ts',
    '~/plugins/lang-switch.ts',
  ],
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
    resolve: {
      alias,
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
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
      appChatbotEnabled:
        (process.env.NUXT_APP_OPENAI_API_KEY && process.env.NUXT_APP_OPENAI_API_PROMPT_ID && 1) ||
        0,
    },
  },
  i18n: {
    locales: ALL_LOCALES,
    lazy: true,
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
