<template>
  <BaseDrawer
    :is-opened="!!document"
    data-test="add-default-skills-drawer"
    :title="`${t(`profile.${docType}-similars`)} (${count})`"
    class="medium"
    @close="emit('close')"
  >
    <FetchLoader :status="status" only-error skeleton>
      <div class="documents-list-similars">
        <ResearcherDocument
          v-for="doc in documents"
          :key="doc.id"
          :document="doc"
          :doc-type="docType"
          :similar="false"
        />
      </div>
    </FetchLoader>
    <template #footer>
      <div class="documents-paginations">
        <PaginationButtons2 :pagination="pagination" />
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { getResearchDocumentSimilars } from '@/api/v2/crisalid.service'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { TranslatedDocument } from '@/interfaces/researcher'
import { factoryPagination } from '@/skeletons/base.skeletons'
import { researchDocumentSkeleton } from '@/skeletons/crisalid.skeletons'

const { t } = useNuxtI18n()
const emit = defineEmits(['close'])
const props = defineProps<{
  document?: TranslatedDocument
  docType: string
}>()

const organizationCode = useOrganizationCode()
const documentId = computed(() => props.document?.id)
const LIMIT = 10
const {
  status,
  pagination,
  data: documents,
} = getResearchDocumentSimilars(organizationCode, documentId, {
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(researchDocumentSkeleton, LIMIT),
})
const { count } = pagination
</script>

<style lang="scss">
$profile-documents: 1rem;

.documents-list-similars > *:not(:last-child)::after {
  content: '';
  display: inline-block;
  width: 100%;
  height: 1.5px;
  opacity: 0.7;
  background-color: #d4d4d4;
}

.documents-paginations {
  display: flex;
  justify-content: center;
}
</style>
