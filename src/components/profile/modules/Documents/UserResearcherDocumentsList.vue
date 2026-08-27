<template>
  <FetchLoader :status="[status, statusAnalytics]" :with-data="!!documents" skeleton>
    <ResearcherDocumentsListBase
      :preview="preview"
      :pagination="pagination"
      :document-type="documentType"
      :documents="documents"
      :documents-analytics="documentAnalytics"
      @on-filter="onFilter"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import type { ResearcherDocumentType, TranslatedUserModel } from 'shared-projects-frontend/models'

import {
  getUserResearchDocument,
  getUserResearchDocumentAnalytics,
} from '~/api/v2/crisalid.service'

import ResearcherDocumentsListBase from '~/components/profile/modules/Documents/ResearcherDocumentsListBase.vue'
import { documentAnalyticsSkeleton, researchDocumentSkeleton } from '~/skeletons/crisalid.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'

const props = withDefaults(
  defineProps<{
    preview?: boolean
    limit?: number
    user: TranslatedUserModel
    documentType: ResearcherDocumentType
  }>(),
  { preview: false, limit: null }
)
const orgaCode = useOrganizationCode()

const researchId = computed(() => props.user.researcher.id)
const query = ref({})
const onFilter = (filters) => (query.value = { ...filters })

const { data: documentAnalytics, status: statusAnalytics } = getUserResearchDocumentAnalytics(
  orgaCode,
  researchId,
  props.documentType,
  {
    query,
    default: () => documentAnalyticsSkeleton(),
  }
)
const {
  pagination,
  data: documents,
  status,
} = getUserResearchDocument(orgaCode, researchId, props.documentType, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researchDocumentSkeleton, props.limit),
})
</script>
