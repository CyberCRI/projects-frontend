import { patchUser } from '@/api/people.service'

type OnboardingKey =
    | 'show_welcome'
    | 'create_project'
    | 'take_tour'
    | 'explore_projects'
    | 'complete_profile'
    | 'show_progress'
export type OnboardingStatusType = {
    [key in OnboardingKey]: boolean
}

export default {
    methods: {
        async onboardingTrap(key: OnboardingKey, val: boolean) {
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

        async onboardingTrapAll(newStatus: OnboardingStatusType) {
            const connected = this.$store.getters['users/isConnected']
            if (connected) {
                const user = this.$store.getters['users/userFromApi']
                const status = user?.onboarding_status || {}

                const statusIsDifferent = Object.keys(newStatus).some(
                    (key) => status[key] !== newStatus[key]
                )

                if (statusIsDifferent) {
                    const payload = { onboarding_status: { ...status, ...newStatus } }
                    await patchUser(user.keycloak_id, payload)
                    await this.$store.dispatch('users/getUser', user.keycloak_id)
                }
            }
        },
    },
}
