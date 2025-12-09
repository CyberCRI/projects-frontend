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

const spinner = `
<svg
    class="loader-simple"
    width="20"
    height="20"
    viewBox="0 0 99 99"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
  <defs>
        <style type="text/css"><![CDATA[
            @-webkit-keyframes spin {
              from {
                -webkit-transform: rotate(0deg)
              }
              to {
                -webkit-transform: rotate(-359deg)
              }
            }
            @keyframes spin {
              from {
                transform: rotate(0deg)
              }
              to {
                transform: rotate(-359deg)
              }
            }
            svg {
                -webkit-transform-origin: 50% 50%;
                -webkit-animation: spin 1.5s linear infinite;
                -webkit-backface-visibility: hidden;
                animation: spin 1.5s linear infinite;
            }
        ]]></style>
    </defs>
    <path
      d="M21.2998 81.9326C26.0817 86.0995 31.8631 89.2684 38.4025 91.0206C61.3415 97.1671 84.92 83.554 91.0665 60.615C91.0872 60.5377 91.125 60.4693 91.1746 60.413C91.8385 57.8685 92.2752 55.2322 92.4616 52.5271C92.5756 50.8742 93.9078 49.5266 95.5647 49.5266C97.2215 49.5266 98.5742 50.8732 98.4743 52.5271C96.924 78.1917 75.6191 98.5266 49.5647 98.5266C37.7559 98.5266 26.9228 94.3494 18.4623 87.3919C14.368 84.032 10.8729 80.047 8.08485 75.6235C1.05722 64.4738 -1.47882 50.5382 2.20133 36.8037C8.9447 11.637 34.1008 -3.67888 59.2922 1.46613C60.9155 1.79768 61.8662 3.45281 61.4374 5.05321C61.0085 6.6536 59.3621 7.5917 57.736 7.27394C55.0744 6.75383 52.4145 6.49328 49.7845 6.47604C49.7181 6.50843 49.6434 6.52661 49.5647 6.52661C25.8164 6.52661 6.56469 25.7784 6.56469 49.5266C6.56469 62.4546 12.2699 74.0501 21.2998 81.9326Z"
      fill="#00DBA7"
    />
  </svg>`

const spinnerMD = `![](data:image/svg+xml;base64,${btoa(spinner)}) `

// to handle 'meta' messages get replaced by next message
let replacedByNext = false
const responseInterceptor = (response) => {
  if (response.role === 'meta') {
    let text = spinnerMD + t(`chatbot.${response.text}`)
    if (response.is_done) {
      text = ''
    }
    replacedByNext = true
    return {
      text: text,
      role: 'meta',
      overwrite: true,
    }
  }
  if (!IS_STREAMED.value || response.is_done) {
    // only add complete response, not individual chunks
    addToConversation({
      role: 'assistant',
      text: IS_STREAMED.value ? response.done_text : response.text,
    })
    conversationId.value = response.conversationId
    analytics.chatbot.receive(response)
  }
  const overwrite = replacedByNext
  // no way to know when a true message begin, so just assume next is not overwrite
  replacedByNext = false
  return { ...response, overwrite }
}

const placeholderText = computed(() => t('chatbot.input-placeholder'))

const htmlWrappers = ref({
  default: `
    <div class="my-wrap" onclick="window.handleChatClick(event)">
      <span class="html-wrapper"></span>
    </div>`,
})

const runtimeConfig = useRuntimeConfig()
const chatExemples = (runtimeConfig.public.appChatbotExemples || '')
  .split('§')
  .filter((s) => !!s && s.trim().length)
const suggestButtons = ref(chatExemples)

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
      meta: botStyles,
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

const resetChat = () => {
  conversation.value = []
  conversationId.value = null
  history.value = []
  if (chatBox.value) {
    chatBox.value.resetChat()
  }
  analytics.chatbot.reset()
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
    <deep-chat
      ref="deep-chat"
      :textInput="textInputOptions"
      :history="history"
      :style="chatStyle"
      :connect="connectOptions"
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
    >
      <div
        style="
          margin: 1rem;
          padding: 1rem;
          background-color: #f3f3f3;
          border-radius: 10px;
          padding: 12px;
          padding-bottom: 15px;
          display: none;
        "
      >
        <p>
          {{ $t('chatbot.intro-message') }}
        </p>
        <ul v-if="suggestButtons?.length" class="prompt-suggestions">
          <li v-for="button in suggestButtons" :key="button">
            <a class="prompt-suggestion" href="#" @click.prevent="onSuggestButtonClick(button)">
              {{ button }}
            </a>
          </li>
        </ul>
      </div>
    </deep-chat>
    <div class="action-bar">
      <a class="action-button" href="#" @click.prevent="resetChat()">Reset Chat</a>
    </div>
  </BaseDrawer>
</template>
<style lang="scss" scoped>
.action-bar {
  text-align: right;
  .action-button {
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
