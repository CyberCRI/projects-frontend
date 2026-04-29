<template>
  <div class="newsfeed-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('feed.title') }}
    </h1>

    <FetchLoader :status="status" only-error skeleton>
      <div class="newsfeed-container">
        <div v-if="newsfeed.length" class="news-container">
          <NewsFeed :newsfeed="newsfeed" />
        </div>
        <EmptyLabel v-else :label="$t('feed.empty')" />
        <PaginationButtonsV2 :pagination="pagination" />
      </div>
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import { getNewsfeed } from '~/api/v2/newsfeed.service'

import FetchLoader from '~/components/base/FetchLoader.vue'
import NewsFeed from '~/components/app/NewsFeed.vue'

import { newsFeedSkeleton } from '~/skeletons/newsfeed.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'

const { t } = useNuxtI18n()
const LIMIT = 15
const organizationCode = useOrganizationCode()
const {
  status,
  data: newsfeed,
  pagination,
} = getNewsfeed(organizationCode, {
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(newsFeedSkeleton, LIMIT),
})

useLpiHead2({
  title: computed(() => t('feed.title')),
})
</script>

<style lang="scss" scoped>
.newsfeed-container {
  padding: $space-xl 0;
  padding-inline: $space-xs;
}

.news-container {
  display: flex;
  flex-direction: column;
  gap: $space-l;
  justify-content: stretch;
}
</style>
