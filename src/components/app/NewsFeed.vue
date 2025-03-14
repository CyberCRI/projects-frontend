<template>
  <div v-for="(item, index) in newsfeed" :key="index">
    <NewsfeedAnnouncementsItem
      v-if="item.type == 'announcement'"
      class="newsfeed-announcement"
      :announcement="item.announcement"
    />
    <NewsfeedProjectItem
      v-else-if="item.type == 'project'"
      class="newsfeed-project"
      :project="item.project"
    />
    <NewsListItem
      v-else-if="item.type == 'news'"
      class="newsfeed-news"
      :news="item.news"
      @edit-news="editedNews = item.news"
      @delete-news="newsToDelete = item.news"
    />
  </div>
  <EditNewsDrawer
    :is-opened="!!editedNews"
    :news="editedNews"
    @news-edited="$emit('reload-newsfeed')"
    @close="editedNews = null"
  />

  <ConfirmModal
    v-if="newsToDelete"
    :content="$t('news.delete.message')"
    :title="$t('news.delete.title')"
    cancel-button-label="common.cancel"
    confirm-button-label="common.delete"
    :asyncing="isDeletingNews"
    @cancel="newsToDelete = null"
    @confirm="deleteNews"
  />
</template>
<script>
import EditNewsDrawer from '@/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import NewsfeedAnnouncementsItem from '@/components/home/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'
import NewsfeedProjectItem from '@/components/home/HomeNewsfeed/NewsfeedProjectItem.vue'
import NewsListItem from '@/components/news/NewsListItem/NewsListItem.vue'
import { deleteNews } from '@/api/news.service.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'NewsFeed',
  components: {
    NewsfeedAnnouncementsItem,
    NewsfeedProjectItem,
    NewsListItem,
    EditNewsDrawer,
    ConfirmModal,
  },

  props: {
    newsfeed: {
      type: Array,
      required: true,
    },
  },
  emits: ['reload-newsfeed'],
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
      editedNews: null,
      newsToDelete: null,
      isDeletingNews: false,
    }
  },

  methods: {
    async deleteNews() {
      this.isDeletingNews = true
      try {
        await deleteNews(this.organizationsStore.current?.code, this.newsToDelete.id)
        this.toaster.pushSuccess(this.$t('news.delete.success'))

        this.$emit('reload-newsfeed')
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
