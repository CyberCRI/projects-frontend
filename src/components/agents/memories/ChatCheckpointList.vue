<script setup>
import useUsersStore from '@/stores/useUsers'

const emit = defineEmits(['show-document'])

const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

function fetchAll() {
  return useFetch('/api/chat-checkpoint/', { headers })
}
const { data: documentList, status, /*error,*/ refresh } = fetchAll()
const isAsyncing = computed(() => status.value === 'pending')

defineExpose({ refresh })
refresh()

refresh()
</script>
<template>
  <div v-if="isAsyncing" class="loader">
    <LoaderSimple />
  </div>
  <p v-else-if="!documentList.length" class="no-document">
    {{ $t('chat-thread.no-thread-yet') }}
  </p>
  <ul v-else>
    <li
      v-for="document in documentList"
      :key="document.title + '-' + document.chunks"
      class="document"
    >
      <div class="icon">
        <IconImage name="Article" />
      </div>
      <div class="title">
        {{ document.thread_id }}
        <span class="chunk-count">
          ({{ document.total_checkpoints }} {{ $t('chat-thread.meassages') }})
        </span>
      </div>
      <div class="actions">
        <ContextActionButton
          action-icon="Eye"
          secondary
          no-border
          @click.prevent="emit('show-document', document.thread_id)"
        />
      </div>
    </li>
  </ul>
</template>
<style lang="scss" scoped>
.document {
  display: flex;
  gap: 1rem;
  padding: 0.6rem;
  border: 1px solid $primary;
  border-radius: 0.6rem;
  justify-content: stretch;
  align-items: center;
}

.document ~ .document {
  margin-top: 1rem;
}

.icon,
.actions {
  flex-grow: 0;
  flex-shrink: 0;
}

.title {
  flex-grow: 1;
  font-size: 1.2rem;
  color: $primary-dark;
}

.chunk-count {
  font-weight: normal;
  color: $light-gray;
}

.icon svg {
  width: 2rem;
  fill: $light-gray;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.no-document {
  text-align: center;
  font-style: italic;
}
</style>
