<template>
  <div v-if="user.researcher">
    <FetchLoader :status="status" only-error skeleton>
      <div class="affiliates">
        <UserRow v-for="affiliate in affiliated" :key="affiliate.id" :user="affiliate" />
      </div>
    </FetchLoader>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </div>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { similarResearcherSkeleton } from '~/skeletons/crisalid.skeletons'
import { getResearchAffiliated } from '~/api/v2/crisalid.service'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: 12, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.limit, props.limit))

const {
  status,
  // isLoading,
  data: affiliated,
  pagination,
  // refresh,
} = getResearchAffiliated(organizationCode, researcherId.value, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(similarResearcherSkeleton, limitSkeletons.value),
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.affiliates {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}
</style>
