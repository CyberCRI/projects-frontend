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
    :asyncing="isDeletingNews"
    @cancel="newsToDelete = null"
    @confirm="localDeleteNews"
  />
</template>
<script setup lang="ts">
import EditNewsDrawer from '@/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import NewsfeedAnnouncementsItem from '@/components/home/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'
import NewsfeedProjectItem from '@/components/home/HomeNewsfeed/NewsfeedProjectItem.vue'
import NewsListItem from '@/components/news/NewsListItem/NewsListItem.vue'
import { deleteNews } from '@/api/news.service'
import useToasterStore from '@/stores/useToaster'
import { NewsfeedModel } from '@/models/newsfeed.model'

defineProps<{ newsfeed: NewsfeedModel[] }>()

const emit = defineEmits<{
  'reload-newsfeed': []
}>()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const editedNews = ref(null)
const newsToDelete = ref(null)
const isDeletingNews = ref(false)
const { t } = useNuxtI18n()

const localDeleteNews = async () => {
  isDeletingNews.value = true
  try {
    await deleteNews(organizationCode, newsToDelete.value.id)
    toaster.pushSuccess(t('news.delete.success'))

    emit('reload-newsfeed')
  } catch (err) {
    toaster.pushError(`${t('news.delete.error')} (${err})`)
    console.error(err)
  } finally {
    newsToDelete.value = null
    isDeletingNews.value = false
  }
}
</script>
