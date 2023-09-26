<template>
    <SkeletonComponent class="skeleton" height="500px" border-radius="21px" />
</template>

<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'

export default {
    name: 'TabContentSkeleton',

    components: {
        SkeletonComponent,
    },
}
</script>

<style lang="scss" scoped>
.skeleton {
    margin: $space-xl 0;
}
</style>
