import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
export default defineNitroPlugin((nuxtApp) => {
    nuxtApp.hooks.hook('error', (error) => {
        if (import.meta.dev) console.error('Nitro:Error', error)
    })
})
