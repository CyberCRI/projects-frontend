<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="researchers-similars">
      <div class="researchers-similars-list">
        <SimilarResearcherCard
          v-for="researcher in similars"
          :key="researcher.id"
          class="researchers-similars-card"
          :researcher="researcher"
        />
        <NothingHere v-if="similars.length === 0" />
      </div>
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
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

.researchers-similars {
  .researchers-similars-list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.5rem;

    .researchers-similars-card {
      width: 100%;
    }
  }
}
</style>
