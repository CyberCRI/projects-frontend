<template>
    <LpiLoader v-if="isLoading" class="loading" type="simple" />
    <div v-else>
        <div class="home-news-container">
            <HomeAnnouncementsItem
                v-for="(announcement, index) in announcements"
                :key="index"
                :announcement="announcement"
            />
            <HomeNewsItem v-for="(info, index) in news" :key="index" :news="info" />
        </div>
        <div class="see-all">
            <LpiButton :label="$t('feed.see-all')" :secondary="false" @click="seeAll" />
        </div>
    </div>
</template>

<script>
import HomeNewsItem from '@/components/lpikit/HomeNews/HomeNewsItem.vue'
import { getAllProjects } from '@/api/projects.service'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'
import { getAnnouncements } from '@/api/announcements.service'
import HomeAnnouncementsItem from '@/components/lpikit/HomeNews/HomeAnnouncementsItem.vue'

export default {
    name: 'HomeNews',

    components: { HomeNewsItem, LpiButton, LpiLoader, HomeAnnouncementsItem },

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

        await this.getAnnouncements()

        this.isLoading = false
    },

    data() {
        return {
            news: [],
            isLoading: true,
            announcements: [],
        }
    },

    methods: {
        seeAll() {
            this.$router.push({ name: 'Newsfeed' })
        },

        getAnnouncements() {
            return getAnnouncements({
                organizations: [this.organization.code],
                ordering: '-updated_at',
            })
                .then(({ results }) => {
                    this.announcements = results.filter(
                        (announcement) =>
                            announcement.project.publication_status !== 'private' &&
                            (!announcement.deadline ||
                                new Date(announcement.deadline) >= new Date().setHours(0, 0, 0, 0))
                    )
                })
                .catch((err) => {
                    console.error(err)
                })
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
