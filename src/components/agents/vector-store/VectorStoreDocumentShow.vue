<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'

const usersStore = useUsersStore()

const props = defineProps<{
  document: { title: string; org_code: string }
}>()
const emit = defineEmits(['close'])

const isAsyncing = ref(false)
const chunkList = ref([])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const close = () => emit('close')

const query = new URLSearchParams()
query.set('title', props.document.title)

if (props.document.org_code == '') query.set('is_global', 'yes')

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
    :title="document.title"
    :asyncing="isAsyncing"
    no-second-button
    :cancel-button-label="$t('common.close')"
    @cancel="close"
    @confirm="close"
  >
    <div v-if="isAsyncing" class="loader">
      <LoaderSimple />
    </div>
    <template v-else>
      <VectorStoreGlobalPill v-if="document?.org_code == ''" />
      <ul>
        <div v-for="(chunk, i) in chunkList" :key="i" class="chunk">
          <h4 class="chunk-header">
            Chunk {{ i + 1 }}/{{ chunkList.length }} - Page {{ chunk.metadata.loc.pageNumber }},
            Line {{ chunk.metadata.loc.lines.from }}-{{ chunk.metadata.loc.lines.to }}
          </h4>
          <div>
            {{ chunk.content }}
          </div>
        </div>
      </ul>
    </template>
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
