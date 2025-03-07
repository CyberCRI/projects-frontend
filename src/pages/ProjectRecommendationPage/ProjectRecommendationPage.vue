<script setup>
import { getProjectsRecommendationsForUser } from '@/api/recommendations.service'
import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

const organizationsStore = useOrganizationsStore()
const { t } = useI18n()

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

try {
    const runtimeConfig = useRuntimeConfig()
    const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
    useLpiHead(
        useRequestURL().toString(),
        computed(() => t('recommendations.projects.title')),
        organization?.dashboard_subtitle,
        organization?.banner_image?.variations?.medium
    )
} catch (err) {
    console.log(err)
}
</script>
<template>
    <div class="page-section-wide page-top recommendation-page">
        <h1 class="page-title">{{ $t('recommendations.projects.title') }}</h1>

        <CardList
            :desktop-columns-number="6"
            :is-loading="isLoading"
            :limit="limit"
            :items="projectRecommendationsRequest?.results"
            class="list-container"
        >
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
