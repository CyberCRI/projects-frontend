<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="awards-list">
      <Award v-for="award in awards" :key="award.id" :award="award" />
      <NothingHere v-if="!isLoading && awards.length === 0" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>

<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { researcherAwardSkeleton } from '~/skeletons/crisalid.skeletons'
import { getStructureAwards } from '~/api/v2/crisalid.service'
import Award from '~/components/crisalid/modules/Award.vue'

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const structureId = computed(() => props.group.structure?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.group.structure.modules.awards, props.limit)
)

const {
  status,
  isLoading,
  data: awards,
  pagination,
} = getStructureAwards(organizationCode, structureId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researcherAwardSkeleton, limitSkeletons.value),
})
</script>
