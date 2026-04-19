<script setup>
// import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import useUsersStore from '@/stores/useUsers'

const props = defineProps({ agentSlug: { type: String, required: true } })

// type Params = Parameters<typeof useFetch>
const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = { headers }

const url = `/api/chatbot/${props.agentSlug}`
const { data: agent, error } = await useFetch(url, options)
const CHAT_ENDPOINT = computed(() => '/api/chatbot/chat?id=' + agent.value?.id)

watch(
  () => error.value,
  (error) => {
    console.log(error)
  }
)

// const loading = useLoadingFromStatus(status)

const hasUserContext = computed(() => !!agent.value?.useProfileData)
const hasPageContext = ref(false)
const { contextMessages } = useChatbotContext({ hasUserContext, hasPageContext })
</script>
<template>
  <div class="page-section page-section-narrow page-top">
    <div v-if="agent">
      <h1 class="page-title">
        {{ agent?.title }}
      </h1>
      <h2 v-if="!agent.isEnabled" class="preview-mode">
        <IconImage name="AlertOutline" />
        {{ $t('agents.preview-mode') }}
        <IconImage name="AlertOutline" />
      </h2>
      <TipTapOutput class="description" :content="agent.description" />
    </div>
    <ChatbotOptions :has-user-context="hasUserContext" />
    <ClientOnly>
      <ChatbotUi :endpoint="CHAT_ENDPOINT" :context-messages="contextMessages" />
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
    fill: currentcolor;
    width: 1em;
  }
}

.description {
  margin-block: 2rem;
}
</style>
