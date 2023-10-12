<template>
    <div class="skeleton">
        <div class="skeleton">
            <SkeletonComponent width="60%" height="25px" border-radius="10px" />
            <SkeletonComponent width="80%" height="20px" border-radius="10px" />
            <SkeletonComponent width="45%" height="20px" border-radius="10px" />
            <SkeletonComponent width="100%" height="15px" border-radius="10px" />
            <SkeletonComponent width="90%" height="15px" border-radius="10px" />
            <SkeletonComponent width="95%" height="15px" border-radius="10px" />
        </div>
        <h2 class="title">{{ $t('group.members') }}</h2>
        <MemberListSkeleton :desktop-columns-number="6" />
        <h2 class="title">{{ $t('group.projects') }}</h2>
        <ProjectListSkeleton :desktop-columns-number="6" />
    </div>
</template>

<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'
import ProjectListSkeleton from '@/components/lpikit/Skeleton/ProjectListSkeleton.vue'
import MemberListSkeleton from '@/components/lpikit/Skeleton/MemberListSkeleton.vue'
export default {
    name: 'SnapshotSkeleton',
    components: {
        SkeletonComponent,
        ProjectListSkeleton,
        MemberListSkeleton,
    },
}
</script>

<style lang="scss" scoped>
.skeleton {
    margin: $space-xl 0;

    .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $primary-dark;
        margin-bottom: $space-xl;
    }
}
</style>
