<template>
  <div v-if="user.researcher">
    <FetchLoader :status="status" only-error skeleton>
      <div class="affiliates">
        <ResearcherRow
          v-for="researcher in affiliated"
          :key="researcher.id"
          :researcher="researcher"
        />
      </div>
    </FetchLoader>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </div>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { researcherSkeleton } from '~/skeletons/crisalid.skeletons'
import ResearcherRow from '~/components/people/ResearcherRow.vue'
import { getResearchAffiliated } from '~/api/v2/crisalid.service'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.affiliated, props.limit)
)

const {
  status,
  data: affiliated,
  pagination,
} = getResearchAffiliated(organizationCode, researcherId.value, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researcherSkeleton, limitSkeletons.value),
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
