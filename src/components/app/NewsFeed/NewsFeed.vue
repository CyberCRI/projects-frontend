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
        @cancel="newsToDelete = null"
        @confirm="deleteNews"
        :asyncing="isDeletingNews"
    />
</template>
<script>
import EditNewsDrawer from '@/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import NewsfeedAnnouncementsItem from '@/components/home/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'
import NewsfeedProjectItem from '@/components/home/HomeNewsfeed/NewsfeedProjectItem.vue'
import NewsListItem from '@/components/news/NewsListItem/NewsListItem.vue'
import { deleteNews } from '@/api/news.service.ts'
export default {
    name: 'NewsFeed',
    emits: ['reload-newsfeed'],
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
                await deleteNews(
                    this.$store.getters['organizations/current']?.code,
                    this.newsToDelete.id
                )
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('news.delete.success'),
                    type: 'success',
                })
                this.$emit('reload-newsfeed')
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('news.delete.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.newsToDelete = null
                this.isDeletingNews = false
            }
        },
    },
}
</script>
