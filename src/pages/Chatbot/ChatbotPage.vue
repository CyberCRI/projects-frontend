<script setup>
import { formatDateTime } from '~/functs/date'

import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
// import useLoadingFromStatus from '@/composables/useLoadingFromStatus'
import useUsersStore from '@/stores/useUsers'

const props = defineProps({ agentSlug: { type: String, required: true } })

const { locale } = useNuxtI18n()

const prettyDate = (s) => formatDateTime(new Date(s), locale.value)
const prettyTitle = (conversation) =>
  conversation ? `${conversation.title} - ${prettyDate(conversation.lastActiveAt)}` : 'Loading...'

// type Params = Parameters<typeof useFetch>
const usersStore = useUsersStore()
const isConnected = computed(() => usersStore.isConnected)

if (!useRuntimeConfig().public.appHasChatbotPromptDb) {
  usePage404()
}

function scrollToTop() {
  const element = document.querySelector('[name=chat-conversation-top]')
  element?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function scrollToBottom() {
  const element = document.querySelector('[name=chat-conversation-bottom]')
  element?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}

function toConversationEnd() {
  nextTick(() => {
    console.log('to end', renderTriggeredBy.value)
    if (renderTriggeredBy.value == 'previous-messages') {
      scrollToTop()
    } else {
      scrollToBottom()
    }
  })
}

const login = () => {
  goToKeycloakLoginPage()
}

const renderTriggeredBy = ref('initial')

const chatbotUi = useTemplateRef('chatbotUi')

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')

if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = {
  headers,
  server: false, // ⚠️ Crucial: Skips server execution
}

const more = ref(null)
const LIMIT = 30

const query = ref({
  limit: LIMIT,
  cursor: undefined,
})

const url = `/api/chatbot/${props.agentSlug}`
const { data, error } = await useFetch(url, { ...options, query: { limit: LIMIT } }) // query is used for conversation only and would retrigger the full chat relaod

const agent = computed(() => data.value?.agent)
const conversation = ref(null)
const conversationId = ref(null)
const tempKey = ref(Date.now())

function onConversationRestarted() {
  renderTriggeredBy.value = 'restart'
  conversation.value = null
  conversationId.value = null
  tempKey.value = Date.now()
}
const allConversations = ref([])
const allConversationOptions = computed(() => [
  ...allConversations.value.map((c) => ({
    label: prettyTitle(c),
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
    more.value = data.value?.more || null
    allConversations.value = data.value?.allConversations || []
    nextTick(toConversationEnd)
  }
)

function getPreviousMessages() {
  if (more.value) {
    renderTriggeredBy.value = 'previous-messages'
    query.value.cursor = more.value
  }
}

watch(conversationId, (neo, old) => {
  if (neo != old) {
    renderTriggeredBy.value = 'conversation-change'
    more.value = null
    query.value = {
      limit: LIMIT,
      cursor: undefined,
    }
  }
})

const { data: conversationData, status: conversationStatus } = await useFetch(
  () =>
    (props.agentSlug &&
      conversationId.value &&
      `/api/chatbot/${props.agentSlug}/conversation/${conversationId.value}`) ||
    null,
  { ...options, query }
)

const isLoadingConversation = computed(() => conversationStatus.value == 'pending')

watch(conversationData, (cData) => {
  // console.log('cData', cData)
  if (!cData) return
  if (conversationId.value) {
    if (cData?.conversation) {
      if (more.value && conversation.value) {
        renderTriggeredBy.value = 'previous-messages'
        conversation.value.messages.push(...(cData.conversation.messages || []))
      } else {
        renderTriggeredBy.value = 'new-conversation'
        conversation.value = cData.conversation
      }
      more.value = cData.more
    } else {
      // TODO toaster
      console.error('Conversation not found')
      conversationId.value = null
      more.value = null
    }
  } else {
    conversationId.value = null
    more.value = null
  }
})

const displayableMessages = computed(() => [...(conversation.value?.messages || [])].reverse())

const history = computed(() => {
  const h = displayableMessages.value || []
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

const chatbotUiKey = computed(
  () =>
    (conversationId.value && `${conversationId.value}---${more.value || 'full'}`) || tempKey.value
)

// const loading = useLoadingFromStatus(status)

const hasUserContext = computed(() => !!agent.value?.useProfileData)
const hasPageContext = ref(false)
const contextMessageRole = 'retriever'
const { contextMessages } = useChatbotContext({
  hasUserContext,
  hasPageContext,
  contextMessageRole,
})

const showConversationList = ref(false)
const route = useRoute()
watch(
  () => route.hash,
  (neo) => {
    showConversationList.value = neo === '#show-list'
  },
  { immediate: true }
)

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

      <AgentDescription :agent="agent" />
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
      <div class="scrollers">
        <ContextActionButton action-icon="ChevronUp" @click="scrollToTop" />

        <ContextActionButton action-icon="ChevronDown" @click="scrollToBottom" />
      </div>
      <a name="chat-conversation-top"></a>
      <ClientOnly>
        <!--div v-if="conversation">
          <h4>{{ conversation.title }}</h4>
          <pre>
            {{ JSON.stringify(history, null, 2) }}
          </pre>
          </div-->

        <div v-if="showConversationList">
          Conversations:
          <LpiSelect v-model="conversationId" :options="allConversationOptions" />
        </div>
        <ChatbotOptions :has-user-context="hasUserContext" />
        <div
          v-if="isLoadingConversation && renderTriggeredBy != 'previous-messages'"
          id="show-list"
          class="conversation-is-loading"
        >
          <LoaderSimple />
        </div>
        <LpiButton
          v-if="more"
          secondary
          class="small more-button"
          :disabled="isLoadingConversation"
          :btn-icon="isLoadingConversation ? 'LoaderSimple' : 'ChevronUp'"
          :label="$t('chatbot.previous-messages')"
          @click="getPreviousMessages"
        />
        <ChatbotUi
          v-if="more || !isLoadingConversation"
          ref="chatbotUi"
          :key="chatbotUiKey"
          :endpoint="CHAT_ENDPOINT"
          :start-message="agent?.startMessage || ''"
          :context-messages="contextMessages"
          :history="history"
          :conversation-id="threadId"
          @conversation-restarted="onConversationRestarted"
          @on-component-render="toConversationEnd"
        />
      </ClientOnly>
      <a name="chat-conversation-bottom"></a>
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

.agent-description {
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

.more-button {
  margin: 0 auto;
}

.scrollers {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.6rem;
  width: min-content;
  position: fixed;
  bottom: 3rem;
  right: 1rem;
}
</style>
