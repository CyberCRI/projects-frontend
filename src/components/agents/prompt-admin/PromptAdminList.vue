<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const fetchPrompts = async () => $fetch('/api/prompt', { headers })
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })

const cannotDeletePrompt = (p) => {
  console.log('cannot', p)
  return p.promptContents.some((pc) => pc.agents.length)
}
const countAgents = (p) => p.promptContents.reduce((acc, pc) => acc + pc.agents.length, 0)
</script>
<template>
  <EntityAdminList
    ref="entityList"
    entity-icon="Article"
    :no-entity-label="$t('prompts.empty-list')"
    :deletable-check="cannotDeletePrompt"
    :fetch-entities="fetchPrompts"
  >
    <template #default="{ entity: prompt }">
      <div class="title">{{ prompt.title }}</div>
      <div>
        <span>{{ prompt.promptContents?.length }} versions</span>
        -
        <span v-if="cannotDeletePrompt(prompt)">Used by {{ countAgents(prompt) }} agents</span>
        <span v-else>Not used yet</span>
      </div>
    </template>
  </EntityAdminList>
</template>
<style lang="scss" scoped>
.title {
  font-size: 1.2rem;
  color: $primary-dark;
}
</style>
