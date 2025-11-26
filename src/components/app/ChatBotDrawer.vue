<script setup>
import 'deep-chat'
import analytics from '@/analytics'
import useUsersStore from '@/stores/useUsers.ts'

const { t } = useI18n()
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

const IS_STREAMED = ref(true)

const connectOptions = {
  url: IS_STREAMED.value ? '/api/chat-stream' : '/api/chat',
  stream: IS_STREAMED.value,
}
const usersStore = useUsersStore()
const accessToken = usersStore.accessToken

if (accessToken) {
  connectOptions.headers = {
    authorization: `Bearer ${accessToken}`,
  }
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

const htmlWrappers = ref({
  default: `
    <div class="my-wrap" onclick="window.handleChatClick(event)">
      <span class="html-wrapper"></span>
    </div>`,
})

const suggestButtons = ref([
  'Tell me about this platform',
  'Find research projects on renewable energy',
  'Find researchers and publication on climate change',
])
function placeCaretAtEnd(el) {
  // https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
  el.focus()
  if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  } else if (typeof document.body.createTextRange != 'undefined') {
    const textRange = document.body.createTextRange()
    textRange.moveToElementText(el)
    textRange.collapse(false)
    textRange.select()
  }
}
const onSuggestButtonClick = (buttonText) => {
  if (chatBox.value) {
    console.log(chatBox.value.textInput)
    const inputBox = chatBox.value.shadowRoot.querySelector('#text-input')
    inputBox.innerText = buttonText
    placeCaretAtEnd(inputBox)
  }
}

watch(
  () => chatBox.value,
  (neo, old) => {
    if (neo && !old) {
      neo.requestInterceptor = requestInterceptor
      neo.responseInterceptor = responseInterceptor
      neo.htmlWrappers = htmlWrappers.value
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

const messageStyles = computed(() => {
  const botStyles = {
    bubble: {
      background: '#f1f1f1', // '$almost-white'
      color: '#000',
    },
  }
  return {
    default: {
      shared: {
        bubble: {
          'font-size': '1rem',
          padding: '1rem',
        },
        outerContainer: {
          padding: '0',
        },
        innerContainer: {
          padding: '0',
          width: 'auto',
        },
      },
      user: {
        bubble: {
          background: '#1d727c', // '$primary-dark'
          color: '#fff',
        },
      },
      assistant: botStyles,
      ai: botStyles,
    },
  }
})

const handleChatClick = (evt) => {
  // short-circuit target blank for internal links in chatbot messages
  if (
    evt.target.tagName === 'A' &&
    !!evt.target.closest('.deep-chat-outer-container-role-assistant')
  ) {
    const href = evt.target.getAttribute('href')
    const origin = window.location.origin
    if ((!href.startsWith('http') || href.startsWith(origin)) && !href.startsWith('email:')) {
      evt.preventDefault()
      router.push({ path: href })
      emit('close')
    }
  }
}

if (window && !window.handleChatClick) {
  window.handleChatClick = handleChatClick
}

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
      :customButtons="customButtons"
      auxiliaryStyle="
        a {
          color: #1d727c;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline !important;
        }
        .html-wrapper img {
          max-width: 8rem;
          max-height: 8rem;
          border-radius: .5rem;
        }
      "
    ></deep-chat>
    <div class="prompt-suggestions">
      <a
        v-for="button in suggestButtons"
        :key="button"
        class="prompt-suggestion"
        href="#"
        @click.prevent="onSuggestButtonClick(button)"
      >
        {{ button }}
      </a>
    </div>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.prompt-suggestions {
  .prompt-suggestion {
    background-color: #eee;
    border-radius: 4px;
    padding: 4px;
    color: #666;
    line-height: 36px;
    font-size: 0.8rem;
  }

  .prompt-suggestion ~ .prompt-suggestion {
    margin-left: 8px;
  }
}
</style>
