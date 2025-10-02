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
    @news-edited="loadNews"
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
<script>
import { defaultForm } from '@/components/news/NewsForm/NewsForm.vue'
import { getAllNews, deleteNews } from '@/api/news.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'NewsAdminBlock',

  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      allNews: [],
      newsCount: 0,
      isLoading: true,
      editedNews: null,
      newsToDelete: null,
      isDeletingNews: false,
    }
  },

  computed: {
    blockTitle() {
      let extra = this.isLoading ? '' : ` (${this.newsCount})`
      return this.$t('admin.portal.news') + extra
    },
  },

  async mounted() {
    await this.loadNews()
  },

  methods: {
    async loadNews() {
      this.isLoading = true
      const request = await getAllNews(this.organizationsStore.current?.code, {
        ordering: '-publication_date',
        limit: 4,
      })
      this.allNews = request.results
      this.newsCount = request.count
      this.isLoading = false
    },

    addNews() {
      this.editedNews = defaultForm()
    },

    async deleteNews() {
      this.isDeletingNews = true
      try {
        await deleteNews(this.organizationsStore.current?.code, this.newsToDelete.id)
        this.toaster.pushSuccess(this.$t('news.delete.success'))

        this.loadNews()
      } catch (err) {
        this.toaster.pushError(`${this.$t('news.delete.error')} (${err})`)
        console.error(err)
      } finally {
        this.newsToDelete = null
        this.isDeletingNews = false
      }
    },
  },
}
</script>
