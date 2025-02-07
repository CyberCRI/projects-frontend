/* eslint-disable vue/require-name-property */
import { useRuntimeConfig } from '#imports'
import { defineComponent } from 'vue'
export default defineComponent({
    data() {
        const runtimeConfig = useRuntimeConfig() // TODO nuxt check this
        return {
            PUBLIC_BINARIES_PREFIX: runtimeConfig.public.appPublicBinariesPrefix || '',
        }
    },
})
