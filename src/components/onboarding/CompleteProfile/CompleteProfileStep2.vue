<template>
  <div v-if="isLoading" class="loader">
    <LoaderSimple />
  </div>
  <template v-else>
    <ProfileEditBlock :block-title="t('complete-profile.skills.title')">
      <BaseSkill v-if="user" :user="user" editable :limit="9" />
    </ProfileEditBlock>
  </template>
</template>

<script setup lang="ts">
import { getUser } from '~/api/v2/user.service'

import BaseSkill from '~/components/profile/modules/Skills/BaseSkill.vue'

import ProfileEditBlock from '~/components/onboarding/CompleteProfile/ProfileEditBlock.vue'
import LoaderSimple from '~/components/base/loader/LoaderSimple.vue'

import useUsersStore from '~/stores/useUsers'

defineOptions({ name: 'CompleteProfileStep2' })
const emit = defineEmits(['saving', 'loading'])

const { t } = useNuxtI18n()
const usersStore = useUsersStore()
const { onboardingTrap } = useOnboardingStatus()
const organizationCode = useOrganizationCode()
const { data: user, isLoading } = getUser(organizationCode, usersStore.id)

watch(
  () => isLoading.value,
  (neo) => emit('loading', neo)
)

const save = async () => {
  // this called by CompleteProfileDrawer.vue
  await onboardingTrap('complete_profile', false)
  return true
}

defineExpose({ save })
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.loader {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
