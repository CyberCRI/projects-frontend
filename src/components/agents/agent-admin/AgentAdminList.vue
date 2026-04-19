<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const fetchAgents = async () => await $fetch('/api/agent', { headers })
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })
const router = useRouter()
const gotoAgent = (agent) => router.push({ name: 'AgentPage', params: { agentSlug: agent.slug } })
</script>
<template>
  <EntityAdminList
    ref="entityList"
    is-linkable
    entity-icon="Article"
    :no-entity-label="$t('agents.empty-list')"
    :fetchEntities="fetchAgents"
    @goto-entity="gotoAgent"
  >
    <template #default="{ entity: agent }">
      <div class="title">
        <span class="enabled-mark">{{ agent.isEnabled ? '✅' : '❌' }}</span>
        {{ agent.title }}
      </div>
      <div class="prompt">
        {{ agent.promptContent.prompt.title }} v{{ agent.promptContent.version }}
      </div>
    </template>
  </EntityAdminList>
</template>
<style lang="scss" scoped>
.title {
  font-size: 1.2rem;
  color: $primary-dark;
}
.prompt {
  color: #666;
  font-size: 0.8em;
}
.enabled-mark {
  font-size: 0.8rem;
}
</style>
