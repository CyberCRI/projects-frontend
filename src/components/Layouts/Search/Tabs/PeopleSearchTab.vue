<template>
    <ProjectListSearch
        :search="search"
        :show-pagination="true"
        mode="peoples"
        @pagination-changed="onPaginationChange"
    >
        <template #default="ProjectListSearchSlotProps">
            <CardList
                :desktop-columns-number="6"
                :is-loading="ProjectListSearchSlotProps.isLoading"
                :limit="ProjectListSearchSlotProps.limit"
                :peoples="ProjectListSearchSlotProps.peoples"
                :total-count="ProjectListSearchSlotProps.totalCount"
                :with-title="true"
                class="list-container"
            >
                <template #peoples="projectListSlotProps">
                    <UserCard
                        :user="projectListSlotProps.user"
                        @go-to="goToProfile(projectListSlotProps.user)"
                    />
                </template>
            </CardList>
        </template>
    </ProjectListSearch>
</template>

<script>
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import ProjectListSearch from '@/components/lpikit/ProjectListSearch/ProjectListSearch.vue'
import UserCard from '@/components/peopleKit/UserCard.vue'

export default {
    name: 'PeopleSearchTab',

    components: {
        UserCard,
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

        goToProfile(user) {
            this.$router.push({ name: 'ProfileOtherUser', params: { userKId: user.keycloak_id } })
        },
    },
}
</script>

<style lang="scss" scoped>
.list-container {
    margin-top: $space-l;
}
</style>
