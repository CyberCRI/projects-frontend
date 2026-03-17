<script setup>
import useUsersStore from '@/stores/useUsers'

const usersStore = useUsersStore()

const props = defineProps({ documentTitle: { type: String, required: true } })
const emit = defineEmits(['close0'])

const isAsyncing = ref(false)
const chunkList = ref([])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const query = new URLSearchParams()
query.set('title', props.documentTitle)

try {
  const response = await fetch(`/api/vector-store/get?${query.toString()}`, {
    headers,
  })
  const data = await response.json()
  console.log(data)
  chunkList.value = data
} catch (e) {
  console.log(e.toString())
} finally {
  isAsyncing.value = false
  close()
}
</script>
<template>
  <ConfirmModal :title="documentTitle" @cancel="close" @confirm="close">
    <ul>
      <div v-for="(chunk, i) in chunkList" :key="i">
        <h4>
          Chunk {{ i + 1 }}/{{ chunkList.length }} - Page {{ chunk.metadata.loc.pageNumber }} Line
          {{ chunk.metadata.loc.lines.from }}-{{ chunk.metadata.loc.lines.to }}
        </h4>
        <pre>
      {{ chunk.content }}
      </pre
        >
      </div>
    </ul>
  </ConfirmModal>
</template>
