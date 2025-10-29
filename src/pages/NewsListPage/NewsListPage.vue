<script setup lang="ts">
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import { getOrganizationByCode } from '@/api/organizations.service'
import { useAsyncPaginationAPI } from '@/composables/useAsyncAPI'
import { api } from '@/api/SwaggerProjects'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'

const { translateNews } = useAutoTranslate()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { canEditNews, canDeleteNews, canCreateNews } = usePermissions()
const router = useRouter()
const { t } = useNuxtI18n()

const editedNews = ref(null)
const newsToDelete = ref(null)
const isDeletingNews = ref(false)
const MAX_NEWS_PER_PAGE = 12

const { isLoading, data, refresh, pagination } = useAsyncPaginationAPI(
  'organizationNewsList',
  ({ query }) => {
    const dateLimit =
      canEditNews.value || canDeleteNews.value ? {} : { to_date: new Date().toISOString() }

    return api.v1.organizationNewsList(organizationsStore.current.code, {
      ...query,
      ordering: '-publication_date',
      ...dateLimit,
    })
  },
  {
    paginationConfig: { limit: MAX_NEWS_PER_PAGE },
  }
)

const { total } = pagination

const allNews = translateNews(data)
const createNews = () => router.push({ name: 'CreateNewsPage' })

const doDeleteNews = async () => {
  isDeletingNews.value = true
  try {
    await api.v1.organizationNewsDestroy(newsToDelete.value.id, organizationsStore.current?.code)
    toaster.pushSuccess(t('news.delete.success'))

    refresh()
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    newsToDelete.value = null
    isDeletingNews.value = false
  }
}

// when loading is finish, smooth scrool to top
watch(isLoading, (value, olValue) => {
  if (value === false && olValue === true) {
    document.querySelector('.page-title')?.scrollIntoView({ behavior: 'smooth' })
  }
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
      {{ t('news.list.title') }}
    </h1>

    <div class="create-news-button-ctn">
      <LpiButton
        v-if="canCreateNews"
        primary
        :label="t('news.list.create')"
        data-test="create-news-button"
        btn-icon="Plus"
        class="create-news-button"
        @click="createNews"
      />
    </div>
    <div v-if="isLoading" class="news-list" :class="{ 'with-pagination': total > 1 }">
      <NewsListItemSkeleton />
      <NewsListItemSkeleton />
    </div>
    <div v-else class="news-list" :class="{ 'with-pagination': total > 1 }">
      <NewsListItem
        v-for="news in allNews"
        :key="news.id"
        :news="news"
        @edit-news="editedNews = news"
        @delete-news="newsToDelete = news"
      />
    </div>
    <div v-if="total > 1" class="pagination-container">
      <PaginationButtonsV2 :pagination="pagination" />
    </div>
  </div>

  <EditNewsDrawer
    :is-opened="!!editedNews"
    :news="editedNews"
    @news-edited="refresh"
    @close="editedNews = null"
  />

  <ConfirmModal
    v-if="newsToDelete"
    :content="t('news.delete.message')"
    :title="t('news.delete.title')"
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
