<template>
    <ProjectListSearch
        :search="search"
        :show-pagination="true"
        mode="groups"
        @pagination-changed="onPaginationChange"
    >
        <template #default="ProjectListSearchSlotProps">
            <CardList
                :desktop-columns-number="6"
                :is-loading="ProjectListSearchSlotProps.isLoading"
                :limit="ProjectListSearchSlotProps.limit"
                :groups="ProjectListSearchSlotProps.groups"
                class="list-container"
            >
                <template #groups="projectListSlotProps">
                    <GroupCard :group="projectListSlotProps.group" />
                </template>
            </CardList>
        </template>
    </ProjectListSearch>
</template>

<script>
import CardList from '@/components/base/CardList.vue'
import ProjectListSearch from '@/components/project/ProjectListSearch.vue'
import GroupCard from '@/components/group/GroupCard.vue'

export default {
    name: 'GroupSearchTab',

    components: {
        GroupCard,
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
