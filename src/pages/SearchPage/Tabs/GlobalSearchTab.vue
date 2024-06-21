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
                :groups="ProjectListSearchSlotProps.groups"
                :peoples="ProjectListSearchSlotProps.peoples"
                class="list-container"
            >
                <template #projects="projectListSlotProps">
                    <ProjectCard :project="projectListSlotProps.project" />
                </template>
                <template #groups="projectListSlotProps">
                    <GroupCard :group="projectListSlotProps.group" />
                </template>
                <template #peoples="projectListSlotProps">
                    <UserCard
                        :user="projectListSlotProps.user"
                        :to-link="{
                            name: 'ProfileOtherUser',
                            params: {
                                userId:
                                    projectListSlotProps.user.slug || projectListSlotProps.user.id,
                            },
                        }"
                    />
                </template>
            </CardList>
        </template>
    </ProjectListSearch>
</template>

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import CardList from '@/components/base/CardList.vue'
import ProjectListSearch from '@/components/project/ProjectListSearch.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import UserCard from '@/components/people/UserCard.vue'

export default {
    name: 'GlobalSearchTab',

    components: {
        UserCard,
        GroupCard,
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
