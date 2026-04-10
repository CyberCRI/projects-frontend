<script setup>
const fetchAgents = async () => {
  const response = await fetch('/api/agent')
  const agents = await response.json()
  return agents
}
</script>
<template>
  <EntityAdminList entity-icon="Article" no-entity-label="Nope" :fetchEntities="fetchAgents">
    <template #default="{ entity: agent }">
      {{ agent.title }}
    </template>
  </EntityAdminList>
</template>
<style lang="scss" scoped>
.title {
  font-size: 1.2rem;
  color: $primary-dark;
}
</style>
