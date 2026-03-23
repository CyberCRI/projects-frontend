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
        :to="{
          name: 'CreateNewsPage',
        }"
      />
    </div>
    <FetchLoader :status="status" only-error skeleton>
      <div class="list-container list-divider">
        <NewsItem
          v-for="news in allNews"
          :key="news.title"
          :news="news"
          :editable="editable"
          @edit="onEdit"
          @delete="onDelete"
        />
      </div>
      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>

    <EditNewsDrawer
      :is-opened="stateModals.edit"
      :news="selectedNews"
      @news-edited="refresh"
      @close="onCancel"
    />

    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('news.delete.title')"
      :asyncing="asyncingDelete"
      @cancel="closeModals('delete')"
      @confirm="onConfirmDelete"
    >
      <NewsItem :news="selectedNews" />
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { deleteNews } from '@/api/news.service'
import { getAllNews } from '@/api/v2/news.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import NewsItem from '@/components/news/NewsItem.vue'
import { QueryFilterNews } from '@/models/news.model'
import { factoryPagination } from '@/skeletons/base.skeletons'
import { newsSkeleton } from '@/skeletons/news.skeletons'
import useToasterStore from '@/stores/useToaster'

const organizationCode = useOrganizationCode()
const asyncingDelete = ref(false)
const toaster = useToasterStore()
const { t } = useNuxtI18n()
const { canEditNews, canDeleteNews, canCreateNews } = usePermissions()
const editable = computed(() => canEditNews.value || canDeleteNews.value)
const selectedNews = ref()

const query = useQuery<QueryFilterNews>({
  ordering: '-publication_date',
})
const LIMIT = 10
const {
  status,
  data: allNews,
  pagination,
  refresh,
} = getAllNews(organizationCode, {
  query,
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(newsSkeleton, LIMIT),
})

const { stateModals, openModals, closeModals } = useModals({ edit: false, delete: false })

const onEdit = (news) => {
  selectedNews.value = news
  openModals('edit')
}

const onDelete = (news) => {
  selectedNews.value = news
  openModals('delete')
}

const onConfirmDelete = async () => {
  asyncingDelete.value = true
  try {
    await deleteNews(organizationCode, selectedNews.value.id)
    toaster.pushSuccess(t('news.delete.success'))
    refresh()
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    asyncingDelete.value = false
    onCancel()
  }
}

const onCancel = () => {
  selectedNews.value = null
  closeModals('delete', 'edit')
}

useLpiHead2({
  title: computed(() => t('news.list.title')),
})
</script>

<style lang="scss" scoped>
.page-title {
  margin-bottom: $space-2xl;
}

.create-news-button-ctn {
  margin: 2rem 0;
  display: flex;
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
