<template>
  <div class="document-tab">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ documentsCount }})</span>
      </h4>
      <ResearcherDocumentsList v-if="documentsCount > 0" :doc-type="docType" :user="user" />
      <div v-else class="document-tab-empty">
        {{ documentEmpty }}
      </div>
    </div>
  </div>
</template>

<script setup>
import ResearcherDocumentsList from '@/components/people/UserProfile/ResearcherDocumentsList.vue'

defineOptions({
  name: 'ProfileDocumentsTab',
})

const { t } = useNuxtI18n()

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  docType: {
    type: String,
    required: true,
  },
})

const title = t(`me.${props.docType}`)
const documentEmpty = t(`you.no-${props.docType}`)
const documentsCount = props.user.researcher?.documents?.[props.docType] ?? 0
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
