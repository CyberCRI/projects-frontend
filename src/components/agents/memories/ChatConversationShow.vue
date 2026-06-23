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
  return useFetch(`/api/chat-conversation/${props.documentTitle}`, { headers, query })
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

function showToolContent(s) {
  // console.log(s)
  try {
    const o = JSON.parse(s)
    return JSON.stringify(JSON.parse(o.text), null, 2)
  } catch {
    return renderMd(s)
  }
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
          <pre v-if="message.role == 'tool' && !message.toolCallId?.startsWith('retriever_')">
            {{ showToolContent(message.content) }}
          </pre>
          <div v-else v-html="renderMd(message.content)" />
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
.chunk {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.chunk ~ .chunk {
  border-top: 1px solid $light-gray;
}

.chunk-header {
  text-align: center;
  color: $light-gray;
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
  background-color: $primary-lighter;
  border-bottom: 1px solid $primary-dark;
  text-align: center;
}

summary {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: $primary-dark;
  background-color: $primary-lighter;
  font-size: 1.16em;
  em {
    font-size: 0.8em;
    color: #666;
  }
}

.message-content {
  margin-left: 1rem;
}

.more-button {
  margin: 0 auto;
}
</style>
