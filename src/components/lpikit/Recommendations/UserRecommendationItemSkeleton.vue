<template>
    <li class="recommendation-item">
        <div class="recommendation">
            <SkeletonComponent class="round-picture" width="50px" height="50px" />
            <div class="text-container">
                <SkeletonComponent class="margin-bottom" height="1rem" />
                <SkeletonComponent height="1rem" />
            </div>
        </div>
    </li>
</template>

<script>
import SkeletonComponent from '@/components/lpikit/Skeleton/SkeletonComponent.vue'
export default {
    name: 'UserRecommendationItemSkeleton',

    components: { SkeletonComponent },
}
</script>

<style lang="scss" scoped>
.recommendation-item {
    padding-inline: $space-m;
    width: 100%;
    box-sizing: border-box;

    &:hover {
        background: $primary-lighter;
    }
}

.recommendation {
    margin: $space-m 0;
    display: flex;
    align-items: center;
    padding: $space-s;
    width: 100%;
    box-sizing: border-box;
    gap: 1rem;
}

.round-picture {
    border-radius: 100%;
}

.text-container {
    flex-grow: 1;
}

.margin-bottom {
    margin-bottom: 1rem;
}
</style>
