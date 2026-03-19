<template>
  <AdminBlock :block-title="blockTitle">
    <template #default>
      <FetchLoader :status="status">
        <NewsListItem
          v-for="news in allNews"
          :key="news.id"
          :news="news"
          @edit-news="editedNews = news"
          @delete-news="newsToDelete = news"
        />
      </FetchLoader>
    </template>

    <template #footer>
      <LpiButton btn-icon="Plus" :label="$t('common.add')" @click="addNews" />
      <LinkButton
        btn-icon="ArrowRight"
        :label="$t('common.see-all')"
        :to="{ name: 'NewsListPage' }"
      />
    </template>
  </AdminBlock>

  <EditNewsDrawer
    :is-opened="!!editedNews"
    :news="editedNews"
    @close="editedNews = null"
    @news-edited="refresh"
  />

  <ConfirmModal
    v-if="newsToDelete"
    :content="$t('news.delete.message')"
    :title="$t('news.delete.title')"
    :asyncing="isDeletingNews"
    @cancel="newsToDelete = null"
    @confirm="onDeleteNews"
  />
</template>

<script setup lang="ts">
import { deleteNews } from '@/api/news.service'
import useToasterStore from '@/stores/useToaster'
import { defaultForm } from '@/components/instruction/InstructionForm/InstructionForm.vue'
import { getAllNews } from '@/api/v2/news.service'
import NewsListItem from '@/components/news/NewsListItem/NewsListItem.vue'

const toaster = useToasterStore()
const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()

const editedNews = ref(null)
const newsToDelete = ref(null)
const isDeletingNews = ref(false)

const todayAtZero = new Date()
todayAtZero.setHours(0, 0, 0, 0)
const query = {
  ordering: 'start_date',
  from_date: todayAtZero.toISOString(),
}

const {
  status,
  data: allNews,
  pagination,
  refresh,
  isLoading,
} = getAllNews(organizationCode, {
  query,
  paginationConfig: {
    limit: 4,
  },
})

const blockTitle = computed(() => {
  let extra = isLoading.value ? '' : ` (${pagination.count.value})`
  return t('admin.portal.newss') + extra
})

const addNews = () => (editedNews.value = defaultForm())

const onDeleteNews = async () => {
  isDeletingNews.value = true
  try {
    await deleteNews(organizationCode, newsToDelete.value.id)
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
</script>
