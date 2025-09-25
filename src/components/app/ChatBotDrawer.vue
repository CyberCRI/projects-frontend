<script setup>
import 'deep-chat'
// import { Chat } from "@ai-sdk/vue";

defineProps({
  isOpened: { type: Boolean, default: false },
})

defineEmits(['close'])

// const chat = new Chat({});

const history = ref([
  //   { role: 'user', text: 'Hey, how are you today?' },
  //   { role: 'ai', text: 'I am doing very well!' },
])

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
      :demo="true"
      :text-input="{ placeholder: { text: 'Welcome to the demo!' } }"
      :history="history"
      :style="chatStyle"
      :connect="connectOptions"
    />
  </BaseDrawer>
</template>

<style></style>
