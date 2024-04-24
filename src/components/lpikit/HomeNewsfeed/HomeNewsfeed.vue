<template>
    <NewsListSkeleton v-if="isLoading" :limit="5" />
    <div v-else>
        <div class="home-news-container">
            <NewsfeedAnnouncementsItem
                v-for="(announcement, index) in announcements"
                :key="index"
                :announcement="announcement"
            />
            <NewsfeedProjectItem
                v-for="(project, index) in projects"
                :key="index"
                :project="project"
            />
        </div>
        <div class="see-all">
            <LpiButton :label="$t('feed.see-all')" :secondary="false" @click="seeAll" />
        </div>
    </div>
</template>

<script>
import NewsfeedProjectItem from '@/components/lpikit/HomeNewsfeed/NewsfeedProjectItem.vue'
import { getAllProjects } from '@/api/projects.service'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import NewsListSkeleton from '@/components/lpikit/Skeleton/NewsListSkeleton.vue'
import { getAnnouncements } from '@/api/announcements.service'
import NewsfeedAnnouncementsItem from '@/components/lpikit/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'

export default {
    name: 'HomeNewsfeed',

    components: { NewsfeedProjectItem, LpiButton, NewsListSkeleton, NewsfeedAnnouncementsItem },

    async mounted() {
        const projects = await getAllProjects({
            organizations: [this.organization.code],
            ordering: '-updated_at',
            limit: 5,
        })
        this.projects = projects.results

        await this.getAnnouncements()

        this.isLoading = false
    },

    data() {
        return {
            projects: [],
            isLoading: true,
            announcements: [],
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
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
