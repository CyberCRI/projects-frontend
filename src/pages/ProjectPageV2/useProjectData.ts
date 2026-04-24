// // import useToasterStore from '@/stores/useToaster'
// import useOrganizationsStore from '@/stores/useOrganizations'
// import useProjectsStore from '@/stores/useProjects'
// import useUsersStore from '@/stores/useUsers'
// import useProjectCategories from '@/stores/useProjectCategories'

// import { getSuggestedProjects } from '@/api/welearn.service'
// import { getComments as getCommentApi } from '@/api/comments.service'
// import { getProjectMessages as getProjectMessagesApi } from '@/api/project-messages.service'
// import { getProjectLocations as getProjectLocationsApi } from '@/api/locations.services'
// import { getAttachmentLinks } from '@/api/attachment-links.service'
// import { getAttachmentFiles } from '@/api/attachment-files.service'
// import { getProjectAnnouncements } from '@/api/announcements.service'
// import { getBlogEntries as getBlogEntriesApi } from '@/api/blogentries.service'
// import { getAllGoals } from '@/api/goals.service'
// import { getProject, duplicateProject as duplicateProjectAPI } from '@/api/projects.service'
// import { getReviews as getReviewsApi } from '@/api/reviews.service'

// import analytics from '@/analytics'

// export default function useProjectData() {
//   // const toaster = useToasterStore()
//   const organizationsStore = useOrganizationsStore()
//   const projectsStore = useProjectsStore()
//   const usersStore = useUsersStore()
//   // const runtimeConfig = useRuntimeConfig()

//   const {
//     translateProject,
//     translateProjects,
//     translateComments,
//     translateProjectMessages,
//     translateLocations,
//     translateAnnouncements,
//     translateGoals,
//     translateBlogEntries,
//     translateReviews,
//     translateFiles,
//     translateLinks,
//     translateUser,
//     translateTeam,
//   } = useAutoTranslate()

//   const projectCategoriesStore = useProjectCategories()

//   const route = useRoute()
//   const router = useRouter()
//   const { t } = useNuxtI18n()

//   const { isAdmin, canEditProject, isOrgUser } = usePermissions()

//   const isMemberOrAdmin = computed(() => {
//     const members = [...team.value.members, ...team.value.owners, ...team.value.reviewers]
//     return isAdmin.value || members.find((user) => usersStore.id === user.id)
//   })

//   // const project = computed(() => projectsStore.project)
//   const _project: ComputedRef<any> = computed(() => projectsStore.project)
//   const project: ComputedRef<any> = translateProject(_project)

//   const _similarProjects: Ref<any> = ref([])
//   const _comments: Ref<any> = ref([])
//   const _projectMessages: Ref<any> = ref([])
//   const _locations: Ref<any> = ref([])
//   const _announcements: Ref<any> = ref([])
//   const _fileResources: Ref<any> = ref([])
//   const _linkResources: ComputedRef<any> | Ref<any> = ref([])
//   const _blogEntries: Ref<any> = ref([])
//   const _goals: Ref<any> = ref([])
//   const _team: Ref<any> = ref({ owners: [], members: [], reviewers: [] })
//   const _reviews: Ref<any> = ref([])
//   const _linkedProjects: Ref<any> = ref([])

//   const similarProjects: ComputedRef<any> = translateProjects(_similarProjects)
//   const comments: ComputedRef<any> = translateComments(_comments)
//   const projectMessages: ComputedRef<any> = translateProjectMessages(_projectMessages)
//   const locations: ComputedRef<any> = translateLocations(_locations)
//   const announcements: ComputedRef<any> = translateAnnouncements(_announcements)
//   const fileResources: ComputedRef<any> = translateFiles(_fileResources)
//   const linkResources: ComputedRef<any> = translateLinks(_linkResources)
//   const blogEntries: ComputedRef<any> = translateBlogEntries(_blogEntries)
//   const goals: ComputedRef<any> = translateGoals(_goals)
//   const team: ComputedRef<any> = translateTeam(_team)
//   const reviews: ComputedRef<any> = translateReviews(_reviews)
//   const linkedProjects: ComputedRef<any> = translateProjects(_linkedProjects)

//   const follow = ref({ is_followed: false })
//   const sdgs = ref([])
//   const commentLoop = ref(null)
//   const linkedProjectsLoading = ref(false)

//   const mergedTeam = computed(() => {
//     // this is damn ugly but necessary for compatibility with TeamResultList
//     // witch expects [{user: { ... }, role: '...'}, {user: { ... }, role: '...'} ... ]
//     return [
//       ...(team.value.owners || []),
//       ...(team.value.reviewers || []),
//       ...(team.value.members || []),
//       ...((team.value as any).people_groups || []),
//     ].map((user) => ({
//       user: unref(translateUser(user)),
//     }))
//   })

//   const getReviews = async () => {
//     try {
//       const response = await getReviewsApi(project.value.id)
//       _reviews.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getGoals = async () => {
//     try {
//       const response = await getAllGoals(project.value.id)
//       _goals.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }
//   const getLinkedProjects = async (forcedLinkedProjects = null) => {
//     if (forcedLinkedProjects) {
//       // refreshing from a drawer edit update
//       _linkedProjects.value = forcedLinkedProjects
//     } else {
//       try {
//         linkedProjectsLoading.value = true
//         // TODO beg for a dedicated endpoint
//         const response = await getProject(project.value.id)
//         _linkedProjects.value = response.linked_projects
//       } catch (err) {
//         console.error(err)
//       } finally {
//         linkedProjectsLoading.value = false
//       }
//     }
//   }
//   const getSdgs = async () => {
//     try {
//       // TODO beg for a dedicated endpoint
//       const response = await getProject(project.value.id)
//       sdgs.value = response.sdgs
//     } catch (err) {
//       console.error(err)
//     }
//   }
//   const getTeam = async () => {
//     try {
//       // TODO beg for a dedicated endpoint
//       const response = await getProject(project.value.id)
//       _team.value = response.team
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const reloadTeam = async () => {
//     await getTeam()
//     // reload current user rights in case they changed
//     await usersStore.getUser(usersStore.userFromApi.id)
//   }

//   const getBlogEntries = async () => {
//     try {
//       const response = await getBlogEntriesApi(project.value.id)
//       const sortedEntries = (response.results || []).sort((a, b) => {
//         return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//       })
//       _blogEntries.value = sortedEntries
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getFileResources = async () => {
//     try {
//       const response = await getAttachmentFiles(project.value.id)
//       _fileResources.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getLinkResources = async () => {
//     try {
//       const response = await getAttachmentLinks(project.value.id)
//       _linkResources.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getComments = async (project_id) => {
//     try {
//       const response = await getCommentApi(project_id)
//       _comments.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getProjectMessages = async (project_id) => {
//     try {
//       const response = await getProjectMessagesApi(project_id)
//       _projectMessages.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getAnnouncements = async () => {
//     try {
//       const response = await getProjectAnnouncements(project.value.id, {})
//       _announcements.value = response.results
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   // used to register a call back (setHeader in ProjectPage)
//   // so we dont rely on a watcher (that occasionaly enter infinite loop)
//   const postFecthProjectHook: Ref<((project: any) => Promise<void> | void) | null> = ref(null)

//   const reloadProject = async () => {
//     const res = await projectsStore.getProject(project.value.id)
//     if (postFecthProjectHook.value) {
//       await postFecthProjectHook.value(res)
//     }
//     return res
//   }

//   const setProject = async (projectSlugOrId) => {
//     const project = await projectsStore.getProject(projectSlugOrId)
//     if (postFecthProjectHook.value) {
//       await postFecthProjectHook.value(project)
//     }
//     // TODO watch here it was the computed project value instead
//     follow.value = project.is_followed
//     _goals.value = project.goals
//     sdgs.value = project.sdgs
//     _team.value = project.team
//     _reviews.value = project.reviews
//     _linkedProjects.value = project.linked_projects

//     const extraData = [
//       getComments(project.id), // TODO remove param and use this.proejct.id in method, also chnage handler
//       getProjectLocations(),
//       getSimilarProjects(),
//       getAnnouncements(),
//       getFileResources(),
//       getLinkResources(),
//       getBlogEntries(),
//     ]

//     if (isMemberOrAdmin.value) {
//       extraData.push(
//         // TODO remove param and use this.proejct.id in method, also chnage handler
//         getProjectMessages(project.id)
//       )
//     }
//     await Promise.all(extraData)
//     if (commentLoop.value) {
//       clearInterval(commentLoop.value)
//       commentLoop.value = null
//     }
//     commentLoop.value = setInterval(
//       () => {
//         getComments(project.id)
//         if (isMemberOrAdmin.value) {
//           getProjectMessages(project.id)
//         }
//       },
//       5 * 60 * 1000
//     )
//   }

//   const getProjectLocations = async () => {
//     try {
//       const res = await getProjectLocationsApi(project.value.id)
//       _locations.value = res
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const getSimilarProjects = async () => {
//     try {
//       const res = await getSuggestedProjects(project.value.id, organizationsStore.current?.code)
//       _similarProjects.value = res
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   function isRoute(name) {
//     return route && route.name === name
//   }

//   const categories = computed(() => projectCategoriesStore.hierarchy)

//   const duplicateProject = async () => {
//     const originalProject = project.value

//     const projectCopy = await duplicateProjectAPI(originalProject.id)

//     // fetch updated project list from user so permissions as set correctly
//     await usersStore.getUser(usersStore.id)

//     analytics.project.duplicate(originalProject.id, projectCopy.id)

//     await projectsStore.updateProject({
//       id: projectCopy.id,
//       project: {
//         title: `${originalProject.title} ${t('project.copy')}`,
//       },
//     })

//     return projectCopy
//   }

//   return {
//     // data
//     isMemberOrAdmin,
//     project,
//     similarProjects,
//     comments,
//     projectMessages,
//     locations,
//     announcements,
//     fileResources,
//     linkResources,
//     blogEntries,
//     follow,
//     goals,
//     sdgs,
//     team,
//     reviews,
//     linkedProjects,
//     commentLoop,
//     linkedProjectsLoading,
//     isEditing,
//     postFecthProjectHook,
//     //computed
//     mergedTeam,
//     projectTabs,
//     currentTab,
//     categoryHierarchy,
//     actionMenu,
//     // methods
//     getReviews,
//     getGoals,
//     getLinkedProjects,
//     getSdgs,
//     getTeam,
//     reloadTeam,
//     getBlogEntries,
//     getFileResources,
//     getLinkResources,
//     getComments,
//     getProjectMessages,
//     getAnnouncements,
//     reloadProject,
//     setProject,
//     getProjectLocations,
//     getSimilarProjects,
//     toggleEditing,
//     duplicateProject,
//   }
// }
