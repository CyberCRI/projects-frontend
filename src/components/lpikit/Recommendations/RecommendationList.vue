<template>
    <div class="recommendation-list">
        <ul
            v-if="recommendations.length > 0 && !userRecommendation"
            class="recommendation-list-container"
        >
            <ProjectRecommendationItem
                v-for="(recommendation, index) in recommendations"
                :key="index"
                :recommendation="recommendation"
            />
        </ul>
        <ul
            v-else-if="recommendations.length > 0 && userRecommendation"
            class="recommendation-list-container"
        >
            <UserRecommendationItem
                v-for="(recommendation, index) in recommendations"
                :key="index"
                :recommendation="recommendation"
            />
        </ul>
        <div v-else class="empty">
            <p class="empty-recommendation">{{ $t('recommendations.empty') }}</p>
        </div>
        <div class="more">
            <LpiButton
                :label="
                    userRecommendation
                        ? $t('recommendations.more-profiles')
                        : $t('recommendations.more-projects')
                "
                :secondary="true"
                @click="goToMoreRecommendations"
            >
            </LpiButton>
        </div>
    </div>
</template>

<script>
import ProjectRecommendationItem from '@/components/lpikit/Recommendations/ProjectRecommendationItem.vue'
import UserRecommendationItem from '@/components/lpikit/Recommendations/UserRecommendationItem.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'RecommendationList',

    components: { ProjectRecommendationItem, UserRecommendationItem, LpiButton },

    props: {
        recommendations: {
            type: Array,
            default: () => [],
        },

        userRecommendation: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        goToMoreRecommendations() {
            this.$router.push({ name: 'Search' })
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
