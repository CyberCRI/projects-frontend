<template>
    <div class="page-section-extra-wide project-layout">
        <LazyProjectHeader
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
            <LazyProjectTabs
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
        <LazyProjectDrawer
            v-if="modals.project.visible"
            :is-opened="modals.project.visible"
            @close="toggleAddModal('project')"
            @project-edited="reloadProject"
        />
        <LazyGoalDrawer
            :project="project"
            :edited-goal="modals.goal.editedItem"
            :is-opened="modals.goal.visible"
            @close="toggleAddModal('goal')"
            @reload-goals="getGoals"
        />
        <LazyTeamDrawer
            :project="project"
            :current-users="mergedTeam"
            :selected-categories="project?.categories || []"
            :edited-user="modals.teamMember?.editedItem || null"
            :is-opened="modals.teamMember.visible"
            @close="toggleAddModal('teamMember')"
            @reload-team="reloadTeam"
        />
        <LazyResourceDrawer
            :project="project"
            :is-add-mode="!modals.resource.editedItem"
            :is-opened="modals.resource.visible"
            :selected-item="modals.resource.editedItem"
            @close="toggleAddModal('resource')"
            @reload-file-resources="getFileResources"
            @reload-link-resources="getLinkResources"
        />
        <LazyAnnouncementDrawer
            :project="project"
            :announcement="modals.announcement.editedItem"
            @reload-announcements="getAnnouncements"
            :is-add-mode="!modals.announcement.editedItem"
            :is-opened="modals.announcement.visible"
            @close="toggleAddModal('announcement')"
        />
        <LazyLinkedProjectDrawer
            :project="project"
            :already-linked-projects="linkedProjects"
            :edited-linked-project="modals.linkedProject.editedItem"
            @reload-linked-projects="getLinkedProjects($event)"
            :is-opened="modals.linkedProject.visible"
            @close="toggleAddModal('linkedProject')"
        />
        <LazyLocationDrawer
            :project-id="project?.id"
            :locations="locations"
            @reload-locations="getProjectLocations"
            :is-opened="modals.location.visible"
            @close="toggleAddModal('location')"
        />
        <LazyBlogDrawer
            :project="project"
            :edited-blog="modals.blogEntry.editedItem"
            :is-add-mode="!modals.blogEntry.editedItem"
            :is-opened="modals.blogEntry.visible"
            @close="toggleAddModal('blogEntry')"
            @reload-blog-entries="getBlogEntries"
        />

        <LazySdgsDrawer
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
import { getComments as getCommentApi } from '@/api/comments.service'
import { getProjectMessages as getProjectMessagesApi } from '@/api/project-messages.service'
import { getProjectLocations as getProjectLocationsApi } from '@/api/locations.services'
import { getAttachmentLinks } from '@/api/attachment-links.service.ts'
import { getAttachmentFiles } from '@/api/attachment-files.service.ts'
import { getProjectAnnouncements } from '@/api/announcements.service'
import { getBlogEntries as getBlogEntriesApi } from '@/api/blogentries.service'
import { getAllGoals } from '@/api/goals.service'
import { getProject } from '@/api/projects.service'
import { getReviews as getReviewsApi } from '@/api/reviews.service'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useProjectsStore from '@/stores/useProjects.ts'
import useUsersStore from '@/stores/useUsers.ts'
import { useRuntimeConfig } from '#imports'
import { useI18n } from '#imports'

export default defineNuxtComponent({
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

    async setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        const projectsStore = useProjectsStore()
        const usersStore = useUsersStore()
        const runtimeConfig = useRuntimeConfig()

        const route = useRoute()
        const router = useRouter()

        const { t } = useI18n()

        const permissions = usePermissions()

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

        const project = computed(() => projectsStore.project)

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

        // data

        const similarProjects = useState(() => [])
        const sockerserver = useState(() => runtimeConfig.public.appWssHost)
        const provider = useState(() => null)
        const loading = useState(() => true)
        const comments = useState(() => [])
        const projectMessages = useState(() => [])
        const locations = useState(() => [])
        const announcements = useState(() => [])
        const fileResources = useState(() => [])
        const linkResources = useState(() => [])
        const blogEntries = useState(() => [])
        const follow = useState(() => ({ is_followed: false }))
        const goals = useState(() => [])
        const sdgs = useState(() => [])
        const team = useState(() => ({ owners: [], members: [], reviewers: [] }))
        const reviews = useState(() => [])
        const linkedProjects = useState(() => [])
        const commentLoop = useState(() => null)

        // computed

        const isMemberOrAdmin = computed(() => {
            const members = [...team.value.members, ...team.value.owners, ...team.value.reviewers]
            return permissions.isAdmin.value || members.find((user) => usersStore.id === user.id)
        })

        const accessToken = computed(() => usersStore.accessToken)

        const mergedTeam = computed(() => {
            // this is damn ugly but necessary for compatibility with TeamResultList
            // witch expects [{user: { ... }, role: '...'}, {user: { ... }, role: '...'} ... ]
            return [
                ...(team.value.owners || []),
                ...(team.value.reviewers || []),
                ...(team.value.members || []),
                ...(team.value.people_groups || []),
            ].map((user) => ({
                user,
            }))
        })

        // method

        const cleanupProvider = () => {
            if (provider.value) {
                provider.value.destroy()
                provider.value = null
            }
        }

        const getReviews = async () => {
            try {
                const response = await getReviewsApi(project.value.id)
                reviews.value = response.results
            } catch (err) {
                console.error(err)
            }
        }

        const getGoals = async () => {
            try {
                const response = await getAllGoals(project.value.id)
                goals.value = response.results
            } catch (err) {
                console.error(err)
            }
        }
        const getLinkedProjects = async (linkedProjects) => {
            if (linkedProjects) {
                linkedProjects.value = linkedProjects
            } else {
                try {
                    // TODO beg for a dedicated endpoint
                    const response = await getProject(project.value.id)
                    linkedProjects.value = response.linked_projects
                } catch (err) {
                    console.error(err)
                }
            }
        }
        const getSdgs = async () => {
            try {
                // TODO beg for a dedicated endpoint
                const response = await getProject(project.value.id)
                sdgs.value = response.sdgs
            } catch (err) {
                console.error(err)
            }
        }
        const getTeam = async () => {
            try {
                // TODO beg for a dedicated endpoint
                const response = await getProject(project.value.id)
                team.value = response.team
            } catch (err) {
                console.error(err)
            }
        }

        const reloadTeam = async () => {
            await getTeam()
            // reload current user rights in case they changed
            await usersStore.getUser(usersStore.userFromApi.id)
        }

        const getBlogEntries = async () => {
            try {
                const response = await getBlogEntriesApi(project.value.id)
                blogEntries.value = (response.results || []).sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })
            } catch (err) {
                console.error(err)
            }
        }

        const getFileResources = async () => {
            try {
                const response = await getAttachmentFiles(project.value.id)
                fileResources.value = response.results
            } catch (err) {
                console.error(err)
            }
        }

        const getLinkResources = async () => {
            try {
                const response = await getAttachmentLinks(project.value.id)
                linkResources.value = response.results
            } catch (err) {
                console.error(err)
            }
        }

        const getComments = async (project_id) => {
            try {
                const response = await getCommentApi(project_id)
                comments.value = response.results
            } catch (err) {
                console.error(err)
            }
        }

        const getProjectMessages = async (project_id) => {
            try {
                console.log('getprojmess')
                const response = await getProjectMessagesApi(project_id)
                projectMessages.value = response.results
            } catch (err) {
                console.error(err)
            }
        }

        const getAnnouncements = async () => {
            try {
                const response = await getProjectAnnouncements(project.value.id)
                announcements.value = response.results
            } catch (err) {
                console.error(err)
            }
        }

        const setProject = async (projectSlugOrId = route.params.slugOrId) => {
            console.log('setProject')
            loading.value = true
            projectsStore
                .getProject(projectSlugOrId)
                .then(async (project) => {
                    // TODO watch here it was the computed project value instead
                    follow.value = project.is_followed
                    goals.value = project.goals
                    sdgs.value = project.sdgs
                    team.value = project.team
                    reviews.value = project.reviews
                    linkedProjects.value = project.linked_projects

                    const extraData = [
                        getComments(project.id), // TODO remove param and use this.proejct.id in method, also chnage handler
                        getProjectLocations(),
                        getSimilarProjects(),
                        getAnnouncements(),
                        getFileResources(),
                        getLinkResources(),
                        getBlogEntries(),
                    ]

                    console.log(isMemberOrAdmin.value)

                    if (isMemberOrAdmin.value) {
                        extraData.push(
                            // TODO remove param and use this.proejct.id in method, also chnage handler
                            getProjectMessages(project.id)
                        )
                    }
                    await Promise.all(extraData)
                    if (!commentLoop.value) {
                        commentLoop.value = setInterval(
                            () => {
                                getComments(project.id)
                                if (isMemberOrAdmin.value) {
                                    getProjectMessages(project.id)
                                }
                            },
                            5 * 60 * 1000
                        )
                    }
                    connectToSocket(project.id)
                    loading.value = false
                })
                .catch((err) => {
                    console.log(err)
                    router.replace({
                        name: 'page404',
                        params: { pathMatch: route.path.substring(1).split('/') },
                    })
                })
        }

        const reloadProject = async () => {
            return await projectsStore.getProject(project.value.id)
        }

        const projectPatched = (data) => {
            if (provider.value?.document) {
                const projectUpdates = provider.value.document.getMap('projectUpdates')
                projectUpdates.set('data', { ...data, clientID: provider.value.document.clientID })
            }
        }

        const onProjectUpdate = async () => {
            const projectUpdates = provider.value.document.getMap('projectUpdates')
            const data = projectUpdates.get('data')

            // skip if we are the ones who updated the description
            if (provider.value.document.clientID == data.clientID) return

            // skip if update is before current project / blog data update time
            if (data.type == 'blog-entry-create' || data.type == 'blog-entry-update') {
                let old = (project.value.blog_entries || []).find((b) => b.id == data.id)
                if (old && old.updated_at >= data.updated_at) {
                    return
                }
            } else if (data.type === 'description-update') {
                if (project.value.updated_at >= data.updated_at) {
                    return
                }
            }

            // update project (yes, the whole project... TODO: fine grain this)
            reloadProject()

            // real update, notify user
            let message = data.author_name + ' ' + t(data.scope)

            toaster.pushInfo(message)
        }

        const connectToSocket = () => {
            // listen for description updates
            // TODO permission
            if (permissions.canEditProject.value) {
                try {
                    const providerParams = {
                        projectId: projectsStore.currentProjectId,
                        organizationId: organizationsStore.current.id,
                    }

                    provider.value = new HocuspocusProvider({
                        url: sockerserver.value,
                        name: 'description_update_' + project.value.id,
                        token: accessToken.value,
                        parameters: providerParams,
                    })

                    const projectUpdates = toRaw(provider.value).document.getMap('projectUpdates')

                    // Listen for changes
                    projectUpdates.observe(onProjectUpdate)
                } catch (e) {
                    console.error('socket error', e)
                }
            }
        }

        const getProjectLocations = async () => {
            try {
                locations.value = await getProjectLocationsApi(project.value.id)
            } catch (err) {
                console.error(err)
            }
        }

        const getSimilarProjects = async () => {
            try {
                similarProjects.value = await getSuggestedProjects(
                    project.value.id,
                    organizationsStore.current?.code
                )
            } catch (err) {
                console.error(err)
            }
        }

        // provide

        provide('projectLayoutToggleAddModal', toggleAddModal)
        provide('projectLayoutGoToTab', goToTab)
        provide('projectLayoutProjectPatched', projectPatched)

        // hooks

        onBeforeUnmount(() => {
            if (commentLoop.value) clearInterval(commentLoop.value)
            cleanupProvider()
        })

        const projectData = await getProject(route.params.slugOrId, true)

        useHeadSafe({
            title: projectData.title,
            meta: [
                {
                    name: 'description',
                    content: projectData.purpose,
                },

                {
                    name: 'og:title',
                    content: projectData.title,
                },

                {
                    name: 'og:description',
                    content: projectData.purpose,
                },

                {
                    name: 'og:url',
                    content: useRequestURL().toString(),
                },

                {
                    name: 'og:image',
                    content: projectData?.header_image?.variations?.medium,
                },

                // Twitter

                {
                    name: 'twitter:title',
                    content: projectData.title,
                },

                {
                    name: 'twitter:description',
                    content: projectData.purpose,
                },

                {
                    name: 'twitter:image',
                    content: projectData?.header_image?.variations?.medium,
                },
            ],
        })

        //onCreated(() => {
        //onMounted(() => {
        if (import.meta.client) {
            await setProject(route.params.slugOrId)
            utils.resetScroll()
        }
        //})

        return {
            toaster,
            modals,
            toggleAddModal,
            goToTab,
            organizationsStore,
            projectsStore,
            usersStore,
            runtimeConfig,
            // data
            similarProjects,
            sockerserver,
            provider,
            loading,
            comments,
            projectMessages,
            locations,
            announcements,
            fileResources,
            linkResources,
            blogEntries,
            follow,
            goals,
            sdgs,
            team,
            reviews,
            linkedProjects,
            commentLoop,
            // computed
            project,
            isMemberOrAdmin,
            accessToken,
            mergedTeam,
            // method
            getReviews,
            getGoals,
            getLinkedProjects,
            getSdgs,
            getTeam,
            reloadTeam,
            getBlogEntries,
            getFileResources,
            getLinkResources,
            getComments,
            getProjectMessages,
            getAnnouncements,
            setProject,
            reloadProject,
            cleanupProvider,
            projectPatched,
            onProjectUpdate,
            connectToSocket,
            getProjectLocations,
            getSimilarProjects,
        }
    },

    methods: {
        // toggleAddModal(modalType, editedItem) {
        //     if (editedItem) this.modals[modalType].editedItem = editedItem
        //     else this.modals[modalType].editedItem = null
        //     this.modals[modalType].visible = !this.modals[modalType].visible
        // },
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
})
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
