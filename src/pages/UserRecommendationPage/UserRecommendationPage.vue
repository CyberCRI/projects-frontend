<script setup>
import { getUsersRecommendationsForUser } from '@/api/recommendations.service'
import useAPI from '@/composables/useAPI.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const organizationsStore = useOrganizationsStore()
const { t } = useNuxtI18n()

const usersRecommendationsRequest = useState(() => null)
const limit = useState(() => 10)
const isLoading = useState(() => false)
const pagination = computed(() => ({
  currentPage: usersRecommendationsRequest.value?.current_page || 1,
  total: usersRecommendationsRequest.value?.total_page || 1,
  previous: usersRecommendationsRequest.value?.previous || undefined,
  next: usersRecommendationsRequest.value?.next || undefined,
  first: usersRecommendationsRequest.value?.first || undefined,
  last: usersRecommendationsRequest.value?.last || undefined,
}))

onMounted(async () => {
  isLoading.value = true
  usersRecommendationsRequest.value = await getUsersRecommendationsForUser(
    organizationsStore.current.code,
    { limit: limit.value }
  )
  isLoading.value = false
})

const onClickPagination = async (requestedPage) => {
  isLoading.value = true
  usersRecommendationsRequest.value = await useAPI(requestedPage, {})
  isLoading.value = false
  const el = document.querySelector('.page-title')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('recommendations.connect-to')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="page-section-wide page-top recommendation-page">
    <h1 class="page-title">
      {{ $t('recommendations.connect-to') }}
    </h1>

    <CardList
      :desktop-columns-number="6"
      :is-loading="isLoading"
      :limit="limit"
      :items="usersRecommendationsRequest?.results"
      class="list-container"
    >
      <template #default="peoplesListSlotProps">
        <UserCard
          :user="peoplesListSlotProps.item"
          :to-link="{
            name: 'ProfileOtherUser',
            params: {
              userId: peoplesListSlotProps.item.slug || peoplesListSlotProps.item.id,
            },
          }"
        />
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
