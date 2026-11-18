<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader v-if="!preview" :editable="false" :pagination="pagination" />

    <div class="awards-list">
      <AwardContributor v-for="award in awards" :key="award.award.id" :award="award" />
      <NothingHere v-if="!isLoading && awards.length === 0" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>
<script lang="ts" setup>
import AwardContributor from '~/components/crisalid/modules/AwardContributor.vue'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { researcherAwardSkeleton } from '~/skeletons/crisalid.skeletons'
import { getResearcherAwards } from '~/api/v2/crisalid.service'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.awards, props.limit)
)

const {
  status,
  isLoading,
  data: awards,
  pagination,
} = getResearcherAwards(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researcherAwardSkeleton, limitSkeletons.value),
})
</script>
