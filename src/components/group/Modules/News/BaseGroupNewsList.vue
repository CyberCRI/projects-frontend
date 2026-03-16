<template>
  <FetchLoader :status="status" only-error skeleton>
    <NewsItem v-for="news in data" :key="news.title" :news="news" />
    <PaginationButtonsV2 v-if="withPagination" :pagination="pagination" />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupNews } from '@/api/v2/group.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import NewsItem from '@/components/news/NewsListItem/NewsItem.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { QueryFilterNews } from '@/models/news.model'
import { factoriesSkeleton, maxSkeleton } from '@/skeletons/base.skeletons'
import { newsSkeleton } from '@/skeletons/news.skeletons'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    withPagination?: boolean
  }>(),
  {
    withPagination: true,
    limit: null,
  }
)

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const { query } = useQuery<QueryFilterNews>({})

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.news, props.limit))

const { status, data, pagination } = getGroupNews(organizationCode, groupId, {
  query,
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoriesSkeleton(newsSkeleton, limitSkeletons.value),
})
</script>
