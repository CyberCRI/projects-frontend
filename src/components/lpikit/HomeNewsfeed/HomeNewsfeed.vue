<template>
    <NewsListSkeleton v-if="isLoading" :limit="5" />
    <div v-else>
        <div class="home-news-container">
            <NewsFeed :newsfeed="newsfeed" @reload-newsfeed="loadNewsfeed" />
        </div>
        <div class="see-all">
            <LpiButton :label="$t('feed.see-all')" :secondary="false" @click="seeAll" />
        </div>
    </div>
</template>

<script>
import NewsFeed from '@/components/lpikit/NewsFeed/NewsFeed.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import NewsListSkeleton from '@/components/lpikit/Skeleton/NewsListSkeleton.vue'
import { getNewsfeed } from '@/api/newsfeed.service.ts'

export default {
    name: 'HomeNewsfeed',

    components: { NewsFeed, LpiButton, NewsListSkeleton },

    props: {
        limit: {
            type: Number,
            default: 6,
        },
    },

    async mounted() {
        await this.loadNewsfeed()
    },

    data() {
        return {
            isLoading: true,
            newsfeed: [],
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
    },

    methods: {
        async loadNewsfeed() {
            this.isLoading = true
            this.newsfeed = (
                await getNewsfeed(this.organization.code, {
                    limit: this.limit,
                })
            ).results
            this.isLoading = false
        },

        seeAll() {
            this.$router.push({ name: 'Newsfeed' })
        },
    },
}
</script>

<style lang="scss" scoped>
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: $space-xl;
    margin-bottom: $space-m;
}

.home-news-container {
    display: flex;
    flex-direction: column;
    place-content: center center;
    gap: $space-l;
}

.see-all {
    margin-top: $space-l;
    display: flex;
    justify-content: center;
}
</style>
