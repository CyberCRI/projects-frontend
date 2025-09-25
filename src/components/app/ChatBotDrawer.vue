<script setup>
import 'deep-chat'
// import { Chat } from "@ai-sdk/vue";

defineProps({
  isOpened: { type: Boolean, default: false },
})

defineEmits(['close'])

// const chat = new Chat({});

const connectOptions = {
  url: '/api/chat',
  //   method: 'websocket',
  //   headers: { customName: 'customHeaderValue' },
  //   additionalBodyProps: { customBodyField: 'customBodyValue' },
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
  requestDetails.body.messages = conversation.value
  return requestDetails
}

const responseInterceptor = (response) => {
  addToConversation({ role: 'assistant', text: response.text })
  return response
}

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
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    title="Chat with AI"
    no-footer
    @close="$emit('close')"
  >
    <deep-chat
      ref="deep-chat"
      :demo="true"
      :text-input="{ placeholder: { text: 'Welcome to the demo!' } }"
      :history="history"
      :style="chatStyle"
      :connect="connectOptions"
    />
  </BaseDrawer>
</template>

<style></style>
