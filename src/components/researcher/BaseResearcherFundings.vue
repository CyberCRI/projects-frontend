<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader v-if="!preview" :editable="false" :pagination="pagination" />

    <div class="funding-list">
      <Funding v-for="funding in fundings" :key="funding.id" :funding="funding" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>
<script lang="ts" setup>
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { getResearcherFundings } from '~/api/v2/crisalid.service'
import { fundingSkeleton } from '~/skeletons/crisalid.skeletons'
import Funding from '~/components/crisalid/modules/Funding.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{ user: TranslatedUserModel; preview?: boolean; limit?: number }>(),
  {
    limit: null,
    preview: false,
  }
)

const researcherId = computed(() => props.user.researcher?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.user.researcher.modules.fundings, props.limit)
)

const {
  status,
  data: fundings,
  pagination,
} = getResearcherFundings(organizationCode, researcherId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(fundingSkeleton, limitSkeletons.value),
})
</script>
