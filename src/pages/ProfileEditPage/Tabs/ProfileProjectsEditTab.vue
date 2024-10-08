<template>
    <div class="profile-edit-projects">
        <!-- member -->
        <div class="form-group">
            <label>{{ $t('profile.edit.projects.member.label') }} ({{ memberProjectCount }})</label>
            <p class="notice">{{ $t('profile.edit.projects.member.notice') }}</p>
            <div class="project-list-wrapper">
                <UserProjectList
                    :empty-label="$t('me.no-project-participate')"
                    :limit="projectsLimit"
                    :member-role="['owners', 'members']"
                    :number-column="projectColumns"
                    :user="user"
                    class="project-list"
                    @project-count="setMemberProjectCount"
                />
            </div>
        </div>
        <hr class="separator" />
        <!-- follow -->
        <div class="form-group">
            <div class="label-wrapper">
                <label
                    >{{ $t('profile.edit.projects.followed.label') }} ({{
                        followedProjects ? followedProjects.length : 0
                    }})</label
                >
                <LinkButton
                    :label="$t('profile.edit.projects.followed.add')"
                    btn-icon="Plus"
                    @click="openFollowProjectDrawer"
                />
            </div>
            <p class="notice">{{ $t('profile.edit.projects.followed.notice') }}</p>
            <div class="project-list-wrapper">
                <UserProjectList
                    :empty-label="$t('me.no-follow')"
                    :limit="projectsLimit"
                    :number-column="projectColumns"
                    :user="user"
                    :projects="followedProjects"
                    :projects-loading="followedProjectLoading"
                    class="project-list"
                    @card-update="updateFollows"
                />
            </div>
        </div>
        <hr class="separator" />
        <!-- review -->
        <div class="form-group">
            <label
                >{{ $t('profile.edit.projects.reviewed.label') }} ({{
                    reviewedProjectCount
                }})</label
            >
            <p class="notice">{{ $t('profile.edit.projects.reviewed.notice') }}</p>
            <div class="project-list-wrapper">
                <UserProjectList
                    :empty-label="$t('me.no-project-reviewing')"
                    :limit="projectsLimit"
                    :member-role="['reviewers']"
                    :number-column="projectColumns"
                    :user="user"
                    class="project-list"
                    @project-count="setReviewedProjectCount"
                />
            </div>
        </div>
    </div>
    <PickProjectsDrawer
        v-if="showFollowProjectDrawer"
        :is-opened="showFollowProjectDrawer"
        :pre-selected-projects="followedProjects"
        @close="showFollowProjectDrawer = false"
        @picked-projects="onProjectsPicked"
        :title="$t('group.form.add-projects')"
        :asyncing="followedProjectAsyncing"
    />
</template>
<script>
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import PickProjectsDrawer from '@/components/project/PickProjectsDrawer.vue'
import followUtils from '@/functs/followUtils.ts'
import { getUserFollows } from '@/api/follows.service'

export default {
    name: 'ProfileProjectsEditTab',
    components: {
        UserProjectList,
        LinkButton,
        PickProjectsDrawer,
    },
    emits: ['profile-edited'],
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showFollowProjectDrawer: false,
            memberProjectCount: 0,
            followedProjects: [],
            reviewedProjectCount: 0,
            projectsLimit: 12,
            projectColumns: 4,
            followedProjectLoading: true,
            followedProjectAsyncing: false,
        }
    },
    mounted() {
        this.setFollowedProject()
    },
    methods: {
        openFollowProjectDrawer() {
            this.showFollowProjectDrawer = true
        },
        async setFollowedProject() {
            this.followedProjectLoading = true
            try {
                await getUserFollows({
                    follower_id: this.user.id,
                }).then((resp) => {
                    this.followedProjects = resp.results.map((follow) => follow.project)
                })
            } catch (error) {
                console.error(error)
            } finally {
                this.followedProjectLoading = false
            }
        },
        setMemberProjectCount(count) {
            this.memberProjectCount = count
        },
        setReviewedProjectCount(count) {
            this.reviewedProjectCount = count
        },

        async onProjectsPicked(projects) {
            this.followedProjectAsyncing = true

            const previousIndex = this.followedProjects.reduce((acc, project) => {
                acc[project.id] = true
                return acc
            }, {})

            const currentIndex = projects.reduce((acc, project) => {
                acc[project.id] = true
                return acc
            }, {})

            const toRemove = this.followedProjects.filter((project) => !currentIndex[project.id])
            const toAdd = projects.filter((project) => !previousIndex[project.id])

            if (toRemove.length) {
                await Promise.all(
                    toRemove.map((project) =>
                        followUtils.unfollow({
                            follower_id: project.is_followed.follow_id,
                            project_id: project.id,
                        })
                    )
                )
            }

            let listFollowedProjects = []
            for (let i = 0; i < toAdd.length; i++) {
                listFollowedProjects.push({
                    project_id: toAdd[i].id,
                })
            }
            let body = { follows: listFollowedProjects }
            await followUtils.followMany({
                id: this.user.id,
                body: body,
            })
            this.$emit('profile-edited')
            await this.setFollowedProject()
            this.followedProjectAsyncing = false
            this.showFollowProjectDrawer = false
        },
        updateFollows() {
            this.setFollowedProject()
        },
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';
</style>
