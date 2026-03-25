<script setup>
import useUsersStore from '@/stores/useUsers'

const emit = defineEmits(['show-document', 'delete-document', 'edit-document'])

const usersStore = useUsersStore()

const isAsyncing = ref(false)
const documentList = ref([])

const refresh = async () => {
  isAsyncing.value = true
  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  try {
    const response = await fetch(`/api/vector-store/list`, {
      headers,
    })

    if (!response.ok) {
      console.error(`Failed to fetch vector store documents: ${response.status} ${response.statusText}`)
      documentList.value = []
      return
    }

    const text = await response.text()

    if (!text) {
      // Empty response body; treat as no documents
      documentList.value = []
      return
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse vector store list response as JSON:', parseError)
      documentList.value = []
      return
    }

    console.log(data)
    documentList.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.log(e.toString())
  } finally {
    isAsyncing.value = false
    close()
  }
}
defineExpose({ refresh })

refresh()
</script>
<template>
  <div v-if="isAsyncing" class="loader">
    <LoaderSimple />
  </div>
  <p v-else-if="!documentList.length" class="no-document">
    {{ $t('vector-store.no-document-yet') }}
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
        {{ document.title }}
        <span class="chunk-count">({{ document.chunks }} {{ $t('vector-store.chunks') }})</span>
      </div>
      <div class="actions">
        <ContextActionButton
          action-icon="Eye"
          secondary
          no-border
          @click.prevent="emit('show-document', document.title)"
        />
        <ContextActionButton
          action-icon="Pen"
          secondary
          no-border
          @click.prevent="emit('edit-document', document.title)"
        />
        <ContextActionButton
          action-icon="TrashCanOutline"
          secondary
          no-border
          @click.prevent="emit('delete-document', document.title)"
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
