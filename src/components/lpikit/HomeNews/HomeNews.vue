<template>
    <LpiLoader v-if="isLoading" class="loading" type="simple" />
    <div v-else>
        <div class="home-news-container">
            <HomeNewsItem v-for="(info, index) in news" :key="index" :news="info" />
        </div>
        <div class="see-all">
            <LpiButton :label="$t('feed.see-all')" :secondary="false"> </LpiButton>
        </div>
    </div>
</template>

<script>
import HomeNewsItem from '@/components/lpikit/HomeNews/HomeNewsItem.vue'
import { getAllProjects } from '@/api/projects.service'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'

export default {
    name: 'HomeNews',

    components: { HomeNewsItem, LpiButton, LpiLoader },

    props: {
        organization: {
            type: Object,
            default: () => {},
        },
    },

    async mounted() {
        const projects = await getAllProjects({
            organizations: [this.organization.code],
            ordering: '-updated_at',
            limit: 5,
        })
        this.news = projects.results
        this.isLoading = false
    },

    data() {
        return {
            news: [],
            isLoading: true,
        }
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
    justify-content: center;
    align-content: center;
}

.see-all {
    display: flex;
    justify-content: center;
}
</style>
