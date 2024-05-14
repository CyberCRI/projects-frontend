<template>
    <li class="recommendation-item">
        <div class="recommendation">
            <SkeletonComponent width="50px" height="50px" />
            <div class="text-container">
                <SkeletonComponent class="margin-bottom" height="1rem" />
                <SkeletonComponent height="1rem" />
            </div>
        </div>
    </li>
</template>

<script>
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'
export default {
    name: 'ProjectRecommendationItemSkeleton',

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

.text-container {
    flex-grow: 1;
}

.margin-bottom {
    margin-bottom: 1rem;
}
</style>
