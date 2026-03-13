<script setup>
import useUsersStore from '@/stores/useUsers'
import useToasterStore from '@/stores/useToaster'

const toaster = useToasterStore()
const usersStore = useUsersStore()

const file = ref(null)
const title = ref('')

const onFileChange = (e) => {
  var files = e.target.files || e.dataTransfer.files
  if (!files.length) return
  file.value = files[0]
}

const submit = async () => {
  const fd = new FormData()
  fd.append('title', title.value)
  fd.append('file', file.value, file.value.name)

  let headers = {}
  const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
  if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

  try {
    const response = await fetch(`/api/vector-store/ingest`, {
      body: fd,
      method: 'POST',
      headers,
    })
    if (response.ok) toaster.pushSuccess('Vector store updated')
    else toaster.pushError(`${response.status} - ${response.statusText}`)
  } catch (e) {
    toaster.pushError(e.toString())
  }
}
</script>
<template>
  <form
    class="form"
    action="/api/vector-store/ingest"
    method="POST"
    enctype="multipart/form-data"
    @submit.prevent="submit"
  >
    <label for="title">Title</label>
    <input id="title" type="text" v-model="title" required />

    <label for="file">File</label>
    <input id="file" type="file" name="file" required @change="onFileChange" />

    <button type="submit">Upload</button>
  </form>
</template>
