<template>
  <BaseDrawer
    :is-opened="!!document"
    data-test="add-default-skills-drawer"
    :title="`${t(`profile.${docType}-similars`)} (${count})`"
    class="medium"
    no-footer
    @close="emit('close')"
  >
    <FetchLoader :status="status">
      <div class="documents-list-similars">
        <ResearcherDocument
          v-for="doc in documentsTranslated"
          :key="doc.id"
          :document="doc"
          :doc-type="docType"
          :similar="false"
        />
      </div>
      <div class="documents-paginations">
        <PaginationButtons2 :pagination="pagination" />
      </div>
    </FetchLoader>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { sanitizeResearcherDocuments } from '@/api/sanitizes/researcher'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { PaginationResult, usePagination } from '@/composables/usePagination'
import { Document, TranslatedDocument } from '@/interfaces/researcher'
import { UserModel } from '@/models/user.model'
import { AsyncDataRequestStatus } from 'nuxt/app'

defineOptions({ name: 'ResearcherDocumentSimilars' })

const { t } = useNuxtI18n()
const emit = defineEmits(['close'])
const props = defineProps<{
  document?: Document
  docType: string
  user: UserModel
}>()

const status = ref<AsyncDataRequestStatus>('pending')
const documents = ref<PaginationResult<Document>>()
const pagination = usePagination(documents, { limit: 10 })
const { count } = pagination
const { translateResearcherDocuments } = useAutoTranslate()
const orgaCode = useOrganizationCode()

// get results list from paginated response
const results = computed<Document[] | undefined>(() => documents.value?.results)
const documentsTranslated: ComputedRef<TranslatedDocument[]> = translateResearcherDocuments(results)

const getDocuments = (query) => {
  status.value = 'pending'
  useAPI(
    `crisalid/organization/${orgaCode}/researcher/${props.user.researcher.id}/${props.docType}/${props.document.id}/similars/`,
    {
      query,
    }
  )
    .then((data) => {
      documents.value = sanitizeResearcherDocuments(data)
      status.value = 'success'
    })
    .catch(() => {
      status.value = 'error'
    })
}

watch(pagination.query, (query) => props.document && getDocuments(query))
watch(
  () => props.document,
  (doc) => doc && getDocuments(pagination.query()),
  { immediate: true }
)
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
