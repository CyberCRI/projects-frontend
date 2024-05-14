<template>
    <div class="page-section-wide page-top recommendation-page">
        <h1 class="page-title">{{ $t('recommendations.projects.title') }}</h1>

        <CardList
            :desktop-columns-number="6"
            :is-loading="isLoading"
            :limit="limit"
            :projects="projectRecommendationsRequest?.results"
            :total-count="{ projects: projectRecommendationsRequest?.count, peoples: 0, groups: 0 }"
            class="list-container"
        >
            <template #projects="projectListSlotProps">
                <ProjectCard :project="projectListSlotProps.project" />
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
<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import CardList from '@/components/project/ProjectList/CardList.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { getProjectsRecommendationsForUser } from '@/api/recommendations.service'
import { axios } from '@/api/api.config'
export default {
    name: 'ProjectRecommendationPage',

    components: {
        ProjectCard,
        CardList,
        PaginationButtons,
    },

    data() {
        return {
            projectRecommendationsRequest: null,
            limit: 10,
            isLoading: false,
            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
        }
    },
    watch: {
        projectRecommendationsRequest: {
            handler(response) {
                this.updatePagination(response)
            },
            deep: true,
        },
    },
    async mounted() {
        this.isLoading = true
        this.projectRecommendationsRequest = await getProjectsRecommendationsForUser(
            this.$store.getters['organizations/current'].code,
            { limit: this.limit }
        )
        this.isLoading = false
    },

    methods: {
        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.projectRecommendationsRequest = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.page-title')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        updatePagination(response) {
            this.pagination.currentPage = response.current_page
            this.pagination.total = response.total_page
            this.pagination.previous = response.previous
            this.pagination.next = response.next
            this.pagination.first = response.first
            this.pagination.last = response.last
        },
    },
}
</script>
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
