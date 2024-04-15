<template>
    <div class="news-list-page page-section-medium page-top">
        <h1 class="page-title">{{ $t('news.list.title') }}</h1>

        <div class="create-news-button-ctn">
            <LpiButton
                v-if="canCreateNews"
                primary
                :label="$filters.capitalize($t('news.list.create'))"
                @click="createNews"
                data-test="create-news-button"
                btn-icon="Plus"
                class="create-news-button"
            />
        </div>
        <div class="news-list" v-if="loading" :class="{ 'with-pagination': pagination.total > 1 }">
            <NewsListItemSkeleton />
            <NewsListItemSkeleton />
        </div>
        <div v-else class="news-list" :class="{ 'with-pagination': pagination.total > 1 }">
            <NewsListItem
                :news="news"
                v-for="news in allNews"
                :key="news.id"
                @edit-news="editedNews = news"
                @delete-news="newsToDelete = news"
            />
        </div>
        <div v-if="pagination.total > 1" class="pagination-container">
            <PaginationButtons
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
    </div>

    <EditNewsDrawer
        :is-opened="!!editedNews"
        :news="editedNews"
        @news-edited="loadNews"
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
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import NewsListItem from '@/components/lpikit/NewsListItem/NewsListItem.vue'
import EditNewsDrawer from '@/components/lpikit/EditNewsDrawer/EditNewsDrawer.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import { getAllNews, deleteNews } from '@/api/news.service.ts'
import permissions from '@/mixins/permissions.ts'
import NewsListItemSkeleton from '@/components/lpikit/NewsListItem/NewsListItemSkeleton.vue'
import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'

export default {
    name: 'NewsListPage',

    mixins: [permissions],

    components: {
        LpiButton,
        NewsListItem,
        EditNewsDrawer,
        ConfirmModal,
        NewsListItemSkeleton,
        PaginationButtons,
    },

    data() {
        return {
            loading: false,
            editedNews: null,
            newsToDelete: null,
            isDeletingNews: false,
            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
            newsRequest: null,
            maxNewsPerPage: 12,
        }
    },

    mounted() {
        this.loadNews()
    },

    computed: {
        allNews() {
            return this.newsRequest?.results || []
        },
    },

    watch: {
        newsRequest: {
            handler(response) {
                this.updatePagination(response)
            },
            deep: true,
        },
    },

    methods: {
        createNews() {
            this.$router.push({ name: 'CreateNewsPage' })
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

        async loadNews() {
            this.loading = true
            this.newsRequest = await getAllNews(
                this.$store.getters['organizations/current']?.code,
                { limit: this.maxNewsPerPage }
            )
            this.loading = false
        },

        async onClickPagination(requestedPage) {
            this.loading = true
            this.newsRequest = (await axios.get(requestedPage)).data
            this.loading = false
            const el = document.querySelector('.page-title')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        updatePagination(response) {
            this.pagination.currentPage = response.current_page
            this.pagination.total = response.total_page
            this.pagination.previous = response.previous
            this.pagination.next = response.next
            this.pagination.first = response.first
            this.pagination.last = response.last
        },
    },
}
</script>
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
