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
            <SummaryAction
                btn-icon="ArrowRight"
                :action-label="$t('common.see-all')"
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
import LinkButton from '@/components/base/button/LinkButton.vue'
import EditNewsDrawer from '@/components/news/EditNewsDrawer/EditNewsDrawer.vue'
import { defaultForm } from '@/components/news/NewsForm/NewsForm.vue'
import NewsAdminListItem from './NewsAdminListItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { getAllNews, deleteNews } from '@/api/news.service.ts'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'

export default {
    name: 'NewsAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        EditNewsDrawer,
        NewsAdminListItem,
        ConfirmModal,
        SummaryAction,
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
            const request = await getAllNews(this.$store.getters['organizations/current']?.code, {
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
