<script setup lang="ts">
import { getNewsfeed } from '@/api/newsfeed.service'
import useAPI from '@/composables/useAPI'
import useOrganizationsStore from '@/stores/useOrganizations'
import { getOrganizationByCode } from '@/api/organizations.service'

const { translateNewsfeed } = useAutoTranslate()

const organizationsStore = useOrganizationsStore()
const { t } = useNuxtI18n()

const isLoading = useState(() => false)
const request = useState(() => ({
  results: [],
  current_page: 1,
  total_page: 0,
  previous: '',
  next: '',
  first: '',
  last: '',
}))

const _newsfeed = computed(() => {
  return request.value ? request.value.results : []
})

const newsfeed = translateNewsfeed(_newsfeed)

const pagination = computed(() => {
  if (!request.value) return { total: 0 }
  return {
    currentPage: request.value.current_page,
    total: request.value.total_page,
    previous: request.value.previous,
    next: request.value.next,
    first: request.value.first,
    last: request.value.last,
  }
})

const loadNewsfeed = async () => {
  isLoading.value = true
  const req = await getNewsfeed(organizationsStore.current.code, {
    limit: 15,
  })
  request.value = req
  isLoading.value = false
}

const onClickPagination = async (requestedPage) => {
  isLoading.value = true
  request.value = await useAPI(requestedPage, {})
  window.scrollTo({ top: 0, behavior: 'smooth' })
  isLoading.value = false
}

onMounted(loadNewsfeed)

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('feed.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>

<template>
  <div class="newsfeed-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('feed.title') }}
    </h1>

    <div class="newsfeed-container">
      <div class="newsfeed-select-container" />
      <div v-if="isLoading">
        <NewsListSkeleton :limit="15" />
      </div>
      <div v-else-if="newsfeed.length" class="news-container">
        <NewsFeed :newsfeed="newsfeed" @reload-newsfeed="loadNewsfeed" />
      </div>
      <div v-else>
        <EmptyNewsFeed />
      </div>
    </div>

    <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
      <PaginationButtons
        :current="pagination.currentPage"
        :pagination="pagination"
        :total="pagination.total"
        @update-pagination="onClickPagination"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.newsfeed-title {
  margin-bottom: $space-2xl;
}

.newsfeed-container {
  padding-top: $space-xl;
  padding-inline: $space-xs;
}

.pagination-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: $space-3xl;
  padding-top: $space-unit;
}

.news-container {
  display: flex;
  flex-direction: column;
  gap: $space-l;
  justify-content: stretch;
}
</style>
