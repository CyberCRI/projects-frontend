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
  return useFetch(`/api/chat-conversation/${props.documentTitle}`, { headers })
}
const { data: conversation, status /* , error */, refresh } = fetchAll()
const isAsyncing = computed(() => status.value === 'pending')

refresh()
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
    <div v-else>
      <div v-for="message in conversation.messages" :key="message.id" class="message">
        <h4 class="message.role">{{ message.position }} - {{ message.role }}</h4>
        <p>{{ message.content }}</p>
      </div>
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
</style>
