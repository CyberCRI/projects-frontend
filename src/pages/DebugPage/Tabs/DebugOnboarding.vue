<template>
    <div class="debug-onboarding">
        <p class="notice">Restart onboarding process for the current user.</p>
        <p v-if="!$store.getters['users/userFromApi']">Login first !</p>
        <LpiButton
            class="reset-button"
            @click="resetOnboardingStatus"
            :btn-icon="reseting ? 'LoaderSimple' : 'RotateRight'"
            :label="'Reset onboarding status'"
            :disabled="!$store.getters['users/userFromApi'] || reseting"
        ></LpiButton>
    </div>
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import { patchUser } from '@/api/people.service.ts'
export default {
    name: 'DebugOnboarding',
    components: { LpiButton },
    data() {
        return {
            reseting: false,
        }
    },
    methods: {
        async resetOnboardingStatus() {
            this.reseting = true
            try {
                const payload = { onboarding_status: { show_welcome: true, show_progress: true } }
                const user = this.$store.getters['users/userFromApi']
                const keycloak_id = user.keycloak_id
                await patchUser(keycloak_id, payload)
                await this.$store.dispatch('users/getUser', keycloak_id)
                this.$store.dispatch('notifications/pushToast', {
                    message: `Onboarding reseted for ${user.email}`,
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `Error while reseting onboarding status`,
                    type: 'error',
                })
            } finally {
                this.reseting = false
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.debug-onboarding {
    margin: 1rem;
    text-align: center;

    .reset-button {
        margin: 1rem auto;
        text-align: center;
    }
}
</style>
