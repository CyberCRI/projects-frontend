export default {
    data() {
        return {
            PUBLIC_BINARIES_PREFIX: import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX || '',
        }
    },
}
