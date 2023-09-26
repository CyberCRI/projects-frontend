<template>
    <div class="group">
        <SkeletonComponent width="50px" class="item" />
        <SkeletonComponent width="120px" class="item" />
        <SkeletonComponent width="100px" class="item" />
        <SkeletonComponent width="200px" class="item" />
    </div>
</template>

<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'
export default {
    name: 'SubGroupsSkeleton',
    components: { SkeletonComponent },
}
</script>

<style lang="scss" scoped>
.group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: $space-s;
    margin-bottom: calc(pxToRem(30px) - 1rem);

    .item {
        height: 30px;
        border-radius: $border-radius-30;
    }
}
</style>
