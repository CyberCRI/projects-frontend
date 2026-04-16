<script setup>
const fetchAgents = async () => await $fetch('/api/agent')
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })
const router = useRouter()
const gotoAgent = (agent) => router.push({ name: 'AgentPage', params: { agentId: agent.id } })
</script>
<template>
  <EntityAdminList
    ref="entityList"
    is-linkable
    entity-icon="Article"
    no-entity-label="Nope"
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
