<template>
    <SearchResults
        :search="search"
        :mode="searchMode"
        show-pagination
        @pagination-changed="onPaginationChange"
    >
        <template #default="SearchResultsSlotProps">
            <CardList
                :desktop-columns-number="6"
                :is-loading="SearchResultsSlotProps.isLoading"
                :limit="SearchResultsSlotProps.limit"
                :items="SearchResultsSlotProps.items"
                class="list-container"
            >
                <template #default="projectListSlotProps">
                    <ProjectCard
                        v-if="projectListSlotProps.item.type == 'project'"
                        :project="projectListSlotProps.item.project"
                    />
                    <GroupCard
                        v-if="projectListSlotProps.item.type == 'people_group'"
                        :group="projectListSlotProps.item.people_group"
                    />
                    <UserCard
                        v-if="projectListSlotProps.item.type == 'user'"
                        :user="projectListSlotProps.item.user"
                        :to-link="{
                            name: 'ProfileOtherUser',
                            params: {
                                userId:
                                    projectListSlotProps.item.user.slug ||
                                    projectListSlotProps.item.user.id,
                            },
                        }"
                    />
                </template>
            </CardList>
        </template>
    </SearchResults>
</template>

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import CardList from '@/components/base/CardList.vue'
import SearchResults from '@/components/project/SearchResults.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import UserCard from '@/components/people/UserCard.vue'

export default {
    name: 'GlobalSearchTab',

    components: {
        UserCard,
        GroupCard,
        ProjectCard,
        CardList,
        SearchResults,
    },

    props: {
        search: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        searchMode() {
            // translate src/components/search/SearchOptions/SearchOptions.vue sectionFilters key
            // to SearchResults mode

            if (this.search.section === 'projects') return 'projects'

            if (this.search.section === 'people') return 'peoples'

            if (this.search.section === 'groups') return 'groups'

            return 'global'
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
