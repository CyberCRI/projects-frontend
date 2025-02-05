import path from 'path'
import { fileURLToPath } from 'url'

const apiProxy = {
    '^/v[0-9]+/': {
        target: `${process.env.NUXT_PUBLIC_APP_API_URL}`,
        changeOrigin: true,
        secure: false, // required because local frontend is served over non secure http
        withCredentials: true,
    },
}

const filename = fileURLToPath(import.meta.url)
const pathSegments = path.dirname(filename)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    srcDir: 'src/',
    modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

    plugins: ['~/filters/index.ts', '~/directives/index.ts'],
    imports: {
        autoImport: false,
    },
    vite: {
        resolve: {
            alias: {
                '@': path.resolve(pathSegments, './src'),
                '~': path.resolve(pathSegments, './node_modules'),
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use 'sass:math';
                        @import '@/design/scss/variables.scss';
                        $PUBLIC_BINARIES_PREFIX: '${process.env.VITE_APP_PUBLIC_BINARIES_PREFIX}';
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
            appApiOrgCode: '',
            appKeycloakUrl: '',
            appKeycloakClientId: '',
            appKeycloakClientSecret: '',
            appKeycloakRealm: '',
            appApiUrl: '',
            appApiDefaultVersion: '',
        },
    },
    i18n: {
        vueI18n: './i18n.config.ts', // if you are using custom path, default
    },
})
