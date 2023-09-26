<template>
    <ProjectListSearch
        :search="search"
        :show-pagination="true"
        mode="global"
        @pagination-changed="onPaginationChange"
    >
        <template #default="ProjectListSearchSlotProps">
            <CardList
                :desktop-columns-number="6"
                :is-loading="ProjectListSearchSlotProps.isLoading"
                :limit="ProjectListSearchSlotProps.limit"
                :projects="ProjectListSearchSlotProps.projects"
                class="list-container"
            >
                <template #default="projectListSlotProps">
                    <ProjectCard :project="projectListSlotProps.project" />
                </template>
            </CardList>
        </template>
    </ProjectListSearch>
</template>

<script>
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectListSearch from '@/components/lpikit/ProjectListSearch/ProjectListSearch.vue'

export default {
    name: 'BrowseProjectList',

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
