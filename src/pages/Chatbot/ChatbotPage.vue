<script setup>
import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
const props = defineProps({ agentId: String })
const CHAT_ENDPOINT = computed(() => '/api/agent/chat?id=' + props.agentId)

// type Params = Parameters<typeof useFetch>
const options = {}
const url = `/api/agent/${props.agentId}`
const { data: agent, status, error, clear } = await useFetch(url, options)

watch(
  () => error.value,
  (error) => {
    console.log(error)
  }
)

const loading = useLoadingFromStatus(status)

const hasUserContext = ref(agent.value.useProfileData)
const hasPageContext = ref(false)
const {
  allowProfile,
  updateAllowProfile,
  allowCurrentPage,
  updateAllowCurrentPage,
  computePageContext,
  contextMessages,
} = useChatbotContext({ hasUserContext, hasPageContext })
</script>
<template>
  <div class="page-section page-section-narrow page-top">
    <div>
      <h1 class="page-title">{{ agent?.title }}</h1>
      <p>{{ agent.description }}</p>
    </div>
    <ChatbotOptions :has-user-context="hasUserContext" />
    <ClientOnly>
      <Chatbot :endpoint="CHAT_ENDPOINT" :context-messages="contextMessages" />
    </ClientOnly>
  </div>
</template>
