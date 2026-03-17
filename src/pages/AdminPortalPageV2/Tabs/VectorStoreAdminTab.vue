<script setup>
const { t } = useNuxtI18n()

const isLoading = ref(false)

const showDocumentTitle = ref('')

const addDocumentIsOpen = ref(false)
</script>
<template>
  <div class="terms-of-service-admin-tab">
    <div v-if="isLoading" class="loader">
      <LoaderSimple />
    </div>
    <template v-else>
      <VectorStoreDocumentList @show-document="showDocumentTitle = $event" />
      <LpiButton @click="addDocumentIsOpen = true" />
    </template>

    <VectorStoreDocumentShow
      v-if="showDocumentTitle"
      :document-title="showDocumentTitle"
      @close="showDocumentTitle = ''"
      @confirm="showDocumentTitle = ''"
    />
    <VectorStoreIngestionForm :is-opened="addDocumentIsOpen" @close="addDocumentIsOpen = false" />
  </div>
</template>
