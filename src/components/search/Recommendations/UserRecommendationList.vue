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
import BaseRecommendationList from '@/components/search/Recommendations/BaseRecommendationList.vue'
import UserRecommendationItem from '@/components/search/Recommendations/UserRecommendationItem.vue'

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
            this.$router.push({ name: 'UserRecommendationPage' })
        },
    },
}
</script>
<style lang="scss" scoped>
.notice {
    line-height: 1.5;
    padding: 0 $space-l;
}
</style>
