<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()

const props = defineProps({ skill: { type: [Object, null], required: true } })
const emit = defineEmits(['close'])

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const fetchSkill = async () => {
  const response = await fetch(`/api/skill/${props.skill.id}`, {
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
      errorText || `Request to /api/skill/${props.prompt.id} failed with status ${response.status}`
    )
  }
  const promptData = await response.json()
  return promptData
}
</script>
<template>
  <EntityAdminShow :fetch-entity="fetchSkill" :entity-title="skill.title" @close="emit('close')">
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
