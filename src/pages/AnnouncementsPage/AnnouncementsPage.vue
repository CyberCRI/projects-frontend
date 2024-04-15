<template>
    <div class="announcements-page page-section-medium page-top">
        <h1 class="page-title">{{ $filters.capitalize($t('home.announcements')) }}</h1>

        <AnnouncementCardListSkeleton v-if="isLoading" />

        <AnnouncementCardList v-else :announcements="announcements" :is-more-toggled="true" />
    </div>
</template>
<script>
import AnnouncementCardList from '@/components/lpikit/AnnouncementCard/AnnouncementCardList.vue'
import AnnouncementCardListSkeleton from '@/components/lpikit/AnnouncementCard/AnnouncementCardListSkeleton.vue'
import { getAnnouncements } from '@/api/announcements.service'
export default {
    name: 'AnnouncementsPage',

    components: {
        AnnouncementCardList,
        AnnouncementCardListSkeleton,
    },

    data() {
        return {
            announcements: [],
            isLoading: false,
        }
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
    },

    mounted() {
        this.getAnnouncements()
    },

    methods: {
        getAnnouncements() {
            this.isLoading = true
            getAnnouncements({
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
                .finally(() => {
                    this.isLoading = false
                })
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: $space-2xl;
}
.announcements-page {
    margin-bottom: $space-2xl;
}
</style>
