<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import SectionHeader from '~/components/base/SectionHeader.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { getUserPrivacy } from '~/api/v2/user.service'
import { USER_MODULE_TITLE } from '~/functs/constants'
import { getUserGroups } from '~/api/v2/user.service'

const props = defineProps<{
  profile: TranslatedUserModel
}>()
const profileId = computed(() => props.profile?.id)
const organizationCode = useOrganizationCode()
const limitGroupsSkeletons = computed(() => maxSkeleton(3, props.limit))

const {
  status,
  data: groups,
  isLoading,
} = getUserGroups(organizationCode, profileId, {
  paginationConfig: {
    limit: 1,
  },
  immediate: profileId.value != -1,
  default: () => factoryPagination(groupSkeleton, limitGroupsSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="teams">
      <SectionHeader :title="$t(USER_MODULE_TITLE.privacy)" :has-button="false" :quantity="0" />
      <PrivacyForm :user="profile" />
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
