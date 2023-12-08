import { patchUser } from '@/api/people.service'

export default {
    methods: {
        async onboardingTrap(key, val) {
            const connected = this.$store.getters['users/isConnected']
            if (connected) {
                const user = this.$store.getters['users/userFromApi']
                const status = user?.onboarding_status || {}
                if (status[key] !== val) {
                    const payload = { onboarding_status: { ...status, [key]: val } }
                    await patchUser(user.keycloak_id, payload)
                    await this.$store.dispatch('users/getUser', user.keycloak_id)
                }
            }
        },
    },
}
