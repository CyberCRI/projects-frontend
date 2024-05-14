<template>
    <DynamicGrid :min-gap="20" class="announcements-list">
        <AnnouncementCardSkeleton />
        <AnnouncementCardSkeleton />
    </DynamicGrid>
</template>

<script>
import AnnouncementCardSkeleton from '@/components/project/AnnouncementCard/AnnouncementCardSkeleton.vue'
import DynamicGrid from '@/components/lpikit/DynamicGrid/DynamicGrid.vue'
export default {
    name: 'AnnouncementCardListSkeleton',

    components: {
        AnnouncementCardSkeleton,
        DynamicGrid,
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
