<template>
    <div class="skeleton">
        <h2 class="title">{{ $t('group.group-members') }}</h2>
        <MemberListSkeleton :desktop-columns-number="6" />
    </div>
</template>

<script>
import MemberListSkeleton from '@/components/lpikit/Skeleton/MemberListSkeleton.vue'
export default {
    name: 'MembersSkeleton',
    components: {
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
