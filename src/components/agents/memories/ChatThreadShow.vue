<script setup>
import useUsersStore from '@/stores/useUsers'

const usersStore = useUsersStore()

// documentTitle is thread_id
const props = defineProps({ documentTitle: { type: String, required: true } })
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const close = () => emit('close')

function fetchAll() {
  return useFetch(`/api/chat-thread/${props.documentTitle}`, { headers })
}
const { data: checkpoints, status, error, refresh } = await fetchAll()
const isAsyncing = computed(() => status.value === 'pending')

const showMessage = (message) => {
  return (
    message.id[message.id.length - 1] != 'ToolMessage' &&
    (message.kwargs.content || message.kwargs.tool_calls?.length)
  )
}
</script>
<template>
  <ConfirmModal
    :title="documentTitle"
    :asyncing="isAsyncing"
    no-second-button
    cancel-button-label="common.close"
    @cancel="close"
    @confirm="close"
  >
    <div v-if="isAsyncing" class="loader">
      <LoaderSimple />
    </div>
    <ul v-else>
      <div v-for="(checkpoint, i) in checkpoints" :key="i" class="chunk">
        <h4 class="chunk-header">Checkpoint {{ i + 1 }}/{{ checkpoints.length }}</h4>
        <div v-for="message in checkpoint.messages" :key="message.kwargs.id">
          <div v-if="showMessage(message)" class="message">
            <h5 class="message-header">{{ message.id[message.id.length - 1] }}</h5>
            <pre v-if="message.kwargs.content">{{ message.kwargs.content }}</pre>
            <div v-if="message.kwargs.tool_calls?.length">
              <ul>
                <li v-for="tool_call in message.kwargs.tool_calls">
                  {{ tool_call.type }}:
                  <code>{{ tool_call.name }}({{ JSON.stringify(tool_call.args) }})</code>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- <pre>
          {{ JSON.stringify(checkpoint, null, 2) }}
        </pre> -->
      </div>
    </ul>
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
  with: auto;
  padding: 0.4rem;
  background-color: $primary-lighter;
  border-bottom: 1px solid $primary-dark;
  text-align: center;
}
</style>
