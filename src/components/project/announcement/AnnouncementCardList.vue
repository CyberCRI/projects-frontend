<template>
    <DynamicGrid :min-gap="20" class="announcements-list">
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
    </DynamicGrid>
</template>

<script>
import AnnouncementCard from '@/components/project/announcement/AnnouncementCard.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'
export default {
    name: 'AnnouncementCardList',

    components: {
        AnnouncementCard,
        DynamicGrid,
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
            this.$router.push({
                name: 'projectAnnouncements',
                params: { slugOrId: announcement.project.slug },
                hash: '#tab',
            })
        },
    },

    computed: {
        showedAnnouncements() {
            return this.isMoreToggled ? this.announcements : this.announcements.slice(0, 6)
        },
    },
}
</script>

<style lang="scss" scoped>
.announcements-list {
    width: 100%;
    justify-content: center;
}

:deep(.announcement-card) {
    cursor: pointer;
}
</style>
