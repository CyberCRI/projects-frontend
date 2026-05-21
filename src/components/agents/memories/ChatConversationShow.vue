<script setup>
import useUsersStore from '@/stores/useUsers'
import { Remarkable } from 'remarkable'

const md = new Remarkable()
function renderMd(s) {
  return md.render(s)
}

const usersStore = useUsersStore()

// documentTitle is thread_id
const props = defineProps({ documentTitle: { type: String, required: true } })
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const close = () => emit('close')

function fetchAll() {
  return useFetch(`/api/chat-conversation/${props.documentTitle}`, { headers })
}
const { data: conversation, status /* , error */, refresh } = fetchAll()
const isAsyncing = computed(() => status.value === 'pending')

function isOpen(message) {
  return message.role != 'tool' && message.content != ''
}

function showToolContent(s) {
  console.log(s)
  const o = JSON.parse(s)
  return JSON.stringify(JSON.parse(o.text), null, 2)
}
refresh()
</script>
<template>
  <ConfirmModal
    :title="documentTitle"
    :asyncing="isAsyncing"
    no-second-button
    :cancel-button-label="$t('common.close')"
    @cancel="close"
    @confirm="close"
  >
    <div v-if="isAsyncing" class="loader">
      <LoaderSimple />
    </div>
    <div v-else>
      <details
        v-for="message in conversation.messages"
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
  color: $primary-dark;
  background-color: $primary-lighter;
  font-size: 1.16em;
}

.message-content {
  margin-left: 1rem;
}
</style>
