import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'

const filename = fileURLToPath(import.meta.url)
const pathSegments = path.dirname(filename)

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    console.log('process.env.VITE_APP_API_URL', env.VITE_APP_API_URL)
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
            port: 8080,
            proxy: {
                ...apiProxy,
            },
        },
    }
})
