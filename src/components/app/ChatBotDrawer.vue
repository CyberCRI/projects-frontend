<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'

import { SDGS } from '~/functs/constants'
import { shuffle } from 'es-toolkit'
import analytics from '~/analytics'
import 'deep-chat'

const { t } = useNuxtI18n()
const router = useRouter()
const props = defineProps({
  isOpened: { type: Boolean, default: false },
})

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

const emit = defineEmits(['close'])

const CHAT_ENDPOINT = ref(useRuntimeConfig().public.appChatbotBackend || '/api/chat-lg-stream')

const hasUserContext = ref(true)
const hasPageContext = ref(true)

const {
  allowProfile,
  updateAllowProfile,
  allowCurrentPage,
  updateAllowCurrentPage,
  computePageContext,
  contextMessages,
} = useChatbotContext({ hasUserContext, hasPageContext })

const route = useRoute()
const pageContextData = ref('')
const pageContext = computed(() => {
  // keep this out the if so it is registred for reactivity
  const pageData = pageContextData.value
  if (allowCurrentPage.value) return pageData
  else return ''
})
watch(
  () => [props.isOpened, route],
  () => {
    let res = ''
    const pageMeta = route.matched
      .filter((r) => !!r.meta.chatBotContext)
      .map((r) => {
        const chatBotContext = r.meta.chatBotContext as (any) => void
        chatBotContext(route)
      })
      .join('\n')
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
}
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="$t('chatbot.title')"
    no-footer
    @close="$emit('close')"
  >
    <Chatbot
      :endpoint="CHAT_ENDPOINT"
      :context-messages="contextMessages"
      @start-conversation="startConversation"
      @close="$emit('close')"
    >
      <ChatbotOptions :has-user-context="hasUserContext" :has-page-context="hasPageContext" />

      <div style="margin: 1rem; padding: 1rem; background-color: #f3f3f3; border-radius: 10px">
        <p>
          {{ $t('chatbot.intro-message') }}
        </p>
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
    </Chatbot>
  </BaseDrawer>
</template>
