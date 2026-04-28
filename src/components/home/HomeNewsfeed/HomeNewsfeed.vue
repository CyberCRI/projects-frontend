<template>
  <FetchLoader :status="status" only-error skeleton>
    <div v-if="newsFeed.length">
      <div class="home-news-container">
        <NewsFeed :newsfeed="newsFeed" />
      </div>
      <div class="see-all">
        <LpiButton :to="{ name: 'Newsfeed' }" :label="$t('feed.see-all')" :secondary="false" />
      </div>
    </div>
    <EmptyLabel v-else :label="$t('feed.empty')" />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getNewsfeed } from '~/api/v2/newsfeed.service'

import LpiButton from '~/components/base/button/LpiButton.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import NewsFeed from '~/components/app/NewsFeed.vue'

import { newsFeedSkeleton } from '~/skeletons/newsfeed.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 6 })
const organizationCode = useOrganizationCode()

const { status, data: newsFeed } = getNewsfeed(organizationCode, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(newsFeedSkeleton, props.limit),
})
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: $space-xl;
  margin-bottom: $space-m;
}

.home-news-container {
  display: flex;
  flex-direction: column;
  place-content: center center;
  gap: $space-l;
}

.see-all {
  margin-top: $space-l;
  display: flex;
  justify-content: center;
}
</style>
