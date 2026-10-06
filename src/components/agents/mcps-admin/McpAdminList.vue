<script setup lang="ts">
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const fetchMcps = async () => $fetch('/api/mcp', { headers })
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })
const cannotDeleteMcp = (m) => m.agents?.length
const countAgents = (m) => m.agents?.length
</script>
<template>
  <EntityAdminList
    ref="entityList"
    entity-icon="Article"
    :no-entity-label="$t('agent-mcps.empty-list')"
    :deletable-check="cannotDeleteMcp"
    :fetch-entities="fetchMcps"
  >
    <template #default="{ entity: mcp }">
      <div class="title">{{ mcp.title }}</div>
      <div>
        <span v-if="cannotDeleteMcp(mcp)">Used by {{ countAgents(mcp) }} agents</span>
        <span v-else>Not used yet</span>
      </div>
    </template>
  </EntityAdminList>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.title {
  font-size: 1.2rem;
  color: variables.$primary-dark;
}
</style>
