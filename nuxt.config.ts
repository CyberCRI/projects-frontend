import { alias } from './alias'

// const apiProxy = {
//     '^/v[0-9]+/': {
//         target: `${process.env.NUXT_PUBLIC_APP_API_URL}`,
//         changeOrigin: true,
//         secure: false, // required because local frontend is served over non secure http
//         withCredentials: true,
//     },
// }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: import.meta.dev },
  srcDir: 'src/',
  modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/test-utils/module'],

  plugins: ['~/filters/index.ts', '~/directives/index.ts', '~/plugins/errorHandler.ts'],
  imports: {
    autoImport: true, //false,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
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
                        $PUBLIC_BINARIES_PREFIX: '${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}';
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
    },
  },
  i18n: {
    vueI18n: './i18n.config.ts', // if you are using custom path, default
    // temp fix for a ssr warning, see https://github.com/nuxt-modules/i18n/issues/3350
    locales: [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
    ],
  },
  // routeRules: {
  //     '/v1/**': {
  //         proxy: `${process.env.NUXT_PUBLIC_APP_API_URL}/**`,
  //         //{
  //         //  to: ,
  //         // changeOrigin: true,
  //         // secure: !import.meta.dev, // required because local frontend is served over non secure http
  //         // withCredentials: true,
  //         //},
  //     },
  // },
  nitro: {
    minify: import.meta.dev,
  },

  app: {
    head: {
      title: 'Projects',
      charset: 'urf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      link: [
        {
          rel: 'icon',
          href: `${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}/favicon.ico`,
        },
      ],
      meta: [
        {
          name: 'description',
          content: 'Projects is a platform to document and promote projects for common good',
        },

        // Open Graph

        {
          name: 'og:title',
          content: 'Share your projects to increase impact',
        },

        {
          name: 'og:type',
          content: 'website',
        },

        {
          name: 'og:description',
          content: 'Projects is a platform to document and promote projects for common good',
        },

        {
          // TODO change to frontend url
          name: 'og:url',
          content: process.env.NUXT_PUBLIC_APP_API_URL,
        },

        {
          name: 'og:image',
          content: `${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}/social/meta_background_og.png`,
        },

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

        {
          name: 'twitter:image',
          content: `${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}/social/meta_background_twt.png`,
        },
      ],
    },
  },
})
