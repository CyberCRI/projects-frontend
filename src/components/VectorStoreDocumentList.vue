<script setup>
import useUsersStore from '@/stores/useUsers'

const emit = defineEmits(['show-document'])

const usersStore = useUsersStore()

const isAsyncing = ref(false)
const documentList = ref([])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

try {
  const response = await fetch(`/api/vector-store/list`, {
    headers,
  })
  const data = await response.json()
  console.log(data)
  documentList.value = data
} catch (e) {
  console.log(e.toString())
} finally {
  isAsyncing.value = false
  close()
}
</script>
<template>
  <ul>
    <li v-for="document in documentList" :key="document.title + '-' + document.chunks">
      <a href="#" @click.prevent="emit('show-document', document.title)">
        {{ document.title }} ({{ document.chunks }} chunks)
      </a>
    </li>
  </ul>
</template>
