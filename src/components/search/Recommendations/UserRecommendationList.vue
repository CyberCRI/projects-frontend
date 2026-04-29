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
import UserRecommendationItem from '~/components/search/Recommendations/UserRecommendationItem.vue'
import BaseRecommendationList from '~/components/search/Recommendations/BaseRecommendationList.vue'

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
  padding: 0 $space-l;
}
</style>
