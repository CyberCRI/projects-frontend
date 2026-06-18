<script setup>
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()
const { translateAgents } = useAutoTranslate()

let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
// const fetchAgents = async () => {
//   const agents = await $fetch('/api/agent', { headers })
//   console.log('xxxxx0', agents)
//   const translations = translateAgents(agents)
//   console.log('xxxxx1', translations)
//   return translations
// }

const key = computed(() => `admin-agents`)
const getAgents = () =>
  useAsyncAPI(key, () => $fetch('/api/agent', { headers }), {
    translate: (data) => translateAgents(data),
  })
const { /*status,*/ isLoading, data: agents, /*error,*/ refresh } = getAgents()

defineExpose({ refresh })
const router = useRouter()
const gotoAgent = (agent) => {
  const routeData = router.resolve({ name: 'AgentPage', params: { agentSlug: agent.slug } })
  window.open(routeData.href, '_blank')
}
</script>
<template>
  <EntityAdminListV2
    ref="entityList"
    is-linkable
    entity-icon="Article"
    :no-entity-label="$t('agents.empty-list')"
    :entity-list="agents"
    :is-loading="isLoading"
    @goto-entity="gotoAgent"
  >
    <template #default="{ entity: agent }">
      <div class="title">
        <span class="enabled-mark">{{ agent.isEnabled ? '✅' : '❌' }}</span>
        {{ agent.$t.title }}
      </div>
      <div class="prompt">
        {{ agent.promptContent.prompt.title }} v{{ agent.promptContent.version }}
      </div>
    </template>
  </EntityAdminListV2>
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
