<template>
    <div class="instruction-list-item">
        <div class="instruction-title-ctn">
            <SkeletonComponent tag="h3" height="24px" width="100%" />
        </div>
        <div class="instruction-excerpt" :style="style">
            <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="100%" />
            <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="100%" />
            <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="100%" />
        </div>
        <div class="read-more-ctn">
            <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="60px" />
        </div>
    </div>
</template>
<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'
export default {
    name: 'InstructionListItemSkeleton',

    components: {
        SkeletonComponent,
    },
}
</script>
<style scoped lang="scss">
.instruction-list-item {
    --instruction-dimension: 13rem;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
    height: var(--instruction-dimension);
    overflow: hidden;
    padding: 1rem;
    border: $border-width-s solid $gray-10;
    border-radius: 1rem;
}

.instruction-title-ctn {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.instruction-title {
    font-size: $font-size-xl;
}

.instruction-excerpt {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-flow: column;
}

.read-more-ctn {
    flex-shrink: 0;
    padding: 1rem 0;
}

.text-skeleton {
    margin-bottom: 1rem;
}
</style>
