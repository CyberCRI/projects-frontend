<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #actions>
            <LinkButton btn-icon="Plus" :label="$t('common.add')" @click="addNews"></LinkButton>
        </template>
        <template #default>
            <NewsAdminListItem
                v-for="news in allNews"
                :key="news.id"
                :news="news"
                @edit-news="editedNews = news"
                @delete-news="newsToDelete = news"
            ></NewsAdminListItem>
        </template>

        <template #footer>
            <LinkButton
                btn-icon="ArrowRight"
                :label="$t('common.see-all')"
                :to="{ name: 'NewsListPage' }"
            />
        </template>
    </AdminBlock>

    <EditNewsDrawer
        :is-opened="!!editedNews"
        @close="editedNews = null"
        @news-edited="loadNews"
        :news="editedNews"
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
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import EditNewsDrawer from '@/components/lpikit/EditNewsDrawer/EditNewsDrawer.vue'
import { defaultForm } from '@/components/lpikit/NewsForm/NewsForm.vue'
import NewsAdminListItem from './NewsAdminListItem.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import { getAllNews, deleteNews } from '@/api/news.service.ts'

export default {
    name: 'NewsAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        EditNewsDrawer,
        NewsAdminListItem,
        ConfirmModal,
    },

    data() {
        return {
            allNews: [],
            isLoading: true,
            editedNews: null,
            newsToDelete: null,
            isDeletingNews: false,
        }
    },

    computed: {
        blockTitle() {
            let extra = this.isLoading ? '' : ` (${this.allNews.length})`
            return this.$t('admin.portal.news') + extra
        },
    },

    async mounted() {
        await this.loadNews()
    },

    methods: {
        async loadNews() {
            this.isLoading = true
            this.allNews = (
                await getAllNews(this.$store.getters['organizations/current']?.code)
            ).results
            this.isLoading = false
        },

        addNews() {
            this.editedNews = defaultForm()
        },

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
                this.loadNews()
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
