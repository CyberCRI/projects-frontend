<script setup lang="ts">
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()

const props = defineProps({
  mcp: { type: [Object, null], required: true },
})
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const fetchMcp = async () => {
  const response = await fetch(`/api/mcp/${props.mcp.id}`, {
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
      errorText || `Request to /api/mcp/${props.mcp.id} failed with status ${response.status}`
    )
  }
  const mcpData = await response.json()
  return mcpData
}
</script>
<template>
  <EntityAdminShow :fetch-entity="fetchMcp" :entity-title="mcp.title" @close="emit('close')">
    <template #default="{ entity }">
      <CodeBlock language="json" :content="JSON.stringify(entity, null, 2)" />
    </template>
  </EntityAdminShow>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.loader {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
}
</style>
