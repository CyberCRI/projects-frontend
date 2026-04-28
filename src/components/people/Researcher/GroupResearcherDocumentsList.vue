<template>
  <FetchLoader :status="[status, statusAnalytics]" :with-data="!!documents" skeleton>
    <ResearcherDocumentsListBase
      :preview="preview"
      :pagination="pagination"
      :doc-type="docType"
      :documents="documents"
      :documents-analytics="documentAnalytics"
      @on-filter="onFilter"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import type { DocumentType } from '~/interfaces/researcher'

import {
  getGroupResearchDocument,
  getGroupResearchDocumentAnalytics,
} from '~/api/v2/crisalid.service'

import ResearcherDocumentsListBase from '~/components/people/Researcher/ResearcherDocumentsListBase.vue'

import { documentAnalyticsSkeleton, researchDocumentSkeleton } from '~/skeletons/crisalid.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'

const props = withDefaults(
  defineProps<{
    preview?: boolean
    limit?: number
    group: TranslatedPeopleGroupModel
    docType: DocumentType
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
  props.docType,
  {
    query,
    default: () => documentAnalyticsSkeleton(),
  }
)
const {
  pagination,
  data: documents,
  status,
} = getGroupResearchDocument(orgaCode, groupId, props.docType, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researchDocumentSkeleton, props.limit),
})
</script>
