<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const fetchSkills = async () => $fetch('/api/skill', { headers })
const entityList = useTemplateRef('entityList')
const refresh = () => entityList.value?.refresh()
defineExpose({ refresh })
const cannotDeleteSkill = (s) => s.skillContents.some((sc) => sc.agents?.length)
const countAgents = (s) => s.skillContents.reduce((acc, sc) => acc + sc.agents?.length || 0, 0)
</script>
<template>
  <EntityAdminList
    ref="entityList"
    entity-icon="Article"
    :no-entity-label="$t('agent-skills.empty-list')"
    :deletable-check="cannotDeleteSkill"
    :fetch-entities="fetchSkills"
  >
    <template #default="{ entity: skill }">
      <div class="title">{{ skill.title }}</div>
      <div>
        <span>{{ skill.skillContents?.length }} versions</span>
        -
        <span v-if="cannotDeleteSkill(skill)">Used by {{ countAgents(skill) }} agents</span>
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
