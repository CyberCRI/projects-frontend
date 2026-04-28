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
import { getOwnResearchDocument, getOwnResearchDocumentAnalytics } from '~/api/v2/crisalid.service'
import ResearcherDocumentsListBase from '~/components/people/Researcher/ResearcherDocumentsListBase.vue'
import { DocumentType } from '~/interfaces/researcher'
import { UserModel } from '~/models/user.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { researchDocumentSkeleton, documentAnalyticsSkeleton } from '~/skeletons/crisalid.skeletons'

const props = withDefaults(
  defineProps<{ preview?: boolean; limit?: number; user: UserModel; docType: DocumentType }>(),
  { preview: false, limit: null }
)
const orgaCode = useOrganizationCode()

const researchId = computed(() => props.user.researcher.id)
const query = ref({})
const onFilter = (filters) => (query.value = { ...filters })

const { data: documentAnalytics, status: statusAnalytics } = getOwnResearchDocumentAnalytics(
  orgaCode,
  researchId,
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
} = getOwnResearchDocument(orgaCode, researchId, props.docType, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(researchDocumentSkeleton, props.limit),
})
</script>
