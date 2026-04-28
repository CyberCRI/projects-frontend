<template>
  <BaseRecommendationList
    :recommendations="recommendations"
    :more-label="$t('recommendations.more-projects')"
    @goto-more-recommendations="goToMoreRecommendations"
  >
    <ProjectRecommendationItem
      v-for="(recommendation, index) in recommendations"
      :key="index"
      :recommendation="recommendation"
    />
  </BaseRecommendationList>
</template>

<script>
import ProjectRecommendationItem from '~/components/search/Recommendations/ProjectRecommendationItem.vue'
import BaseRecommendationList from '~/components/search/Recommendations/BaseRecommendationList.vue'

export default {
  name: 'ProjectRecommendationList',

  components: { BaseRecommendationList, ProjectRecommendationItem },

  props: {
    recommendations: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    goToMoreRecommendations() {
      this.$router.push({ name: 'ProjectRecommendationPage' })
    },
  },
}
</script>
