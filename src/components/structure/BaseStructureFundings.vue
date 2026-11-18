<template>
  <div class="funding-list">
    <FetchLoader :status="status" only-error skeleton>
      <Funding v-for="funding in fundings" :key="funding.id" :funding="funding" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </FetchLoader>
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { fundingSkeleton } from '~/skeletons/crisalid.skeletons'
import { getStructureFundings } from '~/api/v2/crisalid.service'
import Funding from '~/components/crisalid/modules/Funding.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean; limit?: number }>(),
  {
    limit: null,
    preview: false,
  }
)

const structureId = computed(() => props.group.structure?.id || 0)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.group.structure?.modules?.fundings || 0, props.limit)
)

const {
  status,
  data: fundings,
  pagination,
} = getStructureFundings(organizationCode, structureId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(fundingSkeleton, limitSkeletons.value),
})
</script>
