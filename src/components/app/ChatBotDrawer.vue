<script setup>
import 'deep-chat'
import analytics from '@/analytics'

const { t } = useI18n()

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

const IS_STREAMED = ref(true)

const connectOptions = {
  url: IS_STREAMED.value ? '/api/chat-stream' : '/api/chat',
  stream: IS_STREAMED.value,
}

const chatStyle = ref({
  border: '0 none',
  'flex-grow': '1',
  display: 'flex',
  'flex-direction': 'column',
  'justify-content': 'stretch',
  height: '100%',
  width: '100%',
})

const conversationId = ref(null)
const conversation = useState('chat-box', () => [])
const history = ref([])

const chatBox = useTemplateRef('deep-chat')

const CONVERSATION_LIMIT = 50
const addToConversation = (...args) => {
  conversation.value.push(...args)
  // clamp to last x messages
  if (conversation.value.length > CONVERSATION_LIMIT) {
    conversation.value.splice(0, conversation.value.length - CONVERSATION_LIMIT)
  }
}

const requestInterceptor = (requestDetails) => {
  addToConversation(...requestDetails.body.messages)
  // requestDetails.body.messages = conversation.value
  requestDetails.body.conversationId = conversationId.value
  analytics.chatbot.send(requestDetails.body)
  return requestDetails
}

const responseInterceptor = (response) => {
  console.log('response', response)
  if (!IS_STREAMED.value || response.is_done) {
    // only add complete response, not individual chunks
    addToConversation({
      role: 'assistant',
      text: IS_STREAMED.value ? response.done_text : response.text,
    })
    conversationId.value = response.conversationId
    analytics.chatbot.receive(response)
  }
  return response
}

const placeholderText = computed(() => t('chatbot.input-placeholder'))

watch(
  () => chatBox.value,
  (neo, old) => {
    if (neo && !old) {
      neo.requestInterceptor = requestInterceptor
      neo.responseInterceptor = responseInterceptor
    }
    history.value = JSON.parse(JSON.stringify(conversation.value))
  }
)

const introMessage = computed(() => ({
  text: t('chatbot.intro-message'),
  html: false,
}))

watchEffect(() => {
  if (chatBox.value) {
    chatBox.value.setPlaceholderText(placeholderText.value)
  }
})

const textInputOptions = computed(() => ({
  placeholder: { text: placeholderText.value },
  styles: {
    container: {
      padding: '10px',
      'font-size': '1em',
      'box-sizing': 'border-box',
      width: '100%',
      'border-radius': '6px', // '$border-radius-s',
      background: '#FFF', //'$white',
      border: '1px solid #bdbdbd', // '$border-width-s solid $light-gray',
      color: '#000', // $black
    },
  },
}))

const submitButtonStyles = computed(() => ({
  submit: {
    container: {
      default: {
        padding: '10px',
        'aspect-ratio': '1',
      },
    },
  },
}))

const messageStyles = computed(() => ({
  default: {
    user: {
      background: '#00dba7', // '$primary'
      color: '#000',
    },
    assistant: {
      background: '#bdbdbd', // '$light-gray'
      color: '#000',
    },
  },
}))

const remarkableOptions = ref({ linkify: true, linkTarget: '_blank' })
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="$t('chatbot.title')"
    no-footer
    @close="$emit('close')"
  >
    <deep-chat
      ref="deep-chat"
      :demo="true"
      :textInput="textInputOptions"
      :history="history"
      :style="chatStyle"
      :connect="connectOptions"
      :introMessage="introMessage"
      :avatars="true"
      :submitButtonStyles="submitButtonStyles"
      :messageStyles="messageStyles"
      :stream="IS_STREAMED"
      :remarkable="remarkableOptions"
    ></deep-chat>
  </BaseDrawer>
</template>
