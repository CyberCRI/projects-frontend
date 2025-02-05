import { useRuntimeConfig } from '#imports'
export default {
    data() {
        const runtimeConfig = useRuntimeConfig() // TODO nuxt check this
        return {
            PUBLIC_BINARIES_PREFIX: runtimeConfig.public.appPublicBinariesPrefix || '',
        }
    },
}
