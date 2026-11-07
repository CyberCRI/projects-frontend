<template>
  <div class="similar-researcher-preview">
    <div class="similar-list">
      <FetchLoader :status="status" only-error skeleton>
        <SimilarResearcherCard
          v-for="researcher in similars"
          :key="researcher.id"
          :researcher="researcher"
        />
        <NothingHere v-if="similars.length === 0" />
      </FetchLoader>
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </div>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { researcherSkeleton } from '~/skeletons/crisalid.skeletons'
import { getResearcherSimilars } from '~/api/v2/crisalid.service'
import NothingHere from '~/components/base/NothingHere.vue'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.similars, props.limit)
)

const {
  status,
  data: similars,
  pagination,
} = getResearcherSimilars(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researcherSkeleton, limitSkeletons.value),
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-researcher-preview {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  justify-content: center;
}

.similar-title {
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  color: variables.$primary-dark;
}

.similar-list {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}
</style>
