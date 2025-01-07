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
                    <div class="project-list-header">
                        <h4 class="title">
                            {{ $t('me.projects-participate') }}
                            <span>({{ totalCount }})</span>
                        </h4>
                        <SeeMoreArrow
                            v-if="totalCount > listLimit"
                            @click.prevent="goToProfileProjects"
                            data-test="see-more"
                        />
                    </div>
                    <UserProjectList
                        :empty-label="noParticipate"
                        :limit="listLimit"
                        :number-column="listLimit"
                        :projects="projects"
                        :projects-loading="isLoading"
                        class="project-list"
                    />
                </template>
            </UserProjectsSearch>
            <!-- user projects (Reviewers) -->
            <UserProjectsSearch :limit="listLimit" :member-roles="['reviewers']" :user="user">
                <template #default="{ items: projects, isLoading, totalCount }">
                    <div class="project-list-header">
                        <h4 class="title">
                            {{ $t('me.projects-reviewing') }}
                            <span>({{ totalCount }})</span>
                        </h4>
                        <SeeMoreArrow
                            v-if="totalCount > listLimit"
                            @click.prevent="goToProfileProjects"
                            data-test="see-more"
                        />
                    </div>
                    <UserProjectList
                        :empty-label="noReviewLabel"
                        :limit="listLimit"
                        :number-column="listLimit"
                        :projects="projects"
                        :projects-loading="isLoading"
                        class="project-list"
                    />
                </template>
            </UserProjectsSearch>
            <!-- user projects (Followed) -->
            <UserProjectsSearch :limit="listLimit" follow :user="user">
                <template #default="{ items: projects, isLoading, totalCount }">
                    <div class="project-list-header">
                        <h4 class="title">
                            {{ $t('me.follow') }}
                            <span>({{ totalCount }})</span>
                        </h4>
                        <SeeMoreArrow
                            v-if="totalCount > listLimit"
                            @click.prevent="goToProfileProjects"
                            data-test="see-more"
                        />
                    </div>
                    <UserProjectList
                        :empty-label="noFollowLabel"
                        :number-column="listLimit"
                        :projects="projects"
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
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'

export default {
    name: 'ProfileSummaryTab',

    components: {
        UserProjectsSearch,
        UserProjectList,
        UserDescriptions,
        SkillSummary,
        SeeMoreArrow,
    },

    setup() {
        const usersStore = useUsersStore()
        return {
            usersStore,
        }
    },

    inject: {
        selectTab: {
            from: 'tabsLayoutSelectTab',
            default: () => {},
        },
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

    methods: {
        goToProfileProjects() {
            this.selectTab(2)
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

.project-list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: $space-2xl 0 $space-l 0;

    .title {
        font-size: $font-size-l;
        font-weight: 700;
        color: $primary-dark;
        margin: 0;
    }
}

.empty-field {
    padding-top: $space-l;
    color: $mid-gray;
    font-weight: 700;
}
</style>
