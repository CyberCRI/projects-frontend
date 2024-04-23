<template>
    <BaseRecommendationList
        :recommendations="recommendations"
        :more-label="$t('recommendations.more-profiles')"
        @goto-more-recommendations="goToMoreRecommendations"
    >
        <UserRecommendationItem
            v-for="(recommendation, index) in recommendations"
            :key="index"
            :recommendation="recommendation"
        />
    </BaseRecommendationList>
</template>

<script>
import BaseRecommendationList from '@/components/lpikit/Recommendations/BaseRecommendationList.vue'
import UserRecommendationItem from '@/components/lpikit/Recommendations/UserRecommendationItem.vue'

export default {
    name: 'UserRecommendationList',

    components: { BaseRecommendationList, UserRecommendationItem },

    props: {
        recommendations: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        goToMoreRecommendations() {
            this.$router.push({ name: 'Search' })
        },
    },
}
</script>
