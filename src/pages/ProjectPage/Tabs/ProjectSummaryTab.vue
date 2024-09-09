<template>
    <div class="project-summary">
        <div class="top">
            <div class="left">
                <DescriptionPlaceholder
                    v-if="canEditProject && showDescriptionPlaceHolder"
                    :project="project"
                ></DescriptionPlaceholder>

                <DescriptionRecap
                    v-else-if="project && project.description"
                    :description="project.description"
                />

                <GoalsRecap v-if="filteredGoals.length" :goals="filteredGoals" />

                <PublicationRecap
                    v-if="project && project.blog_entries.length"
                    :is-blog="true"
                    :publications="project.blog_entries"
                />

                <LinkedProjectsRecap
                    v-if="project && project.linked_projects.length"
                    :linked-projects="project.linked_projects"
                />

                <ReviewRecap
                    v-if="project && project.publication_status"
                    :class="project.publication_status"
                    :project="project"
                />
            </div>

            <div class="right">
                <MapRecap v-if="project && project.locations && project.locations.length" />

                <GroupMemberSection
                    v-if="project && team.length"
                    :members="team"
                    @user-click="openProfileDrawer"
                />

                <ResourcesRecap
                    v-if="project && (project.links.length || project.files.length)"
                    :files="project.files"
                    :links="project.links"
                />

                <PublicationRecap
                    v-if="comments.length"
                    :is-blog="false"
                    :publications="comments"
                />
            </div>
        </div>

        <SimilarProjects
            v-if="similarProjects && similarProjects.length"
            id="similar-projects"
            :similar-projects="similarProjects"
            class="similar-projects"
        />

        <BaseDrawer
            :has-footer="false"
            :is-opened="profileDrawer.isOpened"
            :title="$t('profile.drawer_title')"
            @close="closeProfileDrawer"
            @confirm="closeProfileDrawer"
        >
            <UserProfile
                v-if="profileDrawer.isOpened"
                ref="profile-user"
                :can-edit="false"
                :user-id="profileDrawer.user_id"
            />
        </BaseDrawer>
    </div>
</template>

<script>
import DescriptionRecap from '@/components/project/description/DescriptionRecap.vue'
import GoalsRecap from '@/components/project/goal/GoalsRecap.vue'
import PublicationRecap from '@/components/project/blog/PublicationRecap.vue'
import LinkedProjectsRecap from '@/components/project/linked-project/LinkedProjectsRecap.vue'
import MapRecap from '@/components/project/map/MapRecap.vue'
import ResourcesRecap from '@/components/project/resource/ResourcesRecap.vue'
import ReviewRecap from '@/components/project/review/ReviewRecap.vue'
import SimilarProjects from '@/components/project/SimilarProjects.vue'
import GroupMemberSection from '@/components/group/GroupMemberSection/GroupMemberSection.vue'
import ProjectTab from '@/mixins/ProjectTab.ts'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserProfile from '@/components/people/UserProfile.vue'
import DescriptionPlaceholder from '@/components/project/description/DescriptionPlaceholder.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'ProjectSummaryTab',

    mixins: [ProjectTab, permissions],

    components: {
        DescriptionPlaceholder,
        DescriptionRecap,
        GoalsRecap,
        PublicationRecap,
        LinkedProjectsRecap,
        MapRecap,
        ResourcesRecap,
        ReviewRecap,
        SimilarProjects,
        GroupMemberSection,
        UserProfile,
        BaseDrawer,
    },

    props: {
        project: {
            type: Object,
            default: () => {},
        },

        similarProjects: {
            type: Array,
            default: () => [],
        },
        comments: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            editDescriptionModalActive: false,
            profileDrawer: {
                isOpened: false,
                user_id: null,
            },
        }
    },

    computed: {
        filteredGoals() {
            return (
                (this.project &&
                    this.project.goals.filter(
                        (goal) =>
                            goal.status && (goal.status === 'complete' || goal.status === 'ongoing')
                    )) ||
                []
            )
        },

        team() {
            return [
                ...this.project.team.owners,
                ...this.project.team.reviewers,
                ...this.project.team.members,
                ...this.project.team.people_groups,
            ]
        },

        showDescriptionPlaceHolder() {
            return this.project.description.length === 0 || this.project.description === '<p></p>'
        },
    },
    methods: {
        async openProfileDrawer(user) {
            if (user.id) {
                this.profileDrawer.user_id = user.id
                this.profileDrawer.isOpened = true
            } else {
                this.$router.push({ name: 'Group', params: { groupId: user.id } })
            }
        },

        closeProfileDrawer() {
            this.isEditMode = false
            this.profileDrawer.isOpened = false
            this.profileDrawer.user_id = null
        },
    },
}
</script>

<style lang="scss" scoped>
.project-summary {
    padding: $space-2xl 0;

    .top {
        display: flex;

        .left {
            margin-right: $space-xl;
            width: calc(66.66% - $space-xl);
        }

        .right {
            width: calc(33.34% - $space-xl);
            flex-grow: 1;
        }

        > div > div:not(:first-of-type) {
            margin-top: $space-xl;
        }
    }

    .similar-projects {
        margin-top: 80px;
    }
}

@media screen and (max-width: $max-tablet) {
    .project-summary .top {
        flex-direction: column;

        .left,
        .right {
            width: 100%;
        }

        .left {
            margin-right: 0;
            margin-bottom: $space-l;
        }
    }
}

@media screen and (max-width: $min-tablet) {
    .project-summary {
        padding: $space-2xl $space-s;
    }
}
</style>
