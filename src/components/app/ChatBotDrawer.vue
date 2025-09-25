<script setup>
import { use } from 'chai'
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

const requestInterceptor = (requestDetails) => {
  console.log(requestDetails) // printed above
  console.log('history', history.value)

  conversation.value.push(...requestDetails.body.messages)
  requestDetails.body.messages = conversation.value
  return requestDetails
}

const responseInterceptor = (response) => {
  console.log(response) // printed above
  conversation.value.push({ role: 'assistant', text: response.text })
  return response
}

watch(
  () => chatBox.value,
  (neo, old) => {
    if (neo && !old) {
      // console.log('chatBox', neo)
      neo.requestInterceptor = requestInterceptor
      neo.responseInterceptor = responseInterceptor
    } /*else {
      console.error('chatBox is null')
    }*/
    history.value = JSON.parse(JSON.stringify(conversation.value))
  }
)

// onMounted(() => {
//   if (chatBox.value) {
//     console.log('chatBox', chatBox.value)
//     chatBox.value.requestInterceptor = requestInterceptor
//   } else {
//     console.error('chatBox is null')
//   }
// })
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
