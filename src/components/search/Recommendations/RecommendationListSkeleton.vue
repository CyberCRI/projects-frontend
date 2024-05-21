<template>
    <div class="recommendation-list">
        <ul v-if="!userRecommendation" class="recommendation-list-container">
            <ProjectRecommendationItemSkeleton
                v-for="index in recommendationsNumber"
                :key="index"
            />
        </ul>
        <ul v-else class="recommendation-list-container">
            <UserRecommendationItemSkeleton v-for="index in recommendationsNumber" :key="index" />
        </ul>
    </div>
</template>

<script>
import ProjectRecommendationItemSkeleton from '@/components/search/Recommendations/ProjectRecommendationItemSkeleton.vue'
import UserRecommendationItemSkeleton from '@/components/search/Recommendations/UserRecommendationItemSkeleton.vue'

export default {
    name: 'RecommendationListSkeleton',

    components: { ProjectRecommendationItemSkeleton, UserRecommendationItemSkeleton },

    props: {
        recommendationsNumber: {
            type: Number,
            default: 4,
        },
        userRecommendation: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.recommendation-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-block: $space-m;
    width: 100%;
}

.recommendation-list-container {
    width: 100%;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: $space-l;
}

.more {
    margin-block: $space-s;
}
</style>
