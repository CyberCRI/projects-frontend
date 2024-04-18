<template>
    <div class="newsfeed-page page-section-medium page-top">
        <h1 class="page-title">
            {{ $t('feed.title') }}
        </h1>

        <div class="newsfeed-container">
            <div class="newsfeed-select-container"></div>
            <div v-if="isLoading">
                <NewsListSkeleton :limit="15" />
            </div>
            <div v-else class="news-container">
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
                </div>
            </div>
        </div>

        <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
            <PaginationButtons
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
    </div>
</template>

<script>
import { getNewsfeed } from '@/api/newsfeed.service.ts'
import NewsfeedAnnouncementsItem from '@/components/lpikit/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'
import NewsfeedProjectItem from '@/components/lpikit/HomeNewsfeed/NewsfeedProjectItem.vue'
import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import NewsListSkeleton from '@/components/lpikit/Skeleton/NewsListSkeleton.vue'

export default {
    name: 'NewsfeedPage',

    components: {
        NewsfeedAnnouncementsItem,
        NewsfeedProjectItem,
        PaginationButtons,
        NewsListSkeleton,
    },

    data() {
        return {
            isLoading: false,
            request: {},
        }
    },

    async mounted() {
        await this.loadNewsfeed()
    },

    computed: {
        newsfeed() {
            return this.request ? this.request.results : []
        },

        pagination() {
            if (!this.request) return { total: 0 }
            console.log(this.request)
            return {
                currentPage: this.request.current_page,
                total: this.request.total_page,
                previous: this.request.previous,
                next: this.request.next,
                first: this.request.first,
                last: this.request.last,
            }
        },
    },

    methods: {
        async loadNewsfeed() {
            this.isLoading = true
            const req = await getNewsfeed(this.$store.state.organizations.current.code, {
                limit: 15,
            })
            this.request = req
            this.newsfeed = req.results
            this.isLoading = false
        },

        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.request = (await axios.get(requestedPage)).data
            window.scrollTo({ top: 0, behavior: 'smooth' })
            this.isLoading = false
        },
    },
}
</script>

<style lang="scss" scoped>
.newsfeed-title {
    margin-bottom: $space-2xl;
}

.newsfeed-container {
    padding-top: $space-xl;
    padding-inline: $space-xs;
}

.pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: $space-3xl;
    padding-top: $space-unit;
}

.news-container {
    display: flex;
    flex-direction: column;
    gap: $space-l;
    justify-content: stretch;
}
</style>
