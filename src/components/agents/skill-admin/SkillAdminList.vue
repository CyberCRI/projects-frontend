<script setup>
const fetchSkills = async () => $fetch('/api/skill')
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })
</script>
<template>
  <EntityAdminList
    ref="entityList"
    entity-icon="Article"
    no-entity-label="Nope"
    :fetchEntities="fetchSkills"
  >
    <template #default="{ entity: skill }">
      {{ skill.title }} ({{ skill.skillContents?.length }} versions)
    </template>
  </EntityAdminList>
</template>
<style lang="scss" scoped>
.title {
  font-size: 1.2rem;
  color: $primary-dark;
}
</style>
