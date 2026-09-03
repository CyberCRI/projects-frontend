<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import SectionHeader from '~/components/base/SectionHeader.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getUserPrivacy } from '~/api/v2/user.service'
import { USER_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  profile: TranslatedUserModel
}>()
const profileId = computed(() => props.profile?.id || -1)
const organizationCode = useOrganizationCode()
const {
  status,
  data: privacySettings,
  isLoading,
} = getUserPrivacy(organizationCode, profileId, {
  condition: computed(() => profileId.value && profileId.value != -1),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="teams">
      <SectionHeader :title="$t(USER_MODULE_TITLE.privacy)" :has-button="false" :quantity="0" />
      <PrivacyForm :user="profile" :privacy-settings="privacySettings" :is-loading="isLoading" />
    </div>
  </FetchLoader>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.teams {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-card {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1rem;
}

.team-groups {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  flex-wrap: wrap;

  .project-group {
    width: 100%;
    max-width: 200px;
  }
}
</style>
