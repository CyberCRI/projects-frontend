<script setup lang="ts">
// import useToasterStore from '@/stores/useToaster'
// import useUsersStore from '@/stores/useUserStore'

// if (!useRuntimeConfig().public.appHasChatbotPromptDb) {
//   usePage404()
// }

// const toaster = useToasterStore()
// const usersStore = useUsersStore()
// const { t } = useNuxtI18n()

const showDocumentTitle = ref('')
</script>
<template>
  <div class="vector-store-admin-tab">
    <ChatConversationList @show-document="showDocumentTitle = $event" />
  </div>
  <ChatConversationShow
    v-if="showDocumentTitle"
    :document-title="showDocumentTitle"
    @close="showDocumentTitle = ''"
    @confirm="showDocumentTitle = ''"
  />
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.actions {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 2rem;
}
</style>
