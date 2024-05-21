<template>
    <ProjectListSearch
        :search="search"
        :show-pagination="true"
        mode="projects"
        @pagination-changed="onPaginationChange"
    >
        <template #default="ProjectListSearchSlotProps">
            <CardList
                :desktop-columns-number="6"
                :is-loading="ProjectListSearchSlotProps.isLoading"
                :limit="ProjectListSearchSlotProps.limit"
                :projects="ProjectListSearchSlotProps.projects"
                :total-count="ProjectListSearchSlotProps.totalCount"
                :with-title="true"
                class="list-container"
            >
                <template #projects="projectListSlotProps">
                    <ProjectCard :project="projectListSlotProps.project" />
                </template>
            </CardList>
        </template>
    </ProjectListSearch>
</template>

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import CardList from '@/components/base/CardList.vue'
import ProjectListSearch from '@/components/project/ProjectListSearch.vue'

export default {
    name: 'ProjectSearchTab',

    components: {
        ProjectCard,
        CardList,
        ProjectListSearch,
    },

    props: {
        search: {
            type: Object,
            default: () => {},
        },
    },

    methods: {
        onPaginationChange(pagination) {
            if (
                this.$route.query.page === pagination.currentPage ||
                (!this.$route.query.page && pagination.currentPage === 1)
            )
                return
            this.$router.push({
                path: this.$route.path,
                query: { ...this.$route.query, page: pagination.currentPage },
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.list-container {
    margin-top: $space-l;
}
</style>
