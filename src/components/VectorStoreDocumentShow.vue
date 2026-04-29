<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'

const usersStore = useUsersStore()

const props = defineProps<{
  documentTitle: string
}>()
const emit = defineEmits(['close'])

const isAsyncing = ref(false)
const chunkList = ref([])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const close = () => emit('close')

const query = new URLSearchParams()
query.set('title', props.documentTitle)

const load = async () => {
  try {
    isAsyncing.value = true
    const response = await fetch(`/api/vector-store/get?${query.toString()}`, {
      headers,
    })
    if (!response.ok) {
      let errorText = ''
      try {
        errorText = await response.text()
      } catch {
        // ignore text parsing errors
      }
      throw new Error(
        errorText || `Request to /api/vector-store/get failed with status ${response.status}`
      )
    }
    const data = await response.json()
    chunkList.value = data
  } catch (e) {
    console.log(e.toString())
    close()
  } finally {
    isAsyncing.value = false
  }
}
// no await so we dont block ui
load()
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
      <div v-for="(chunk, i) in chunkList" :key="i" class="chunk">
        <h4 class="chunk-header">
          Chunk {{ i + 1 }}/{{ chunkList.length }} - Page {{ chunk.metadata.loc.pageNumber }}, Line
          {{ chunk.metadata.loc.lines.from }}-{{ chunk.metadata.loc.lines.to }}
        </h4>
        <div>
          {{ chunk.content }}
        </div>
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
</style>
