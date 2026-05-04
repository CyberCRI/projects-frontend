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
<script setup lang="ts">
import { patchUser } from '~/api/people.service'

import LpiButton from '~/components/base/button/LpiButton.vue'

import useToasterStore from '~/stores/useToaster'
import useUsersStore from '~/stores/useUsers'

const toaster = useToasterStore()
const usersStore = useUsersStore()

const reseting = ref(false)
const resetingTerms = ref(false)
const organizationCode = useOrganizationCode()

const resetOnboardingStatus = async () => {
  reseting.value = true
  try {
    const payload = { onboarding_status: { show_welcome: true, show_progress: true } }
    const user = usersStore.userFromApi
    const keycloak_id = user.keycloak_id
    await patchUser(keycloak_id, payload)
    await usersStore.getUser(keycloak_id)
    toaster.pushSuccess(`Onboarding reseted for ${user.email}`)
  } catch (err) {
    console.error(err)
    toaster.pushError(`Error while reseting onboarding status`)
  } finally {
    reseting.value = false
  }
}
const resetTermsSigned = async () => {
  resetingTerms.value = true
  try {
    if (!usersStore.userFromApi) return
    const user = usersStore.userFromApi
    const payload = {
      signed_terms_and_conditions: {
        ...user.signed_terms_and_conditions,
        [organizationCode]: undefined,
      },
    }
    await patchUser(user.id, payload)
    await usersStore.getUser(user.id)
    toaster.pushSuccess(`Terms approval reseted for ${user.email}`)
  } catch (err) {
    console.error(err)
    toaster.pushError(`Error while reseting terms approval`)
  } finally {
    resetingTerms.value = false
  }
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
