<script setup>
import useUsersStore from '~/stores/useUsers'
import { shuffle } from 'es-toolkit'
import analytics from '~/analytics'
import 'deep-chat'

const usersStore = useUsersStore()

const props = defineProps({
  isOpened: { type: Boolean, default: false },
})
const conversationHasBegin = ref(false)
const conversation = ref(null)
const conversationId = ref(null)
const tempKey = ref(Date.now())
const chatbotUiKey = computed(() => conversationId.value || tempKey.value)
function onConversationRestarted() {
  conversation.value = null
  conversationId.value = null
  tempKey.value = Date.now()
  conversationHasBegin.value = false
}

watch(
  () => props.isOpened,
  (neo, old) => {
    if (neo != old) {
      if (neo) {
        analytics.chatbot.open()
      } else {
        analytics.chatbot.close()
      }
    }
  }
)

onErrorCaptured((err) => {
  console.error('ChatBotDrawer error', err)
  analytics.chatbot.error(err.message || err)
  return false
})

defineEmits(['close'])

const CHAT_ENDPOINT = ref(useRuntimeConfig().public.appChatbotBackend || '/api/chat-lg-stream')

const isLoading = ref(false)

const agent = ref({
  id: 0,
  title: '',
  description: '',
  startMessage: '',
  useProfileData: true,
})

const agentList = ref([])

const chatbotUi = useTemplateRef('chatbotUi')

const hasUserContext = ref(true)
const hasPageContext = ref(true)
onMounted(() => {
  if (useRuntimeConfig().public.appHasChatbotPromptDb) {
    ;(async () => {
      isLoading.value = true
      try {
        let headers = {}
        const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
        if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
        const sideAssistant = await $fetch('/api/side-assistant')
        console.log('sideAssisant', sideAssistant)
        if (sideAssistant && sideAssistant.agentId) {
          CHAT_ENDPOINT.value = '/api/chatbot/chat?id=' + sideAssistant.agentId
          agent.value = sideAssistant.agent
          hasUserContext.value = agent.value.useProfileData
        }
        const publicAgents = await $fetch('/api/agent/public-list', { headers })
        console.log('publicAgents', publicAgents)
        agentList.value = publicAgents.filter((publicAgent) => publicAgent.id != agent.value.id)
      } catch (e) {
        console.log(e)
      } finally {
        isLoading.value = false
      }
    })()
  }
})

const { computePageContext, contextMessages } = useChatbotContext({
  hasUserContext,
  hasPageContext,
})

const route = useRoute()
// const pageContextData = ref('')
// const pageContext = computed(() => {
//   // keep this out the if so it is registred for reactivity
//   const pageData = pageContextData.value
//   if (allowCurrentPage.value) return pageData
//   else return ''
// })
// watch(
//   () => [props.isOpened, route],
//   () => {
//     let res = ''
//     const pageMeta = route.matched
//       .filter((r) => !!r.meta.chatBotContext)
//       .map((r) => {
//         const chatBotContext = r.meta.chatBotContext as (any) => void
//         chatBotContext(route)
//       })
//       .join('\n')
//   })
watch(() => [props.isOpened, route], computePageContext, { immediate: true })

const runtimeConfig = useRuntimeConfig()
const chatExemples = (runtimeConfig.public.appChatbotExemples || '')
  .split('§')
  .filter((s) => !!s && s.trim().length)

const setExemples = () => shuffle(chatExemples).slice(0, 3)

const suggestButtons = ref(setExemples())

const startConversation = () => {
  // conversation was reset
  console.log('start conversation')
  suggestButtons.value = setExemples()
  conversationHasBegin.value = true
}

watch(
  () => props.isOpened,
  () => chatbotUi.value?.resetChat()
)

// const contextMessages = computed(() => [
//   {
//     role: 'assistant',
//     text: userContext.value,
//   },
//   {
//     role: 'assistant',
//     text: pageContext.value,
//   },
// ])
//
function onSuggestButtonClick(message) {
  chatbotUi.value.submitUserMessage(message)
}
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="agent?.title || $t('chatbot.title')"
    no-footer
    @close="$emit('close')"
  >
    <div v-if="isLoading" class="loader">
      <LoaderSimple />
    </div>
    <template v-else>
      <details v-if="agentList.length" class="special-agents-access">
        <summary>Looking for a specialized agent ?</summary>
        <ul>
          <li v-for="specialAgent in agentList" :key="specialAgent.id">
            <LinkButton
              btn-icon="ArrowUpRightFromSquare"
              :label="specialAgent.title"
              :title="specialAgent.description?.replace(/<[^>]*?>/gim, '')"
              :to="{ name: 'AgentPage', params: { agentSlug: specialAgent.slug } }"
            />
          </li>
        </ul>
      </details>
      <AgentDescription v-if="!conversationHasBegin" :agent="agent" />
      <ChatbotOptions
        v-if="!conversationHasBegin"
        :has-user-context="hasUserContext"
        :has-page-context="hasPageContext"
      />
      <div v-if="!conversationHasBegin" class="ice-breakers">
        <h4>Here's some ice-breakers:</h4>
        <menu v-if="suggestButtons?.length" class="prompt-suggestions" style="padding-left: 0">
          <li
            v-for="button in suggestButtons"
            :key="button"
            style="list-style-type: none; margin: 0"
          >
            <a class="prompt-suggestion" href="#" @click.prevent="onSuggestButtonClick(button)">
              <IconImage
                class="icon"
                name="ChatBubble"
                style="width: 1.6em; height: 1em; vertical-align: middle; fill: #666"
              />
              {{ button }}
            </a>
          </li>
        </menu>
      </div>
      <ChatbotUi
        ref="chatbotUi"
        :key="chatbotUiKey"
        :endpoint="CHAT_ENDPOINT"
        :context-messages="contextMessages"
        :start-message="agent?.startMessage || $t('chatbot.intro-message')"
        @start-conversation="startConversation"
        @close="$emit('close')"
        @conversation-restarted="onConversationRestarted"
      ></ChatbotUi>
    </template>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  padding-block: 2rem;
}
.special-agents-access {
  text-align: right;
  margin-bottom: 1rem;
  summary {
    color: $primary-dark;
    font-size: 1.2em;
    cursor: pointer;
    font-weight: bold;
  }
  &:open summary {
    text-decoration: underline;
  }
  .link-button {
    margin-top: 0.8rem;
    width: max-content;
    margin-left: auto;
  }
}
.ice-breakers {
  h4 {
    color: $primary-dark;
  }
  margin: 1rem;
  padding: 1rem;
  border: 1px $primary-light solid;
  border-radius: 10px;
}
</style>
