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

function toConversationEnd() {
  nextTick(() => {
    const element = document.querySelector('.chat-conversation-bottom')
    console.log('scrollIntoView', element)
    element?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  })
}

const login = () => {
  goToKeycloakLoginPage()
}

const chatbotUi = useTemplateRef('chatbotUi')

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')

if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = {
  headers,
  server: false, // ⚠️ Crucial: Skips server execution
}

const url = `/api/chatbot/${props.agentSlug}`
const { data, error } = await useFetch(url, options)

const agent = computed(() => data.value?.agent)
const conversation = ref(null)
const conversationId = ref(null)
function onConversationRestarted() {
  conversation.value = null
}
const allConversations = ref([])
const allConversationOptions = computed(() => [
  ...allConversations.value.map((c) => ({
    label: c.title,
    value: c.id,
  })),
  {
    label: 'New conversation',
    value: null,
  },
])
watch(
  () => data.value,
  () => {
    conversation.value = data.value?.lastConversation || null
    conversationId.value = data.value?.lastConversation?.id || null
    allConversations.value = data.value?.allConversations || []
    nextTick(toConversationEnd)
  }
)

const isLoadingConversation = ref(false)
watch(
  () => conversationId.value,
  async (neo, old) => {
    console.log('conversationId', neo, old)
    if (neo !== old) {
      if (neo) {
        isLoadingConversation.value = true
        try {
          const url = `/api/chatbot/${props.agentSlug}/conversation/${neo}`
          const { data, error } = await useFetch(url, options)
          if (data.value?.conversation) {
            conversation.value = data.value?.conversation
          } else {
            // TODO toaster
            console.error('Coversation not found')
            conversationId.value = old
          }
        } finally {
          isLoadingConversation.value = false
        }
      } else {
        console.log('resetting')
        conversation.value = null
        nextTick(toConversationEnd)
      }
    }
  }
)
const history = computed(() => {
  const h = conversation.value?.messages || []
  return h.map((message) => {
    console.log(message)
    return {
      role: message.role,
      text: message.content,
      custom: {
        id: message.id,
      },
    }
  })
})
const threadId = computed(() => conversation.value?.threadId || null)
watch(
  () => error.value,
  (e) => {
    if (e) usePage404()
  },
  { immediate: true }
)

watch(
  () => [conversationId.value, isLoadingConversation.value],
  (neo) => {
    if (!neo[1]) nextTick(() => chatbotUi.value?.scrollToBottom())
  }
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
    <div v-else-if="agent">
      <ClientOnly>
        <!--div v-if="conversation">
          <h4>{{ conversation.title }}</h4>
          <pre>
            {{ JSON.stringify(history, null, 2) }}
          </pre>
          </div-->

        <div>
          Conversations:
          <LpiSelect v-model="conversationId" :options="allConversationOptions" />
        </div>
        <ChatbotOptions :has-user-context="hasUserContext" />
        <div v-if="isLoadingConversation" class="conversation-is-loading">
          <LoaderSimple />
        </div>
        <ChatbotUi
          v-else
          ref="chatbotUi"
          :key="conversationId"
          :endpoint="CHAT_ENDPOINT"
          :start-message="agent?.startMessage || ''"
          :context-messages="contextMessages"
          :history="history"
          :conversation-id="threadId"
          @conversation-restarted="onConversationRestarted"
          @on-component-render="toConversationEnd"
        />
      </ClientOnly>
      <span class="chat-conversation-bottom"></span>
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
.conversation-is-loading {
  padding: 3rem 0;
  display: flex;
  justify-content: center;
}
</style>
