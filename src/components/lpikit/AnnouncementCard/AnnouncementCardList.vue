<template>
    <div class="announcements-list">
        <template v-if="!isMoreToggled">
            <AnnouncementCard
                v-for="(announcement, index) in showedAnnouncements"
                :key="index"
                :announcement="announcement"
                @know-more-clicked="linkToAnnouncement(announcement)"
            />
        </template>

        <AnnouncementCard
            v-for="(announcement, index) in announcements"
            v-else
            :key="index"
            :announcement="announcement"
            @know-more-clicked="linkToAnnouncement(announcement)"
        />
    </div>
</template>

<script>
import AnnouncementCard from '@/components/lpikit/AnnouncementCard/AnnouncementCard.vue'

export default {
    name: 'AnnouncementCardList',

    components: {
        AnnouncementCard,
    },
    data() {
        return {
            showSnackbar: false,
        }
    },

    props: {
        announcements: {
            type: Array,
            required: true,
        },

        isMoreToggled: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        linkToAnnouncement(announcement) {
            this.$router.push(`/projects/${announcement.project.slug}/announcements#tab`)
        },
    },

    computed: {
        showedAnnouncements() {
            return this.isMoreToggled ? this.announcements : this.announcements.slice(0, 3)
        },
    },
}
</script>

<style lang="scss" scoped>
.announcements-list {
    display: grid;
    grid-gap: pxToRem(50px);
    grid-template-columns: 1fr;

    @media (min-width: $min-tablet) {
        grid-template-columns: 1fr 1fr;
    }

    @media (min-width: $min-desktop) {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

:deep(.announcement-card) {
    cursor: pointer;
}
</style>
