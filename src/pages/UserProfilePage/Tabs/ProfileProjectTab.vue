<template>
    <div class="project-tab">
        <div v-if="isMyProfileAndCanCreateProject" class="create-project">
            <LpiButton
                :label="$t('project.create-project')"
                class="btn"
                btn-icon="Plus"
                secondary
                @click="$router.push({ name: 'createProject' })"
            />
        </div>
        <!-- user projects (Owners, Members) -->

        <UserProjectsSearch :limit="12" :member-roles="['owners', 'members']" :user="user">
            <template
                #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }"
            >
                <UserProjectList
                    :label="$filters.capitalize($t('me.projects-participate'))"
                    :empty-label="noParticipate"
                    :number-column="6"
                    :user="user"
                    :projects="projects"
                    :all-project-count="totalCount"
                    :projects-loading="isLoading"
                    :pagination="pagination"
                    @pagination-changed="paginationAction"
                    class="project-list"
            /></template>
        </UserProjectsSearch>

        <!-- user projects (Reviewers) -->
        <UserProjectsSearch :limit="12" :member-roles="['reviewers']" :user="user">
            <template
                #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }"
            >
                <UserProjectList
                    :label="$filters.capitalize($t('me.projects-reviewing'))"
                    :empty-label="noReviewLabel"
                    :number-column="6"
                    :user="user"
                    :projects="projects"
                    :all-project-count="totalCount"
                    :projects-loading="isLoading"
                    :pagination="pagination"
                    @pagination-changed="paginationAction"
                    class="project-list"
                />
            </template>
        </UserProjectsSearch>

        <!-- user projects (Followed) -->
        <UserProjectsSearch :limit="12" follow :user="user">
            <template
                #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }"
            >
                <UserProjectList
                    :label="$filters.capitalize($t('me.follow'))"
                    :empty-label="noFollowLabel"
                    :limit="12"
                    :number-column="6"
                    :user="user"
                    :projects="projects"
                    :all-project-count="totalCount"
                    :projects-loading="isLoading"
                    :pagination="pagination"
                    @pagination-changed="paginationAction"
                    class="project-list"
            /></template>
        </UserProjectsSearch>
    </div>
</template>

<script>
import UserProjectsSearch from '@/components/people/UserProfile/UserProjectsSearch.vue'
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import permissions from '@/mixins/permissions.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'ProfileProjectTab',

    mixins: [permissions],

    components: { UserProjectsSearch, UserProjectList, LpiButton },
    setup() {
        const usersStore = useUsersStore()
        return {
            usersStore,
        }
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    mounted() {
        this.setFollowedProject()
    },

    computed: {
        isMyProfileAndCanCreateProject() {
            const loggedAsID = this.usersStore.id
            return loggedAsID && this.user.id === loggedAsID && this.canCreateProject
        },

        isCurrentUser() {
            return this.usersStore.id === this.user.id
        },

        noFollowLabel() {
            return this.isCurrentUser ? this.$t('me.no-follow') : this.$t('you.no-follow')
        },

        noReviewLabel() {
            return this.isCurrentUser
                ? this.$t('me.no-project-reviewing')
                : this.$t('you.no-project-reviewing')
        },

        noParticipate() {
            return this.isCurrentUser
                ? this.$t('me.no-project-participate')
                : this.$t('you.no-project-participate')
        },
    },

    methods: {
        setFollowedProject() {},
    },
}
</script>

<style lang="scss" scoped>
.project-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $space-l;
}

.title {
    font-size: $font-size-m;
    font-weight: 700;
    color: $primary-dark;
    margin: $space-l 0;
}

.create-project {
    padding-top: $space-l;
    display: flex;
    justify-content: flex-end;
}

@media screen and (max-width: $min-tablet) {
    .project-tab {
        padding: 0 $space-s;
    }
}
</style>
