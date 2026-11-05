<template>
  <div v-if="user.researcher" class="similar-researcher-preview">
    <h3 class="similar-title">{{ $t(USER_MODULE_TITLE.similarResearchers) }}</h3>
    <div class="similar-list">
      <FetchLoader :status="status" only-error skeleton>
        <SimilarResearcherCard
          v-for="(similar, index) in similarResearchers"
          :key="index"
          :user="similar"
        />
      </FetchLoader>
    </div>
    <BaseModuleButton
      v-if="preview"
      :to="'/'"
      btn-icon="ArrowRight"
      :label="$t('researcher.view.all')"
    />
    <PaginationButtonsV2 v-else :pagination="pagination" />
  </div>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { similarResearcherSkeleton } from '~/skeletons/crisalid.skeletons'
import { getResearcherSimilars } from '~/api/v2/crisalid.service'
import { USER_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: 3, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.limit, props.limit))

const {
  status,
  // isLoading,
  data: similarResearchers,
  pagination,
  // refresh,
} = getResearcherSimilars(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(similarResearcherSkeleton, limitSkeletons.value),
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
