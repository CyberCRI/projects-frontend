<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="teaching-list">
      <Teaching v-for="teaching in teachings" :key="teaching.id" :teaching="teaching" />
      <NothingHere v-if="!preview && teachings.length === 0" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>

<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { getResearcherTeachings } from '~/api/v2/crisalid.service'
import { teachingSkeleton } from '~/skeletons/crisalid.skeletons'
import NothingHere from '~/components/base/NothingHere.vue'
const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.teachings, props.limit)
)

const {
  status,
  data: teachings,
  pagination,
} = getResearcherTeachings(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(teachingSkeleton, limitSkeletons.value),
})
</script>
