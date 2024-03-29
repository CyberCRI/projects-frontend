<template>
    <h1 class="newsfeed-title">
        {{ $t('feed.title') }}
    </h1>

    <div class="newsfeed-container page-section-wide">
        <div class="newsfeed-select-container"></div>
        <div v-if="isLoading">
            <NewsListSkeleton :limit="15" />
        </div>
        <div v-else class="news-container">
            <div v-for="(item, index) in newsfeed" :key="index">
                <HomeAnnouncementsItem
                    v-if="item.type == 'announcement'"
                    class="newsfeed-announcement"
                    :announcement="item.announcement"
                />
                <HomeNewsItem
                    v-else-if="item.type == 'project'"
                    class="newsfeed-project"
                    :news="item.project"
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
</template>

<script>
import { getNewsfeed } from '@/api/newsfeed.service.ts'
import HomeAnnouncementsItem from '@/components/lpikit/HomeNews/HomeAnnouncementsItem.vue'
import HomeNewsItem from '@/components/lpikit/HomeNews/HomeNewsItem.vue'
import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import NewsListSkeleton from '@/components/lpikit/Skeleton/NewsListSkeleton.vue'

export default {
    name: 'NewsfeedPage',

    components: {
        HomeAnnouncementsItem,
        HomeNewsItem,
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
    font-weight: 700;
    font-size: $font-size-xl;
    text-align: center;
    margin-bottom: $space-xl;
    margin-top: $space-3xl;

    @media screen and (min-width: $min-tablet) {
        font-size: $font-size-4xl;
        margin-bottom: $space-l;
    }
}

.newsfeed-container {
    padding-top: $space-xl;
    padding-inline: $space-xs;
    width: 100%;

    @media (min-width: $min-tablet) {
        width: 65%;
        padding: $space-l;
    }
}

.pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: $space-3xl;
}

.news-container {
    display: flex;
    flex-direction: column;
    gap: $space-l;
}
</style>
