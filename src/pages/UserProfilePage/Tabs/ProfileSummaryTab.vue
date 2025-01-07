<template>
    <div class="profile-summary">
        <div class="top">
            <div class="left">
                <!-- User descriptions -->
                <UserDescriptions
                    :is-limited="true"
                    v-if="user.personal_description || user.professional_description"
                    :user="user"
                    class="user-description"
                />
                <p v-else class="empty-field">{{ noDescription }}</p>
            </div>

            <div class="right">
                <SkillSummary :user="user" />
            </div>
        </div>
        <div class="lists">
            <!-- user projects (Owners, Members) -->
            <UserProjectsSearch
                :limit="listLimit"
                :member-roles="['owners', 'members']"
                :user="user"
            >
                <template #default="{ items: projects, isLoading, totalCount }">
                    <UserProjectList
                        is-preview
                        :label="$filters.capitalize($t('me.projects-participate'))"
                        :empty-label="noParticipate"
                        :limit="listLimit"
                        :number-column="listLimit"
                        :projects="projects"
                        :all-project-count="totalCount"
                        :projects-loading="isLoading"
                        class="project-list"
                    />
                </template>
            </UserProjectsSearch>
            <!-- user projects (Reviewers) -->
            <UserProjectsSearch :limit="listLimit" :member-roles="['reviewers']" :user="user">
                <template #default="{ items: projects, isLoading, totalCount }">
                    <UserProjectList
                        is-preview
                        :label="$filters.capitalize($t('me.projects-reviewing'))"
                        :empty-label="noReviewLabel"
                        :limit="listLimit"
                        :number-column="listLimit"
                        :projects="projects"
                        :all-project-count="totalCount"
                        :projects-loading="isLoading"
                        class="project-list"
                    />
                </template>
            </UserProjectsSearch>
            <!-- user projects (Followed) -->
            <UserProjectsSearch :limit="listLimit" follow :user="user">
                <template #default="{ items: projects, isLoading, totalCount }">
                    <UserProjectList
                        is-preview
                        :label="$filters.capitalize($t('me.follow'))"
                        :empty-label="noFollowLabel"
                        :number-column="listLimit"
                        :projects="projects"
                        :all-project-count="totalCount"
                        :projects-loading="isLoading"
                        class="project-list"
                    />
                </template>
            </UserProjectsSearch>
        </div>
        <div class="skills-mobile">
            <SkillSummary :user="user" />
        </div>
    </div>
</template>

<script>
import UserProjectsSearch from '@/components/people/UserProfile/UserProjectsSearch.vue'
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import UserDescriptions from '@/components/people/UserDescriptions.vue'
import SkillSummary from '@/components/people/skill/SkillSummary.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'ProfileSummaryTab',

    components: {
        UserProjectsSearch,
        UserProjectList,
        UserDescriptions,
        SkillSummary,
    },

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

    data() {
        return {
            listLimit: 6,
        }
    },

    computed: {
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

        noDescription() {
            return this.isCurrentUser ? this.$t('me.no-bio') : this.$t('you.no-bio')
        },
    },
}
</script>

<style lang="scss" scoped>
.profile-summary {
    padding: $space-l 0;

    .top {
        display: flex;
        gap: $space-xl;

        .left {
            flex-basis: 66.66%;
            flex-grow: 1;
        }

        .right {
            flex-basis: 33.34%;
            flex-grow: 1;
            margin-top: $space-42;
        }
    }

    .project-list {
        width: 100%;
    }

    .user-description {
        margin-top: $space-42;
    }

    .lists {
        padding: 0;
    }

    .skills-mobile {
        display: none;
    }
}

@media screen and (max-width: $max-tablet) {
    .profile-summary {
        padding: $space-s;

        .skills-mobile {
            display: block;
        }
    }

    .profile-summary .top {
        flex-direction: column;

        .right {
            display: none;
        }

        .left {
            width: 100%;
            margin-right: 0;
            margin-bottom: $space-l;
        }

        .lists {
            padding: 0 $layout-size-2xs;
        }
    }
}

.empty-field {
    padding-top: $space-l;
    color: $mid-gray;
    font-weight: 700;
}
</style>
