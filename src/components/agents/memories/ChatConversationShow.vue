<script setup>
import { formatDateTime } from '~/functs/date'
import useUsersStore from '@/stores/useUsers'
import { Remarkable } from 'remarkable'

const { locale } = useNuxtI18n()

const prettyDate = (s) => formatDateTime(new Date(s), locale.value)

const md = new Remarkable()
function renderMd(s) {
  try {
    return md.render(s)
  } catch {
    return s
  }
}

const usersStore = useUsersStore()

// documentTitle is thread_id
const props = defineProps({
  documentTitle: { type: String, required: true },
})
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const close = () => emit('close')

const conversation = ref(null)
const more = ref(null)

const LIMIT = 20

const query = ref({
  limit: LIMIT,
  cursor: undefined,
})

function getPreviousMessages() {
  if (more.value) query.value.cursor = more.value
}

function fetchAll() {
  return useFetch(`/api/chat-conversation/${props.documentTitle}`, {
    headers,
    query,
  })
}
const { data, status /* , error */, refresh } = fetchAll()
const isAsyncing = computed(() => status.value === 'pending')

watch(data, (d) => {
  console.log('watch data', d)
  if (!d) return
  if (more.value && conversation.value)
    conversation.value.messages.push(...(d.conversation.messages || []))
  else conversation.value = d.conversation
  more.value = d.more
})

const displayableMessages = computed(() => [...(conversation.value?.messages || [])].reverse())

function isOpen(message) {
  return message.role != 'tool' && message.content != ''
}

const prettyTitle = computed(() =>
  conversation.value
    ? `${conversation.value?.agent?.title} - ${conversation.value?.title} - User #${conversation.value?.userId} - ${prettyDate(conversation.value?.lastActiveAt)}`
    : 'Loading...'
)

function tryParse(x) {
  try {
    return JSON.parse(x)
  } catch {
    return undefined
  }
}

// tool results come in several shapes: plain JSON, `{ text: "<json>" }`,
// or an array of `{ type: 'text', text }` blocks. Always returns plain text.
function showToolContent(s) {
  let value = s
  // unwrap (bounded, in case of nested wrappers)
  for (let i = 0; i < 5; i++) {
    if (typeof value === 'string') {
      const parsed = tryParse(value)
      if (parsed === undefined) break
      value = parsed
    } else if (Array.isArray(value) && value.length && value.every((b) => b?.type === 'text')) {
      value = value.map((b) => b.text).join('\n')
    } else if (value && typeof value.text === 'string' && Object.keys(value).length <= 2) {
      value = value.text
    } else {
      break
    }
  }
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
}

function evaluationToDetails(markdown) {
  return markdown.replaceAll(
    /<evaluation>([\s\S]*?)<\/evaluation>/g,
    (_match, content) => '\n```evaluation\n' + content.trim() + '\n```\n'
  )
}

refresh()
</script>
<template>
  <ConfirmModal
    :title="prettyTitle"
    :asyncing="isAsyncing"
    no-second-button
    :cancel-button-label="$t('common.close')"
    @cancel="close"
    @confirm="close"
  >
    <div v-if="!more && isAsyncing" class="loader">
      <LoaderSimple />
    </div>
    <div v-else>
      <LpiButton
        v-if="more"
        secondary
        class="small more-button"
        :disabled="isAsyncing"
        :btn-icon="isAsyncing ? 'LoaderSimple' : 'ChevronUp'"
        :label="$t('chatbot.previous-messages')"
        @click="getPreviousMessages"
      />
      <details
        v-for="message in displayableMessages"
        :key="message.id"
        class="message"
        :open="isOpen(message)"
      >
        <summary>
          <strong class="message.role">
            {{ message.position }} - {{ message.role }}
            <span v-if="message.toolCalls?.length">(Tool requests)</span>
            <template v-if="message.role == 'tool'">
              <span v-if="message.toolCallId?.startsWith('retriever_user_context')">
                (User context)
              </span>
              <span v-else-if="message.toolCallId?.startsWith('retriever_')">(Retriever)</span>
              <span v-else>(Result)</span>
            </template>
          </strong>
          <em>{{ prettyDate(message.createdAt) }}</em>
        </summary>
        <div class="message-content">
          <details v-if="message.reasoning" class="reasoning">
            <summary>Reasoning</summary>
            <div v-html="renderMd(message.reasoning)" />
          </details>
          <pre v-if="message.role == 'tool' && !message.toolCallId?.startsWith('retriever_')">{{
            showToolContent(message.content)
          }}</pre>
          <div v-else v-html="renderMd(evaluationToDetails(message.content))" />
          <ul v-if="message.toolCalls">
            <li v-for="tool_call in message.toolCalls" :key="tool_call.id">
              <pre>{{ JSON.stringify(tool_call, null, 2) }}</pre>
            </li>
          </ul>
        </div>
      </details>
    </div>
  </ConfirmModal>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.chunk {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.chunk ~ .chunk {
  border-top: 1px solid variables.$light-gray;
}

.chunk-header {
  text-align: center;
  color: variables.$light-gray;
  font-style: italic;
  font-weight: normal;
}

.loader {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}

.message {
  margin-block: 1rem;
}

.message-header {
  width: auto;
  padding: 0.4rem;
  background-color: variables.$primary-lighter;
  border-bottom: 1px solid variables.$primary-dark;
  text-align: center;
}

summary {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: variables.$primary-dark;
  background-color: variables.$primary-lighter;
  font-size: 1.16em;
  cursor: pointer;

  em {
    font-size: 0.8em;
    color: #666;
  }
}

.message-content {
  margin-left: 1rem;

  pre {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-x: auto;
  }
}

.reasoning {
  margin-bottom: 0.5rem;
  color: #666;
  font-style: italic;

  summary {
    justify-content: flex-start;
    align-items: center;
    font-size: 1em;
    font-style: normal;
    background-color: transparent;

    // the native marker is hidden by display:flex, so draw a chevron
    &::before {
      content: '';
      flex-shrink: 0;
      width: 0.45em;
      height: 0.45em;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(-45deg); // collapsed: points right
      transition: transform 0.15s;
    }
  }

  &[open] > summary::before {
    transform: rotate(45deg); // expanded: points down
  }
}

.more-button {
  margin: 0 auto;
}

:deep(.language-evaluation) {
  padding-left: 1rem;
  margin-left: 1rem;
  position: relative;
  text-wrap: wrap;
  display: block;
  color: #999;
  border-left: 1px solid variables.$primary-dark;

  &::before {
    display: inline-block;
    content: 'Evaluation';
    font-size: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: right bottom;
    transform: translateX(-100%) rotate(-90deg);
    color: variables.$primary-dark;
    font-weight: 700;
  }
}
</style>
