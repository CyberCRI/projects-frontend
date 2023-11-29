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
        <UserProjectList
            :label="$filters.capitalize($t('me.projects-participate'))"
            :empty-label="noParticipate"
            :limit="12"
            :member-role="['owners', 'members']"
            :number-column="6"
            :user="user"
            class="project-list"
        />

        <!-- user projects (Reviewers) -->
        <UserProjectList
            :label="$filters.capitalize($t('me.projects-reviewing'))"
            :empty-label="noReviewLabel"
            :limit="12"
            :member-role="['reviewers']"
            :number-column="6"
            :user="user"
            class="project-list"
        />

        <!-- user projects (Followed) -->
        <UserProjectList
            :label="$filters.capitalize($t('me.follow'))"
            :empty-label="noFollowLabel"
            :limit="12"
            :number-column="6"
            :user="user"
            :projects="filteredFollowedProjects"
            :projects-loading="followedProjectLoading"
            class="project-list"
        />
    </div>
</template>

<script>
import UserProjectList from '@/components/lpikit/UserProfile/UserProjectList.vue'
import permissions from '@/mixins/permissions.ts'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import { getUserFollows } from '@/api/follows.service'

export default {
    name: 'ProfileProjectTab',

    mixins: [permissions],

    components: {
        UserProjectList,
        LpiButton,
    },

    props: {
        user: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            followedProjectLoading: true,
            filteredFollowedProjects: [],
        }
    },

    mounted() {
        this.setFollowedProject()
    },

    computed: {
        isMyProfileAndCanCreateProject() {
            const loggedAsKID = this.$store.getters['users/kid']
            return loggedAsKID && this.user.keycloak_id === loggedAsKID && this.canCreateProject
        },

        isCurrentUser() {
            return this.$store.getters['users/kid'] === this.user.keycloak_id
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
        setFollowedProject() {
            getUserFollows({
                follower_id: this.user.keycloak_id,
            }).then((resp) => {
                this.followedProjects = resp.results
                this.sortFollows()
            })
        },

        sortFollows() {
            this.filteredFollowedProjects = this.followedProjects.map((follow) => follow.project)
            this.followedProjectLoading = false
        },
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
