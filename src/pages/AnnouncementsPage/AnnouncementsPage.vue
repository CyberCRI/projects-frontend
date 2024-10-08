<template>
    <div class="announcements-page page-section-medium page-top">
        <h1 class="page-title">{{ $filters.capitalize($t('home.announcements')) }}</h1>

        <AnnouncementCardListSkeleton v-if="isLoading" />

        <AnnouncementCardList v-else :announcements="announcements" :is-more-toggled="true" />
    </div>
</template>
<script>
import AnnouncementCardList from '@/components/project/announcement/AnnouncementCardList.vue'
import AnnouncementCardListSkeleton from '@/components/project/announcement/AnnouncementCardListSkeleton.vue'
import { getAnnouncements } from '@/api/announcements.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'AnnouncementsPage',

    components: {
        AnnouncementCardList,
        AnnouncementCardListSkeleton,
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },
    data() {
        return {
            announcements: [],
            isLoading: false,
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
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
