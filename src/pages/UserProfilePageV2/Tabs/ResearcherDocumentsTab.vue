<template>
  <div class="document-tab">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ documentsCount }})</span>
      </h4>
      <OwnResearcherDocumentsList v-if="documentsCount > 0" :doc-type="docType" :user="user" />
      <div v-else class="document-tab-empty">
        {{ documentEmpty }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import OwnResearcherDocumentsList from '@/components/people/Researcher/OwnResearcherDocumentsList.vue'
import { DocumentType } from '@/interfaces/researcher'
import { UserModel } from '@/models/user.model'

defineOptions({ name: 'ResearcherDocumentsTab' })

const { t } = useNuxtI18n()

const props = defineProps<{ docType: DocumentType; user: UserModel }>()

const title = computed(() => t(`me.${props.docType}`))
const documentEmpty = computed(() => t(`you.no-${props.docType}`))
const documentsCount = computed(() => props.user.researcher?.documents?.[props.docType] ?? 0)
</script>

<style lang="scss" scoped>
.document-tab {
  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin: $space-l 0;
  }
}

.document-tab-empty {
  font-style: italic;
  opacity: 0.7;
  width: 100%;
  text-align: center;
}
</style>
