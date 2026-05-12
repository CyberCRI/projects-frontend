<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()

const props = defineProps({ agent: { type: [Object, null], required: true } })
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const fetchAgent = async () => {
  const agentData = await $fetch(`/api/agent/${props.agent.id}`, {
    headers,
  })
  // if (!response.ok) {
  //   let errorText = ''
  //   try {
  //     errorText = await response.text()
  //   } catch {
  //     // ignore text parsing errors
  //   }
  //   throw new Error(
  //     errorText || `Request to /api/agent/${props.agent.id} failed with status ${response.status}`
  //   )
  // }
  // const agentData = await response.json()
  return agentData
}
</script>
<template>
  <EntityAdminShow :fetch-entity="fetchAgent" :entity-title="agent.title" @close="emit('close')">
    <template #default="{ entity }">
      <pre>
      {{ JSON.stringify(entity, null, 2) }}
    </pre
      >
    </template>
  </EntityAdminShow>
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
