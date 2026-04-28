<template>
  <BaseRecommendationList
    :recomendations="users"
    :more-label="$t('recommendations.more-profiles')"
    :to="{ name: 'UserRecommendationPage' }"
  >
    <UserRecommendationItem v-for="user in users" :key="user.id" :user="user" />
  </BaseRecommendationList>
</template>

<script setup lang="ts">
import UserRecommendationItem from '@/components/search/Recommendations/UserRecommendationItem.vue'
import BaseRecommendationList from '@/components/search/Recommendations/BaseRecommendationList.vue'
import type { TranslatedUserModel } from '@/models/user.model'

defineProps<{
  users: TranslatedUserModel[]
}>()
</script>
<style lang="scss" scoped>
.notice {
  padding: 0 $space-l;
}
</style>
