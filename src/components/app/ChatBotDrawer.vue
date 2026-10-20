<script setup>
import useUsersStore from '~/stores/useUsers'
import { shuffle } from 'es-toolkit'
import analytics from '~/analytics'
import 'deep-chat'

const usersStore = useUsersStore()

const props = defineProps({
  isOpened: { type: Boolean, default: false },
})

const conversation = ref(null)
const conversationId = ref(null)
const conversationHasBegin = ref(false)
const tempKey = ref(Date.now())

function onConversationRestarted() {
  conversation.value = null
  conversationId.value = null
  tempKey.value = Date.now()
  conversationHasBegin.value = false
}

onErrorCaptured((err) => {
  console.error('ChatBotDrawer error', err)
  analytics.chatbot.error(err.message || err)
  return false
})

defineEmits(['close'])

const DEFAULT_ENDPOINT = useRuntimeConfig().public.appChatbotBackend || '/api/chat-lg-stream'
const CHAT_ENDPOINT = ref(DEFAULT_ENDPOINT)

const isLoading = ref(false)

const DEFAULT_AGENT_FACTORY = () => ({
  id: 0,
  title: '',
  description: '',
  startMessage: '',
  useProfileData: true,
})
const agent = ref(DEFAULT_AGENT_FACTORY())

const agentList = ref([])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')

if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const options = {
  headers,
  server: false, // ⚠️ Crucial: Skips server execution
}

const chatbotUi = useTemplateRef('chatbotUi')

const hasUserContext = ref(true)
const hasPageContext = ref(true)

const more = ref(null)
const LIMIT = 30

const DEFAULT_QUERY = () => ({
  limit: LIMIT,
  cursor: undefined,
})

const query = ref(DEFAULT_QUERY())

const chatbotUiKey = computed(
  () =>
    (conversationId.value &&
      `${conversationId.value}---${more.value || 'full'}---${tempKey.value}`) ||
    tempKey.value
)

const {
  data: conversationData,
  status: conversationStatus,
  execute: executeFetchConversation,
} = useFetch(() => `/api/chatbot/${agent.value.slug}/conversation/${conversationId.value}`, {
  ...options,
  query,

  immediate: false,
})
const isLoadingConversation = computed(() => conversationStatus.value == 'pending')

const loadAssistant = async () => {
  if (useRuntimeConfig().public.appHasChatbotPromptDb) {
    isLoading.value = true
    more.value = null
    try {
      let headers = {}
      const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
      if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
      const { sideAssistant, lastConversation } = await $fetch(
        '/api/side-assistant?withLastConversation=true',
        { headers }
      )
      if (lastConversation) {
        conversation.value = lastConversation
        conversationId.value = lastConversation.id

        conversationHasBegin.value = true
        executeFetchConversation()
      }

      if (sideAssistant && sideAssistant.agentId) {
        CHAT_ENDPOINT.value = '/api/chatbot/chat?id=' + sideAssistant.agentId
        agent.value = sideAssistant.agent
        hasUserContext.value = agent.value.useProfileData
      } else {
        CHAT_ENDPOINT.value = DEFAULT_ENDPOINT
        agent.value = DEFAULT_AGENT_FACTORY()
        hasUserContext.value = true
      }
      const publicAgents = await $fetch('/api/agent/public-list', { headers })
      agentList.value = publicAgents.filter((publicAgent) => publicAgent.id != agent.value.id)
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }
}

watch(conversationData, (cData) => {
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
      tempKey.value = Date.now()
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

const renderTriggeredBy = ref('initial')
function getPreviousMessages() {
  if (more.value) {
    renderTriggeredBy.value = 'previous-messages'
    query.value.cursor = more.value
  }
}

const contextMessageRole = 'retriever'
const { computePageContext, contextMessages, filterContextMesssages } = await useChatbotContext({
  hasUserContext,
  hasPageContext,
  contextMessageRole,
})

const displayableMessages = computed(() =>
  [...(conversation.value?.messages || [])].filter(filterContextMesssages).reverse()
)

const history = computed(() => {
  const h = displayableMessages.value || []
  return h.map((message) => {
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

const { translateAgent, translateAgents } = useAutoTranslate()
const translatedAgent = translateAgent(agent)
const translatedAgentList = translateAgents(agentList)

watch(
  () => props.isOpened,
  (neo, old) => {
    if (neo != old) {
      if (neo) {
        conversationHasBegin.value = false
        conversation.value = []
        conversationId.value = null
        agent.value = DEFAULT_AGENT_FACTORY()
        tempKey.value = Date.now()
        query.value = DEFAULT_QUERY()
        loadAssistant()
        analytics.chatbot.open()
      } else {
        analytics.chatbot.close()
      }
    }
  }
)

const route = useRoute()

watch(() => [props.isOpened, route], computePageContext, { immediate: true })

const runtimeConfig = useRuntimeConfig()
const chatExemples = (runtimeConfig.public.appChatbotExemples || '')
  .split('§')
  .filter((s) => !!s && s.trim().length)

const setExemples = () => shuffle(chatExemples).slice(0, 3)

const suggestButtons = ref(setExemples())

const startConversation = () => {
  // conversation was reset
  suggestButtons.value = setExemples()
  conversationHasBegin.value = true
}

watch(
  () => props.isOpened,
  () => chatbotUi.value?.resetChat()
)

function onSuggestButtonClick(message) {
  chatbotUi.value.submitUserMessage(message)
}
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="translatedAgent?.$t.title || $t('chatbot.title')"
    no-footer
    @close="$emit('close')"
  >
    <div
      v-if="isLoading || (isLoadingConversation && renderTriggeredBy != 'previous-messages')"
      class="loader"
    >
      <LoaderSimple />
    </div>
    <template v-else>
      <AgentQuickAccess
        :title="$t('assistant-drawer.special-agents')"
        :agent-list="translatedAgentList"
      />
      <AgentDescription v-if="!conversationHasBegin" :agent="translatedAgent" />
      <ChatbotOptions
        v-if="!conversationHasBegin"
        :has-user-context="hasUserContext"
        :has-page-context="hasPageContext"
      />
      <div v-if="!conversationHasBegin && suggestButtons?.length" class="ice-breakers">
        <h4>{{ $t('assistant-drawer.ice-breakers') }}</h4>
        <menu class="prompt-suggestions" style="padding-left: 0">
          <li v-for="button in suggestButtons" :key="button" class="suggestion">
            <a class="prompt-suggestion" href="#" @click.prevent="onSuggestButtonClick(button)">
              <IconImage class="icon" name="ChatBubble" />
              {{ button }}
            </a>
          </li>
        </menu>
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
        ref="chatbotUi"
        :key="chatbotUiKey"
        :endpoint="CHAT_ENDPOINT"
        :context-messages="contextMessages"
        :start-message="translatedAgent?.$t.startMessage || $t('chatbot.intro-message')"
        :agent-slug="agent.slug"
        :history="history"
        :conversation-id="threadId"
        :real-conversation-id="conversationId"
        @start-conversation="startConversation"
        @close="$emit('close')"
        @conversation-restarted="onConversationRestarted"
      />
    </template>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.loader {
  display: flex;
  justify-content: center;
  padding-block: 2rem;
}

.ice-breakers {
  h4 {
    color: variables.$primary-dark;
  }

  margin: 1rem;
  padding: 1rem;
  border: 1px variables.$primary-light solid;
  border-radius: 10px;
}

.suggestion {
  list-style-type: none;
  margin: 0;

  .icon {
    width: 1.6em;
    height: 1em;
    vertical-align: middle;
    fill: #666;
  }
}
</style>
