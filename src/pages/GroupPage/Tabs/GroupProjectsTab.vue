<template>
    <div class="group-projects">
        <div class="projects">
            <div class="projects-header">
                <h2 class="title">
                    {{ $t('group.group-projects') }}
                    <span v-if="!isLoading">( {{ projectsCount }} )</span>
                </h2>
            </div>
            <div class="projects-container">
                <ProjectListSkeleton v-if="isLoading" :desktop-columns-number="6" />
                <CardList
                    v-else
                    :desktop-columns-number="6"
                    :is-loading="isLoading"
                    :limit="4"
                    :projects="projects"
                >
                    <template #projects="projectListSlotProps">
                        <ProjectCard
                            :horizontal-display="true"
                            :project="projectListSlotProps.project"
                        />
                    </template>
                </CardList>
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
    </div>
</template>

<script>
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import PaginationButtons from '@/components/lpikit/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import ProjectListSkeleton from '@/components/lpikit/Skeleton/ProjectListSkeleton.vue'

export default {
    name: 'GroupProjectsTab',

    components: {
        CardList,
        ProjectCard,
        PaginationButtons,
        ProjectListSkeleton,
    },

    props: {
        projectsInitialRequest: {
            type: Object,
            default: () => ({}),
        },

        isProjectsLoading: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            style: {},

            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
            projectsRequest: this.projectsInitialRequest,
            isPaginationLoading: false,
        }
    },

    computed: {
        projects() {
            return this.projectsRequest.results || []
        },
        projectsCount() {
            return this.projectsRequest.count || 0
        },
        isLoading() {
            return this.isProjectsLoading || this.isPaginationLoading
        },
    },
    methods: {
        async onClickPagination(requestedPage) {
            this.isPaginationLoading = true
            this.projectsRequest = (await axios.get(requestedPage)).data
            this.isPaginationLoading = false
            const el = document.querySelector('.group-projects .projects-header')
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
    watch: {
        projectsRequest: {
            handler: function (response) {
                if (response) this.updatePagination(response)
            },
            immediate: true,
        },

        projectsInitialRequest: {
            handler: function (projectsInitialRequest) {
                if (projectsInitialRequest) this.projectsRequest = projectsInitialRequest
            },
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.group-projects {
    .projects {
        margin-top: $space-2xl;
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        &-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            gap: $space-l;

            .title {
                font-weight: 700;
                font-size: $font-size-l;
                color: $primary-dark;
            }
        }

        &-container {
            width: 100%;
        }
    }

    .pagination-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: $space-xl;
    }
}
</style>
