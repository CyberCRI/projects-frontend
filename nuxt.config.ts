import { alias } from './alias'

const apiProxy = {
    '^/v[0-9]+/': {
        target: `${process.env.NUXT_PUBLIC_APP_API_URL}`,
        changeOrigin: true,
        secure: false, // required because local frontend is served over non secure http
        withCredentials: true,
    },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    srcDir: 'src/',
    modules: ['@pinia/nuxt', '@nuxtjs/i18n', '@nuxt/test-utils/module'],

    plugins: ['~/filters/index.ts', '~/directives/index.ts'],
    imports: {
        autoImport: false,
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
                        $PUBLIC_BINARIES_PREFIX: '${process.env.NUXT_PUBLIC_APP_PUBLIC_BINARIES_PREFIX}';
                    `,
                },
            },
        },

        server: {
            //host: '0.0.0.0',
            //port: 8080,
            proxy: {
                ...apiProxy,
            },
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
    },
})
