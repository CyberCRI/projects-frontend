<script setup>
import { factoryPagination } from '~/skeletons/base.skeletons.ts'
import { formatDateTime } from '~/functs/date.ts'
import useUsersStore from '@/stores/useUsers.ts'
import { onlyRefs } from '@/functs/onlyRefs'

const { translateAgents } = useAutoTranslate()
const { locale } = useNuxtI18n()

const emit = defineEmits(['show-document'])

const usersStore = useUsersStore()
let headers = {}
const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

const conversationSkeleton = () => ({
  agent: {
    title: 'Lorem Ipsum',
  },
  title: 'Dolore sit amet',
  userId: -1,
  lastActiveAt: '1970-01-01T00:00:00',
})

const key = computed(() => `admin-agents`)
const getAgents = () =>
  useAsyncAPI(key, () => $fetch('/api/agent', { headers }), {
    translate: (data) => translateAgents(data),
  })
const { /*status,*/ /*isLoadingAgents,*/ data: agents /*error,*/ /*refreshAgents*/ } = getAgents()

const agentOptions = computed(() => [
  { label: 'ALL', value: 0 },
  ...(agents.value || []).map((agent) => ({ value: agent.id, label: agent.title })),
])
const selectedAgent = ref(0)
const searchQuery = computed(() => ({ agentId: selectedAgent.value || undefined }))

const LIMIT = 20
const { data, status, refresh, pagination } = useAsyncPaginationAPI(
  'conversations',
  ({ config }) => $fetch('/api/chat-conversation/', { headers, ...config }),
  {
    query: searchQuery,
    paginationConfig: { limit: LIMIT },
    default: () => factoryPagination(conversationSkeleton, LIMIT),
    watch: onlyRefs([searchQuery]),
  }
)

const isExporting = ref(false)
const exportCoversations = async () => {
  isExporting.value = true
  const _limit = 250
  try {
    const jsonData = await $fetch(
      `/api/chat-conversation/?limit=${_limit}&agentId=${selectedAgent.value}`,
      {
        headers,
      }
    )
    const filename = `agent-${selectedAgent.value}-conversations-${new Date().toISOString()}.json`
    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(jsonData.results, null, 2)], {
      type: 'application/json',
    })
    // Create a download link
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename

    // Trigger the download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Error downloading data:', error)
    throw error
  } finally {
    isExporting.value = false
  }
}

// const isAsyncing = computed(() => status.value === 'pending')

const documentList = computed(() => data.value || [])

const prettyDate = (s) => formatDateTime(new Date(s), locale.value)

defineExpose({ refresh })
refresh()

refresh()
</script>
<template>
  <div class="export">
    <LpiSelect v-model="selectedAgent" :options="agentOptions" />
    <LpiButton
      :disabled="isExporting"
      label="Export"
      :btn-icon="isExporting ? 'LoaderSimple' : undefined"
      @click="exportCoversations"
    />
  </div>
  <FetchLoader :status="status" skeleton only-error>
    <h4 class="conversation-count skeletons-text">{{ pagination.count }} conversations</h4>
    <EmptyLabel v-if="!documentList.length" :label="$t('chat-conversation.no-conversation-yet')" />
    <ul>
      <li
        v-for="document in documentList"
        :key="document.title + '-' + document.chunks"
        class="document"
      >
        <div class="icon skeletons-background">
          <IconImage name="Article" />
        </div>
        <div class="title skeletons-text">
          {{ document.agent?.title }} - {{ document.title }}
          <br />

          <span class="chunk-count">Agent: {{ document.agent.title?.substring(0, 16) }}</span>
          -
          <span class="chunk-count">User #{{ document.userId }}</span>
          -
          <span class="chunk-count">{{ prettyDate(document.lastActiveAt) }}</span>
        </div>
        <div class="actions">
          <ContextActionButton
            action-icon="Eye"
            secondary
            no-border
            class="skeletons-background"
            @click.prevent="emit('show-document', document.id)"
          />
        </div>
      </li>
    </ul>
    <PaginationButtonsV2 :pagination="pagination" />
  </FetchLoader>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.document {
  display: flex;
  gap: 1rem;
  padding: 0.6rem;
  border: 1px solid variables.$primary;
  border-radius: 0.6rem;
  justify-content: stretch;
  align-items: center;
}

.document ~ .document {
  margin-top: 1rem;
}

.icon,
.actions {
  flex-grow: 0;
  flex-shrink: 0;
}

.title {
  flex-grow: 1;
  font-size: 1.2rem;
  color: variables.$primary-dark;
}

.chunk-count {
  font-weight: normal;
  color: variables.$light-gray;
}

.icon svg {
  width: 2rem;
  fill: variables.$light-gray;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.no-document {
  text-align: center;
  font-style: italic;
}

.export {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.conversation-count {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
