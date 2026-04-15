<script setup>
const fetchPrompts = async () => $fetch('/api/prompt')
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })
</script>
<template>
  <EntityAdminList
    ref="entityList"
    entity-icon="Article"
    no-entity-label="Nope"
    :fetchEntities="fetchPrompts"
  >
    <template #default="{ entity: prompt }">
      {{ prompt.title }} ({{ prompt.promptContents?.length }} versions)
    </template>
  </EntityAdminList>
</template>
<style lang="scss" scoped>
.title {
  font-size: 1.2rem;
  color: $primary-dark;
}
</style>
