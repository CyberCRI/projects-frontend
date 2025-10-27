<script setup>
import { getAllNews, deleteNews } from '@/api/news.service.ts'
import useAPI from '@/composables/useAPI.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const { translateNews } = useAutoTranslate()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { canEditNews, canDeleteNews, canCreateNews } = usePermissions()
const router = useRouter()
const { t } = useNuxtI18n()

const loading = ref(false)
const editedNews = ref(null)
const newsToDelete = ref(null)
const isDeletingNews = ref(false)
const pagination = useState(() => ({
  currentPage: 1,
  total: 1,
  previous: undefined,
  next: undefined,
  first: undefined,
  last: undefined,
}))
const newsRequest = ref(() => null)
const maxNewsPerPage = ref(() => 12)

const _allNews = computed(() => {
  return newsRequest.value?.results || []
})

const allNews = translateNews(_allNews)

watchEffect(
  () => [newsRequest],
  (response) => {
    updatePagination(response)
  },
  { deep: true }
)

const createNews = () => {
  router.push({ name: 'CreateNewsPage' })
}

const loadNews = async () => {
  const dateLimit =
    canEditNews.value || canDeleteNews.value ? {} : { to_date: new Date().toISOString() }

  loading.value = true
  newsRequest.value = await getAllNews(organizationsStore.current?.code, {
    ordering: '-publication_date',
    limit: maxNewsPerPage.value,
    ...dateLimit,
  })
  loading.value = false
}

const doDeleteNews = async () => {
  isDeletingNews.value = true
  try {
    await deleteNews(organizationsStore.current?.code, newsToDelete.value.id)
    toaster.pushSuccess(t('news.delete.success'))

    loadNews()
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    newsToDelete.value = null
    isDeletingNews.value = false
  }
}

const onClickPagination = async (requestedPage) => {
  loading.value = true
  newsRequest.value = (await useAPI(requestedPage, {})).data
  loading.value = false
  const el = document.querySelector('.page-title')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const updatePagination = (response) => {
  pagination.value.currentPage = response.current_page
  pagination.value.total = response.total_page
  pagination.value.previous = response.previous
  pagination.value.next = response.next
  pagination.value.first = response.first
  pagination.value.last = response.last
}

onMounted(() => {
  loadNews()
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('news.list.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>
<template>
  <div class="news-list-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('news.list.title') }}
    </h1>

    <div class="create-news-button-ctn">
      <LpiButton
        v-if="canCreateNews"
        primary
        :label="$t('news.list.create')"
        data-test="create-news-button"
        btn-icon="Plus"
        class="create-news-button"
        @click="createNews"
      />
    </div>
    <div v-if="loading" class="news-list" :class="{ 'with-pagination': pagination.total > 1 }">
      <NewsListItemSkeleton />
      <NewsListItemSkeleton />
    </div>
    <div v-else class="news-list" :class="{ 'with-pagination': pagination.total > 1 }">
      <NewsListItem
        v-for="news in allNews"
        :key="news.id"
        :news="news"
        @edit-news="editedNews = news"
        @delete-news="newsToDelete = news"
      />
    </div>
    <div v-if="pagination.total > 1" class="pagination-container">
      <PaginationButtons
        :current="pagination.currentPage"
        :pagination="pagination"
        :total="pagination.total"
        @update-pagination="onClickPagination"
      />
    </div>
  </div>

  <EditNewsDrawer
    :is-opened="!!editedNews"
    :news="editedNews"
    @news-edited="loadNews"
    @close="editedNews = null"
  />

  <ConfirmModal
    v-if="newsToDelete"
    :content="$t('news.delete.message')"
    :title="$t('news.delete.title')"
    :asyncing="isDeletingNews"
    @cancel="newsToDelete = null"
    @confirm="doDeleteNews"
  />
</template>
<style lang="scss" scoped>
.page-title {
  margin-bottom: $space-2xl;
}

.create-news-button-ctn {
  margin: 2rem 0;
}

.create-news-button {
  margin-left: auto;
}

.loader-ctn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;

  &.with-pagination {
    margin-bottom: 0;
  }
}

.pagination-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: $space-xl;
  margin-bottom: 4rem;
}
</style>
