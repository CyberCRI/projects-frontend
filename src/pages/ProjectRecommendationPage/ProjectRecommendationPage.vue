<script setup>
import { getProjectsRecommendationsForUser } from '@/api/recommendations.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

const organizationsStore = useOrganizationsStore()
const { t } = useNuxtI18n()

const projectRecommendationsRequest = useState(() => null)
const limit = useState(() => 10)
const isLoading = useState(() => false)

const pagination = computed(() => ({
  currentPage: projectRecommendationsRequest.value?.current_page || 1,
  total: projectRecommendationsRequest.value?.total_page || 1,
  previous: projectRecommendationsRequest.value?.previous,
  next: projectRecommendationsRequest.value?.next,
  first: projectRecommendationsRequest.value?.first,
  last: projectRecommendationsRequest.value?.last,
}))

const onClickPagination = async (requestedPage) => {
  isLoading.value = true
  projectRecommendationsRequest.value = await useAPI(requestedPage, {})
  isLoading.value = false
  const el = document.querySelector('.page-title')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  isLoading.value = true
  projectRecommendationsRequest.value = await getProjectsRecommendationsForUser(
    organizationsStore.current.code,
    { limit: limit.value }
  )
  isLoading.value = false
})

const { translateProjects } = useAutoTranslate()
const _results = computed(() => projectRecommendationsRequest.value?.results)
const results = translateProjects(_results)

useLpiHead2({
  title: computed(() => t('recommendations.projects.title')),
})
</script>

<template>
  <div class="page-section-wide page-top recommendation-page">
    <h1 class="page-title">
      {{ $t('recommendations.projects.title') }}
    </h1>

    <CardList :is-loading="isLoading" :limit="limit" :items="results" class="list-container">
      <template #default="projectListSlotProps">
        <ProjectCard :project="projectListSlotProps.item" />
      </template>
    </CardList>

    <div v-if="pagination.total > 1 && !isLoading" class="pagination-wrapper">
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
.pagination-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: $space-xl;
}

.recommendation-page {
  margin-bottom: 4rem;
}
</style>
