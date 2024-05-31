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
            <UserProjectList
                :is-preview="true"
                :label="$filters.capitalize($t('me.projects-participate'))"
                :empty-label="noParticipate"
                :limit="listLimit"
                :member-role="['owners', 'members']"
                :number-column="listLimit"
                :user="user"
                class="project-list"
                @card-update="updateFollows"
            />

            <!-- user projects (Reviewers) -->
            <UserProjectList
                :is-preview="true"
                :label="$filters.capitalize($t('me.projects-reviewing'))"
                :empty-label="noReviewLabel"
                :limit="listLimit"
                :member-role="['reviewers']"
                :number-column="listLimit"
                :user="user"
                class="project-list"
                @card-update="updateFollows"
            />

            <!-- user projects (Followed) -->
            <UserProjectList
                :is-preview="true"
                :label="$filters.capitalize($t('me.follow'))"
                :empty-label="noFollowLabel"
                :limit="listLimit"
                :number-column="listLimit"
                :user="user"
                :projects="filteredFollowedProjects"
                :projects-loading="followedProjectLoading"
                class="project-list"
                @card-update="updateFollows"
            />
        </div>
        <div class="skills-mobile">
            <SkillSummary :user="user" />
        </div>
    </div>
</template>

<script>
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import UserDescriptions from '@/components/people/UserDescriptions.vue'
import SkillSummary from '@/components/people/skill/SkillSummary.vue'
import { getUserFollows } from '@/api/follows.service'

export default {
    name: 'ProfileSummaryTab',

    components: {
        UserProjectList,
        UserDescriptions,
        SkillSummary,
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
            followedProjects: [],
            filteredFollowedProjects: [],
            listLimit: 6,
        }
    },

    async mounted() {
        if (this.user) this.setFollowedProject()
    },

    computed: {
        isCurrentUser() {
            return this.$store.getters['users/id'] === this.user.id
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
        setFollowedProject() {
            getUserFollows({
                follower_id: this.user.id,
            })
                .then((resp) => {
                    this.followedProjects = resp.results
                    this.sortFollows()
                })
                .finally(() => {
                    this.isLoading = false
                })
        },

        sortFollows() {
            this.filteredFollowedProjects = []
            this.followedProjects.forEach((follow) => {
                this.filteredFollowedProjects.push(follow.project)
            })

            this.followedProjectLoading = false
        },

        updateFollows() {
            this.setFollowedProject()
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
            padding: 0 $font-size-2xs;
        }
    }
}

.empty-field {
    padding-top: $space-l;
    color: $mid-gray;
    font-weight: 700;
}
</style>
