import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

const filename = fileURLToPath(import.meta.url)
const pathSegments = path.dirname(filename)

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    console.log(`Build:      ${process.env.NODE_ENV == 'production' ? 'PROD' : 'DEV'}`)
    console.log(`Mode:       ${mode}`)
    console.log(`Org:        ${env.VITE_APP_API_ORG_CODE}`)
    console.log(`API:        ${env.VITE_APP_API_URL}`)
    console.log('')

    const apiProxy = {
        '^/v[0-9]+/': {
            target: `${env.VITE_APP_API_URL}`,
            changeOrigin: true,
            secure: false, // required because local frontend is served over non secure http
            withCredentials: true,
        },
    }

    return {
        plugins: [
            vue(),
            createHtmlPlugin({
                inject: {
                    data: {
                        API_URL: env.VITE_APP_API_URL,
                        IMAGES_BUCKET: env.VITE_APP_PUBLIC_BINARIES_PREFIX,
                        APP_VERSION: env.VITE_APP_VERSION,
                    },
                },
            }),
        ],
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
                    $PUBLIC_BINARIES_PREFIX: '${env.VITE_APP_PUBLIC_BINARIES_PREFIX}';
                `,
                },
            },
        },

        server: {
            host: '0.0.0.0',
            port: 8080,
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
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name].${env.VERSION_HASH}.js`,
                    chunkFileNames: `assets/[name].${env.VERSION_HASH}.js`,
                    assetFileNames: `assets/[name].${env.VERSION_HASH}.[ext]`,
                },
            },
        },
    }
})
