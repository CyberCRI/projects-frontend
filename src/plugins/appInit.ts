import { defineNuxtPlugin } from '#imports'
import main from '@/main'
// https://stackoverflow.com/questions/61755999/uncaught-referenceerror-regeneratorruntime-is-not-defined-in-react
import regeneratorRuntime from 'regenerator-runtime'

export default defineNuxtPlugin((vueApp) => {
    vueApp.hook('app:beforeMount', async () => {
        // main make some unit (keycloak.spec) tests fail
        // so disable when in test mode
        // see https://github.com/nuxt/test-utils/issues/526
        const process = await import('node:process')
        const isTest = String(process.env?.TEST) === 'true'
        if (!isTest) {
            await main()
        }
    })
})
