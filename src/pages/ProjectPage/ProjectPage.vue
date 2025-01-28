<template>
    <div class="page-section-extra-wide project-layout">
        <ProjectHeader
            :project="project"
            :sdgs="sdgs"
            :similar-projects="similarProjects"
            :loading="loading"
            class="project-header"
            @show-project-announcements="goToTab('announcements')"
            :announcements="announcements"
            :follow="follow"
            @update-follow="follow = $event"
        />

        <div class="tabs-wrapper">
            <ProjectTabsSkeleton v-if="loading" />
            <ProjectTabs
                v-else
                :project="project"
                @reload-project="reloadProject"
                :locations="locations"
                :comments="comments"
                @reload-comments="getComments(project.id)"
                :project-messages="projectMessages"
                @reload-project-messages="getProjectMessages(project.id)"
                :announcements="announcements"
                @reload-announcements="getAnnouncements"
                :similar-projects="similarProjects"
                :file-resources="fileResources"
                @reload-file-resources="getFileResources"
                :link-resources="linkResources"
                @reload-link-resources="getLinkResources"
                :blog-entries="blogEntries"
                @reload-blog-entries="getBlogEntries"
                :goals="goals"
                @reload-goals="getGoals"
                :sdgs="sdgs"
                @reload-sdgs="getSdgs"
                :team="team"
                @reload-team="reloadTeam"
                :reviews="reviews"
                @reload-reviews="getReviews"
                :linked-projects="linkedProjects"
                @reload-linked-projects="getLinkedProjects"
            />
        </div>

        <!-- add/edit modals -->
        <ProjectDrawer
            v-if="modals.project.visible"
            :is-opened="modals.project.visible"
            @close="toggleAddModal('project')"
            @project-edited="reloadProject"
        />
        <GoalDrawer
            :project="project"
            :edited-goal="modals.goal.editedItem"
            :is-opened="modals.goal.visible"
            @close="toggleAddModal('goal')"
            @reload-goals="getGoals"
        />
        <TeamDrawer
            :project="project"
            :current-users="mergedTeam"
            :selected-categories="this.project?.categories || []"
            :edited-user="modals.teamMember?.editedItem || null"
            :is-opened="modals.teamMember.visible"
            @close="toggleAddModal('teamMember')"
            @reload-team="reloadTeam"
        />
        <ResourceDrawer
            :project="project"
            :is-add-mode="!modals.resource.editedItem"
            :is-opened="modals.resource.visible"
            :selected-item="modals.resource.editedItem"
            @close="toggleAddModal('resource')"
            @reload-file-resources="getFileResources"
            @reload-link-resources="getLinkResources"
        />
        <AnnouncementDrawer
            :project="project"
            :announcement="modals.announcement.editedItem"
            @reload-announcements="getAnnouncements"
            :is-add-mode="!modals.announcement.editedItem"
            :is-opened="modals.announcement.visible"
            @close="toggleAddModal('announcement')"
        />
        <LinkedProjectDrawer
            :project="project"
            :already-linked-projects="linkedProjects"
            :edited-linked-project="modals.linkedProject.editedItem"
            @reload-linked-projects="getLinkedProjects($event)"
            :is-opened="modals.linkedProject.visible"
            @close="toggleAddModal('linkedProject')"
        />
        <LocationDrawer
            :project-id="project?.id"
            :locations="locations"
            @reload-locations="getProjectLocations"
            :is-opened="modals.location.visible"
            @close="toggleAddModal('location')"
        />
        <BlogDrawer
            :project="project"
            :edited-blog="modals.blogEntry.editedItem"
            :is-add-mode="!modals.blogEntry.editedItem"
            :is-opened="modals.blogEntry.visible"
            @close="toggleAddModal('blogEntry')"
            @reload-blog-entries="getBlogEntries"
        />

        <SdgsDrawer
            class="medium"
            :project="project"
            :is-opened="modals.sdg.visible"
            :sdgs="sdgs || []"
            @reload-sdgs="getSdgs"
            @close="toggleAddModal('sdg')"
        />
    </div>
</template>

<script>
import ProjectHeader from '@/components/project/ProjectHeader.vue'
import ProjectTabs from '@/components/project/ProjectTabs.vue'
import ProjectTabsSkeleton from '@/components/project/ProjectTabsSkeleton.vue'
import GoalDrawer from '@/components/project/goal/GoalDrawer.vue'
import TeamDrawer from '@/components/people/ProjectTeamDrawer/TeamDrawer.vue'
import AnnouncementDrawer from '@/components/project/announcement/AnnouncementDrawer.vue'
import LinkedProjectDrawer from '@/components/project/linked-project/LinkedProjectDrawer.vue'
import LocationDrawer from '@/components/project/map/LocationDrawer.vue'
import BlogDrawer from '@/components/project/blog/BlogDrawer.vue'
import ResourceDrawer from '@/components/project/resource/ResourceDrawer.vue'
import ProjectDrawer from '@/components/project/ProjectDrawer.vue'
import SdgsDrawer from '@/components/project/sdg/SdgsDrawer.vue'

import utils from '@/functs/functions.ts'

import { getSuggestedProjects } from '@/api/welearn.service.ts'
import { ref, provide, computed, toRaw } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { HocuspocusProvider } from '@hocuspocus/provider'
import permissions from '@/mixins/permissions.ts'
import { getComments } from '@/api/comments.service'
import { getProjectMessages } from '@/api/project-messages.service'
import { getProjectLocations } from '@/api/locations.services'
import { getAttachmentLinks } from '@/api/attachment-links.service.ts'
import { getAttachmentFiles } from '@/api/attachment-files.service.ts'
import { getProjectAnnouncements } from '@/api/announcements.service'
import { getBlogEntries } from '@/api/blogentries.service'
import { getAllGoals } from '@/api/goals.service'
import { getProject } from '@/api/projects.service'
import { getReviews } from '@/api/reviews.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'ProjectPage',

    mixins: [permissions],

    components: {
        BlogDrawer,
        ResourceDrawer,
        ProjectHeader,
        ProjectTabs,
        ProjectTabsSkeleton,
        GoalDrawer,
        TeamDrawer,
        AnnouncementDrawer,
        LinkedProjectDrawer,
        LocationDrawer,
        ProjectDrawer,
        SdgsDrawer,
    },

    setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        const projectsStore = useProjectsStore()
        const usersStore = useUsersStore()

        const modals = ref({
            project: {
                visible: false,
                editedItem: null,
            },
            goal: {
                visible: false,
                editedItem: null,
            },
            sdg: {
                visible: false,
            },
            teamMember: {
                visible: false,
            },
            announcement: {
                visible: false,
                editedItem: null,
            },
            resource: {
                visible: false,
                editedItem: null,
            },
            comment: {
                visible: false,
                editedItem: {
                    originalComment: null,
                    repliedComment: null,
                },
            },
            linkedProject: {
                visible: false,
                editedItem: null,
            },
            blogEntry: {
                visible: false,
                editedItem: null,
            },
            location: {
                visible: false,
                editedItem: null,
            },
        })
        const route = useRoute()
        const router = useRouter()
        const project = computed(() => {
            return projectsStore.project
        })

        const toggleAddModal = (modalType, editedItem = null) => {
            if (editedItem) {
                modals.value[modalType].editedItem = editedItem
            } else modals.value[modalType].editedItem = null

            modals.value[modalType].visible = !modals.value[modalType].visible
        }

        const goToTab = async (tab, dontFocusTab) => {
            let tabPath = `/projects/${project.value.slug}/${tab}`
            if (route.path !== tabPath) {
                if (!dontFocusTab) tabPath += '#tab'
                return router.push(tabPath)
            } else {
                // still add hash to url
                if (route && route.hash !== '#tab') {
                    tabPath += '#tab'
                    await router.push(tabPath)
                }
                // however previous route change dont trigger beforeRouteEnter
                if (!dontFocusTab) {
                    utils.scrollTo(document.querySelector('.tabs-wrapper'))
                }
                return Promise.resolve()
            }
        }

        provide('projectLayoutToggleAddModal', toggleAddModal)
        provide('projectLayoutGoToTab', goToTab)

        return {
            toaster,
            modals,
            toggleAddModal,
            goToTab,
            organizationsStore,
            projectsStore,
            usersStore,
        }
    },

    data() {
        return {
            similarProjects: [],
            sockerserver: import.meta.env.VITE_APP_WSS_HOST,
            provider: null,
            loading: true,
            comments: [],
            projectMessages: [],
            locations: [],
            announcements: [],
            fileResources: [],
            linkResources: [],
            blogEntries: [],
            follow: { is_followed: false },
            goals: [],
            sdgs: [],
            team: { owners: [], members: [], reviewers: [] },
            reviews: [],
            linkedProjects: [],
            commentLoop: null,
        }
    },

    created() {
        this.setProject(this.$route.params.slugOrId)
        utils.resetScroll()
    },

    beforeUnmount() {
        if (this.commentLoop) clearInterval(this.commentLoop)
        this.cleanupProvider()
    },

    provide() {
        return { projectLayoutProjectPatched: this.projectPatched }
    },

    computed: {
        project() {
            return this.projectsStore.project
        },

        isMemberOrAdmin() {
            const members = [...this.team.members, ...this.team.owners, ...this.team.reviewers]
            return this.isAdmin || members.find((user) => this.usersStore.id === user.id)
        },

        accessToken() {
            return this.usersStore.accessToken
        },
        mergedTeam() {
            // this is damn ugly but necessary for compatibility with TeamResultList
            // witch expects [{user: { ... }, role: '...'}, {user: { ... }, role: '...'} ... ]
            return [
                ...(this.team.owners || []),
                ...(this.team.reviewers || []),
                ...(this.team.members || []),
                ...(this.team.people_groups || []),
            ].map((user) => ({
                user,
            }))
        },
    },

    methods: {
        projectPatched(data) {
            if (this.provider?.document) {
                const projectUpdates = this.provider.document.getMap('projectUpdates')
                projectUpdates.set('data', { ...data, clientID: this.provider.document.clientID })
            }
        },

        async onProjectUpdate() {
            const projectUpdates = this.provider.document.getMap('projectUpdates')
            const data = projectUpdates.get('data')

            // skip if we are the ones who updated the description
            if (this.provider.document.clientID == data.clientID) return

            // skip if update is before current project / blog data update time
            if (data.type == 'blog-entry-create' || data.type == 'blog-entry-update') {
                let old = (this.project.blog_entries || []).find((b) => b.id == data.id)
                if (old && old.updated_at >= data.updated_at) {
                    return
                }
            } else if (data.type === 'description-update') {
                if (this.project.updated_at >= data.updated_at) {
                    return
                }
            }

            // update project (yes, the whole project... TODO: fine grain this)
            this.reloadProject()

            // real update, notify user
            let message = data.author_name + ' ' + this.$t(data.scope)

            this.toaster.pushInfo(message)
        },
        // toggleAddModal(modalType, editedItem) {
        //     if (editedItem) this.modals[modalType].editedItem = editedItem
        //     else this.modals[modalType].editedItem = null
        //     this.modals[modalType].visible = !this.modals[modalType].visible
        // },

        async getReviews() {
            try {
                const response = await getReviews(this.project.id)
                this.reviews = response.results
            } catch (err) {
                console.error(err)
            }
        },

        async getGoals() {
            try {
                const response = await getAllGoals(this.project.id)
                this.goals = response.results
            } catch (err) {
                console.error(err)
            }
        },
        async getLinkedProjects(linkedProjects) {
            if (linkedProjects) {
                this.linkedProjects = linkedProjects
            } else {
                try {
                    // TODO beg for a dedicated endpoint
                    const response = await getProject(this.project.id)
                    this.linkedProjects = response.linked_projects
                } catch (err) {
                    console.error(err)
                }
            }
        },
        async getSdgs() {
            try {
                // TODO beg for a dedicated endpoint
                const response = await getProject(this.project.id)
                this.sdgs = response.sdgs
            } catch (err) {
                console.error(err)
            }
        },
        async getTeam() {
            try {
                // TODO beg for a dedicated endpoint
                const response = await getProject(this.project.id)
                this.team = response.team
            } catch (err) {
                console.error(err)
            }
        },

        async reloadTeam() {
            await this.getTeam()
            // reload current user rights in case they changed
            await this.usersStore.getUser(this.usersStore.userFromApi.id)
        },

        async getBlogEntries() {
            try {
                const response = await getBlogEntries(this.project.id)
                this.blogEntries = (response.results || []).sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })
            } catch (err) {
                console.error(err)
            }
        },

        async getFileResources() {
            try {
                const response = await getAttachmentFiles(this.project.id)
                this.fileResources = response.results
            } catch (err) {
                console.error(err)
            }
        },

        async getLinkResources() {
            try {
                const response = await getAttachmentLinks(this.project.id)
                this.linkResources = response.results
            } catch (err) {
                console.error(err)
            }
        },

        async getComments(project_id) {
            try {
                const response = await getComments(project_id)
                this.comments = response.results
            } catch (err) {
                console.error(err)
            }
        },

        async getProjectMessages(project_id) {
            try {
                const response = await getProjectMessages(project_id)
                this.projectMessages = response.results
            } catch (err) {
                console.error(err)
            }
        },

        async getAnnouncements() {
            try {
                const response = await getProjectAnnouncements(this.project.id)
                this.announcements = response.results
            } catch (err) {
                console.error(err)
            }
        },

        setProject(projectSlugOrId = this.$route.params.slugOrId) {
            this.loading = true
            this.projectsStore
                .getProject(projectSlugOrId)
                .then(async (project) => {
                    this.follow = project.is_followed
                    this.goals = this.project.goals
                    this.sdgs = this.project.sdgs
                    this.team = this.project.team
                    this.reviews = this.project.reviews
                    this.linkedProjects = this.project.linked_projects

                    const extraData = [
                        this.getComments(project.id), // TODO remove param and use this.proejct.id in method, also chnage handler
                        this.getProjectLocations(),
                        this.getSimilarProjects(),
                        this.getAnnouncements(),
                        this.getFileResources(),
                        this.getLinkResources(),
                        this.getBlogEntries(),
                    ]

                    if (this.isMemberOrAdmin) {
                        extraData.push(
                            // TODO remove param and use this.proejct.id in method, also chnage handler
                            this.getProjectMessages(project.id)
                        )
                    }
                    await Promise.all(extraData)
                    if (!this.commentLoop) {
                        this.commentLoop = setInterval(
                            () => {
                                this.getComments(project.id)
                                if (this.isMemberOrAdmin) {
                                    this.getProjectMessages(project.id)
                                }
                            },
                            5 * 60 * 1000
                        )
                    }
                    this.connectToSocket(project.id)
                    this.loading = false
                })
                .catch((err) => {
                    console.log(err)
                    this.$router.replace({
                        name: 'page404',
                        params: { pathMatch: this.$route.path.substring(1).split('/') },
                    })
                })
        },

        async reloadProject() {
            return await this.projectsStore.getProject(this.project.id)
        },

        connectToSocket() {
            // listen for description updates
            if (this.canEditProject) {
                try {
                    const providerParams = {
                        projectId: this.projectsStore.currentProjectId,
                        organizationId: this.organizationsStore.current.id,
                    }

                    this.provider = new HocuspocusProvider({
                        url: this.sockerserver,
                        name: 'description_update_' + this.project.id,
                        token: this.accessToken,
                        parameters: providerParams,
                    })

                    const projectUpdates = toRaw(this.provider).document.getMap('projectUpdates')

                    // Listen for changes
                    projectUpdates.observe(this.onProjectUpdate)
                } catch (e) {
                    console.error('socket error', e)
                }
            }
        },

        async getProjectLocations() {
            try {
                this.locations = await getProjectLocations(this.project.id)
            } catch (err) {
                console.error(err)
            }
        },

        async getSimilarProjects() {
            try {
                this.similarProjects = await getSuggestedProjects(
                    this.project.id,
                    this.organizationsStore.current?.code
                )
            } catch (err) {
                console.error(err)
            }
        },

        cleanupProvider() {
            if (this.provider) {
                this.provider.destroy()
                this.provider = null
            }
        },
    },

    beforeRouteUpdate(to, from, next) {
        if (to.params.slugOrId !== from.params.slugOrId) {
            if (this.commentLoop) clearInterval(this.commentLoop)
            this.cleanupProvider()
            this.setProject(to.params.slugOrId)
            utils.resetScroll()
        }

        next()
    },

    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.hash == '#tab') {
                vm.$nextTick(() => utils.scrollTo(document.querySelector('.tabs-wrapper')))
            }
        })
    },
}
</script>

<style lang="scss" scoped>
.project-layout {
    margin-top: pxToRem(48px);

    .project-header {
        width: 100%;
        display: block;
        flex-direction: column;
        align-items: center;

        @media (min-width: $min-tablet) {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }
}

@media (max-width: $min-tablet) {
    .tabs-wrapper {
        padding: 0 $space-xs;
    }
}
</style>
