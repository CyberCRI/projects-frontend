<script setup>
import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import useUsersStore from '@/stores/useUsers'

const props = defineProps({ agentId: String })
const CHAT_ENDPOINT = computed(() => '/api/agent/chat?id=' + props.agentId)

// type Params = Parameters<typeof useFetch>
const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = { headers }

const url = `/api/agent/${props.agentId}`
const { data: agent, status, error, clear } = await useFetch(url, options)

watch(
  () => error.value,
  (error) => {
    console.log(error)
  }
)

const loading = useLoadingFromStatus(status)

const hasUserContext = computed(() => !!agent.value?.useProfileData)
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
    <div v-if="agent">
      <h1 class="page-title">
        {{ agent?.title }}
      </h1>
      <h2 class="preview-mode" v-if="!agent.isEnabled">
        <IconImage name="AlertOutline" />
        {{ $t('agents.preview-mode') }}
        <IconImage name="AlertOutline" />
      </h2>
      <p>{{ agent.description }}</p>
    </div>
    <ChatbotOptions :has-user-context="hasUserContext" />
    <ClientOnly>
      <Chatbot :endpoint="CHAT_ENDPOINT" :context-messages="contextMessages" />
    </ClientOnly>
  </div>
</template>
<style lang="scss" scoped>
.preview-mode {
  display: flex;
  gap: 1rem;
  justify-content: center;
  text-align: center;
  color: $salmon;
  svg {
    fill: currentColor;
    width: 1em;
  }
}
</style>
