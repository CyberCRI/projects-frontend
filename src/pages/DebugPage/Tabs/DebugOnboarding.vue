<template>
  <div class="debug-onboarding">
    <p class="notice">Restart onboarding process for the current user.</p>
    <p v-if="!usersStore.userFromApi">Login first !</p>
    <LpiButton
      class="reset-button"
      :btn-icon="reseting ? 'LoaderSimple' : 'RotateRight'"
      :label="'Reset onboarding status'"
      :disabled="!usersStore.userFromApi || reseting"
      @click="resetOnboardingStatus"
    />
    <hr />
    <p class="notice">Reset terms approval for the current user.</p>
    <p v-if="!usersStore.userFromApi">Login first !</p>
    <LpiButton
      class="reset-button"
      :btn-icon="resetingTerms ? 'LoaderSimple' : 'RotateRight'"
      :label="'Reset terms approval'"
      :disabled="!usersStore.userFromApi || resetingTerms"
      @click="resetTermsSigned"
    />
  </div>
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import { patchUser } from '@/api/people.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'DebugOnboarding',
  components: { LpiButton },
  setup() {
    const toaster = useToasterStore()
    const usersStore = useUsersStore()
    return {
      toaster,
      usersStore,
    }
  },

  data() {
    return {
      reseting: false,
      resetingTerms: false,
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
      } catch (err) {
        console.error(err)
        this.toaster.pushError(`Error while reseting onboarding status`)
      } finally {
        this.reseting = false
      }
    },
    async resetTermsSigned() {
      this.resetingTerms = true
      try {
        if (!this.usersStore.userFromApi) return
        const user = this.usersStore.userFromApi
        const payload = {
          signed_terms_and_conditions: {
            ...user.signed_terms_and_conditions,
            [orgCode.value]: undefined,
          },
        }
        await patchUser(user.id, payload)
        await this.usersStore.getUser(user.id)
        this.toaster.pushSuccess(`Terms approval reseted for ${user.email}`)
      } catch (err) {
        console.error(err)
        this.toaster.pushError(`Error while reseting terms approval`)
      } finally {
        this.resetingTerms = false
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
