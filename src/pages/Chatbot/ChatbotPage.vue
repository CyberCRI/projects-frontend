<script setup>
import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
const props = defineProps({ chatId: String })
const CHAT_ENDPOINT = computed(() => '/api/agents/chat?id=' + props.chatId)

// type Params = Parameters<typeof useFetch>
const options = { query: { id: props.chatId } }
const url = '/api/agents/get'
const { data: agent, status, error, clear } = await useFetch(url, options)
const loading = useLoadingFromStatus(status)
</script>
<template>
  <div class="page-section page-section-narrow page-top">
    <div>
      <h1 class="page-title">Chat with a bot!</h1>
      <p>Chat #{{ chatId }} - {{ agent?.title }}</p>
    </div>
    <ClientOnly>
      <Chatbot :endpoint="CHAT_ENDPOINT" :context-messages="[]" />
    </ClientOnly>
  </div>
</template>
