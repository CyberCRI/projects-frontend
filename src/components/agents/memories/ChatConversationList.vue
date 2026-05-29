<script setup>
import { factoryPagination } from '~/skeletons/base.skeletons.ts'
import { formatDateTime } from '~/functs/date.ts'
import useUsersStore from '@/stores/useUsers.ts'

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

const LIMIT = 20
const { data, status, refresh, pagination } = useAsyncPaginationAPI(
  'conversations',
  ({ config }) => $fetch('/api/chat-conversation/', { headers, ...config }),
  {
    paginationConfig: { limit: LIMIT },
    default: () => factoryPagination(conversationSkeleton, LIMIT),
  }
)

// const isAsyncing = computed(() => status.value === 'pending')

const documentList = computed(() => data.value || [])

const prettyDate = (s) => formatDateTime(new Date(s), locale.value)

defineExpose({ refresh })
refresh()

refresh()
</script>
<template>
  <FetchLoader :status="status" skeleton only-error>
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
.document {
  display: flex;
  gap: 1rem;
  padding: 0.6rem;
  border: 1px solid $primary;
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
  color: $primary-dark;
}

.chunk-count {
  font-weight: normal;
  color: $light-gray;
}

.icon svg {
  width: 2rem;
  fill: $light-gray;
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
</style>
