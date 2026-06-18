<script setup lang="ts">
import useToasterStore from '@/stores/useToaster'
import useUsersStore from '@/stores/useUsers'
const usersStore = useUsersStore()
const toaster = useToasterStore()
const { t } = useNuxtI18n()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }
const fetchAgents = async () => await $fetch('/api/agent/public-list', { headers })
const fetchSideAssistant = async () => await $fetch('/api/side-assistant', { headers })

const isAsyncingAgent = ref(false)

const entityList = ref([])
const refreshAgents = async () => {
  isAsyncingAgent.value = true
  try {
    entityList.value = (await fetchAgents()) as any[]
    console.log('entityList', entityList.value)
  } catch (e) {
    console.log(e.toString())
  } finally {
    isAsyncingAgent.value = false
  }
}

const isAsyncingSideAssistant = ref(false)
const sideAssistant = ref(null)
const chosenAgent = ref(0)
const refreshSideAgent = async () => {
  isAsyncingSideAssistant.value = true
  try {
    sideAssistant.value = await fetchSideAssistant()
    console.log('sideAgent', sideAssistant.value)
    if (sideAssistant.value) chosenAgent.value = sideAssistant.value.agentId || 0
  } catch (e) {
    console.log(e.toString())
  } finally {
    isAsyncingSideAssistant.value = false
  }
}

const isAsyncing = computed(() => isAsyncingSideAssistant.value || isAsyncingAgent.value)

defineExpose({ refreshAgents, refreshSideAgent })

refreshAgents()
refreshSideAgent()

const assistantOptions = computed(() => [
  { label: t('side-assistant.default'), value: 0 },
  ...(entityList.value || []).map((agent) => ({ label: agent.title, value: agent.id })),
])

const isSaving = ref(false)

async function submit() {
  isSaving.value = true
  try {
    sideAssistant.value = await $fetch('/api/side-assistant', {
      method: 'post',
      body: { agentId: chosenAgent.value },
      headers,
    })
    console.log('sideAgent', sideAssistant.value)
    if (sideAssistant.value) chosenAgent.value = sideAssistant.value.agentId || 0
    toaster.pushSuccess(t('side-assistant.save-success'))
  } catch (e) {
    console.log(e)
    toaster.pushError(t('side-assistant.save-error'))
  } finally {
    isSaving.value = false
  }
}
</script>
<template>
  <div>
    <div v-if="isAsyncing" class="loader">
      <LoaderSimple />
    </div>
    <template v-else>
      <div class="form-section">
        <h3 class="form-section-title">{{ $t('side-assistant.choose') }}</h3>
        <LpiSelect v-model="chosenAgent" :options="assistantOptions" />
      </div>
      <div class="form-section">
        <LpiButton
          :disabled="isSaving"
          :btn-icon="isSaving ? 'LoaderSimple' : null"
          :label="$t('common.save')"
          @click="submit"
        />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-section ~ .form-section {
  margin-top: 1rem;
}

.form-section-title {
  color: $primary-dark;
  font-size: 1.3em;
  padding-block: 1rem;
}
</style>
