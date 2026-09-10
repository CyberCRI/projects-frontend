<script setup lang="ts">
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import SectionHeader from '~/components/base/SectionHeader.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import GroupCard from '~/components/group/GroupCard.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'
import { getUserGroups } from '~/api/v2/user.service'

const props = withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
  }>(),
  {
    limit: null,
    preview: false,
    editable: false,
  }
)

const profileId = computed(() => props.profile.id)
const organizationCode = useOrganizationCode()
const limitGroupsSkeletons = computed(() => maxSkeleton(props.profile.modules.groups, props.limit))

const {
  status,
  data: groups,
  isLoading,
  pagination,
} = getUserGroups(organizationCode, profileId, {
  paginationConfig: {
    limit: props.preview ? props.limit : null,
  },
  default: () => factoryPagination(groupSkeleton, limitGroupsSkeletons.value),
  checkArgs: true,
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="teams">
      <BaseModuleHeader v-if="!preview" :pagination="pagination" :editable="false" />
      <SectionHeader
        v-if="!preview"
        :title="$t(USER_MODULE_TITLE.groups, groups.length)"
        :has-button="false"
        :quantity="groups.length"
      />
      <div class="team-groups">
        <GroupCard v-for="group in groups" :key="group.id" :group="group" />
      </div>
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
      <NothingHere v-if="!isLoading && groups.length === 0" />
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
