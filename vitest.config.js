import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    test: {
        include: ['tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        globals: true,
        environment: 'happy-dom',
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
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
