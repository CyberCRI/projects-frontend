<script setup>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import useUsersStore from '@/stores/useUsers'

const props = defineProps({ agentSlug: { type: String, required: true } })

// type Params = Parameters<typeof useFetch>
const usersStore = useUsersStore()
const isConnected = computed(() => usersStore.isConnected)

if (!useRuntimeConfig().public.appHasChatbotPromptDb) {
  usePage404()
}

const login = () => {
  goToKeycloakLoginPage()
}

const chatbotUi = useTemplateRef('chatbotUi')

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')

if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = { headers }

const url = `/api/chatbot/${props.agentSlug}`
const { data: agent, error } = await useFetch(url, options)
watch(
  () => error.value,
  (e) => {
    if (e) usePage404()
  },
  { immediate: true }
)

const CHAT_ENDPOINT = computed(() => '/api/chatbot/chat?id=' + agent.value?.id)
onBeforeUnmount(() => {
  chatbotUi.value?.resetChat()
})

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

useLpiHead2({
  title: computed(() => agent.value?.title),
  description: computed(() => agent.value?.description),
})
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
    <div v-if="!isConnected">
      <p class="login-notice">
        {{ $t('agents.need-login') }}
      </p>
      <div class="login-button">
        <LpiButton :label="$t('common.login')" @click="login" />
      </div>
    </div>
    <div v-else>
      <ClientOnly>
        <ChatbotOptions :has-user-context="hasUserContext" />
        <ChatbotUi
          v-if="agent"
          ref="chatbotUi"
          :endpoint="CHAT_ENDPOINT"
          :start-message="agent?.startMessage || ''"
          :context-messages="contextMessages"
        />
      </ClientOnly>
    </div>
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

.login-notice {
  background-color: $primary-lighter;
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
}

.login-button {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
