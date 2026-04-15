<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()

const props = defineProps({ prompt: { type: [Object, null], required: true } })
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const fetchPrompt = async () => {
  const response = await fetch(`/api/prompt/${props.prompt.id}`, {
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
      errorText || `Request to /api/prompt/${props.prompt.id} failed with status ${response.status}`
    )
  }
  const promptData = await response.json()
  return promptData
}
</script>
<template>
  <EntityAdminShow :fetch-entity="fetchPrompt" :entity-title="prompt.title" @close="emit('close')">
    <template #default="{ entity }">
      <pre>
      {{ JSON.stringify(entity, null, 2) }}
    </pre
      >
    </template>
  </EntityAdminShow>
</template>
<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}
</style>
