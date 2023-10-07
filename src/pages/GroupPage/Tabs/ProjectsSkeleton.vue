<template>
    <div class="skeleton">
        <h2 class="title">{{ $t('group.group-projects') }}</h2>
        <ProjectListSkeleton :desktop-columns-number="6" />
    </div>
</template>

<script>
import ProjectListSkeleton from '@/components/lpikit/Skeleton/ProjectListSkeleton.vue'
export default {
    name: 'ProjectsSkeleton',
    components: {
        ProjectListSkeleton,
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
