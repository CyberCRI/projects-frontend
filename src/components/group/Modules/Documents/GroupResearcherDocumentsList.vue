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
import type {
  TranslatedPeopleGroupModel,
  ResearcherDocumentType,
} from 'shared-projects-frontend/models'

import {
  getGroupResearchDocument,
  getGroupResearchDocumentAnalytics,
} from '~/api/v2/crisalid.service'

import ResearcherDocumentsListBase from '~/components/profile/modules/Documents/ResearcherDocumentsListBase.vue'
import { documentAnalyticsSkeleton, researchDocumentSkeleton } from '~/skeletons/crisalid.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'

const props = withDefaults(
  defineProps<{
    preview?: boolean
    limit?: number
    group: TranslatedPeopleGroupModel
    documentType: ResearcherDocumentType
  }>(),
  { preview: false, limit: null }
)
const orgaCode = useOrganizationCode()

const groupId = computed(() => props.group.id)
const query = ref({})
const onFilter = (filters) => (query.value = { ...filters })

const { data: documentAnalytics, status: statusAnalytics } = getGroupResearchDocumentAnalytics(
  orgaCode,
  groupId,
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
} = getGroupResearchDocument(orgaCode, groupId, props.documentType, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researchDocumentSkeleton, props.limit),
})
</script>
