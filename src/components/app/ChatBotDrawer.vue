<script setup>
import 'deep-chat'
import analytics from '@/analytics'
import { shuffle } from 'es-toolkit'

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

defineEmits(['close'])

const CHAT_ENDPOINT = ref(useRuntimeConfig().public.appChatbotBackend || '/api/chat-lg-stream')

const chatbotUi = useTemplateRef('chatbotUi')

const hasUserContext = ref(true)
const hasPageContext = ref(true)

const { computePageContext, contextMessages } = useChatbotContext({
  hasUserContext,
  hasPageContext,
})

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
}

watch(
  () => props.isOpened,
  () => chatbotUi.value?.resetChat()
)
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="$t('chatbot.title')"
    no-footer
    @close="$emit('close')"
  >
    <ChatbotUi
      ref="chatbotUi"
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
    </ChatbotUi>
  </BaseDrawer>
</template>
