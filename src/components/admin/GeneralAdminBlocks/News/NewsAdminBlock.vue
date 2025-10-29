<template>
  <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
    <template #default>
      <NewsAdminListItem
        v-for="news in allNews"
        :key="news.id"
        :news="news"
        @edit-news="editedNews = news"
        @delete-news="newsToDelete = news"
      />
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
    @confirm="deleteNews"
  />
</template>

<script setup lang="ts">
import { defaultForm } from '@/components/news/NewsForm/NewsForm.vue'
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'
import { useAsyncPaginationAPI } from '@/composables/useAsyncAPI'
import { api } from '@/api/SwaggerProjects'

defineOptions({ name: 'NewsAdminBlock' })

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const editedNews = ref(null)
const newsToDelete = ref(null)
const isDeletingNews = ref(false)
const { t } = useNuxtI18n()

const {
  isLoading,
  data: allNews,
  refresh,
  paginated,
} = useAsyncPaginationAPI(
  'organizationNewsList',
  ({ query }) => {
    return api.v1.organizationNewsList(organizationsStore.current?.code, {
      ...query,
      ordering: '-publication_date',
    })
  },
  {
    paginationConfig: {
      limit: 4,
    },
  }
)

const blockTitle = computed(() => {
  let extra = isLoading.value ? '' : ` (${paginated.total.value})`
  return t('admin.portal.news') + extra
})

const addNews = () => {
  editedNews.value = defaultForm()
}

const deleteNews = async () => {
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
</script>
