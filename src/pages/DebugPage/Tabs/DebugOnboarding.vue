<template>
    <div class="debug-onboarding">
        <p class="notice">Restart onboarding process for the current user.</p>
        <p v-if="!usersStore.userFromApi">Login first !</p>
        <LpiButton
            class="reset-button"
            @click="resetOnboardingStatus"
            :btn-icon="reseting ? 'LoaderSimple' : 'RotateRight'"
            :label="'Reset onboarding status'"
            :disabled="!usersStore.userFromApi || reseting"
        ></LpiButton>
    </div>
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import { patchUser } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
export default {
    name: 'DebugOnboarding',
    components: { LpiButton },
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

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
                const user = this.usersStore.userFromApi
                const keycloak_id = user.keycloak_id
                await patchUser(keycloak_id, payload)
                await this.usersStore.getUser(keycloak_id)
                this.toaster.pushSuccess(`Onboarding reseted for ${user.email}`)
            } catch (error) {
                this.toaster.pushError(`Error while reseting onboarding status`)
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
