import {
  ProjectModel,
  ProjectModuleIcon,
  ProjectModuleTitle,
  ProjectSlugOrId,
  TranslatedProject,
} from '@/models/project.model'
import { projectSkeleton } from '@/skeletons/project.skeletons'

export const useProjectTabs = (
  projectId: ComputedRef<ProjectSlugOrId>,
  project: ComputedRef<TranslatedProject | null>
) => {
  const route = useRoute()
  const router = useRouter()

  const { t } = useNuxtI18n()

  const modules = computed<ProjectModel['modules']>(() => {
    return {
      ...projectSkeleton().modules,
      ...(project.value?.modules ?? {}),
    }
  })

  const TabsDisplay = computed(() => {
    return [
      {
        key: 'project-summary',
        label: t('project.summary'),
        view: `/projects/${projectId.value}/summary`,
        altView: `/projects/${projectId.value}/summary/edit`,
        condition: true,
        dataTest: 'project-summary',
        icon: 'Home',
        noTitle: true,
      },
      {
        key: 'project-description',
        label: t('form.description'),
        view: `/projects/${projectId.value}/description`,
        altView: `/projects/${projectId.value}/description/edit`,
        condition: true,
        dataTest: 'project-description',
        icon: 'Article',
      },
      {
        key: 'project-team',
        label: t(ProjectModuleTitle.members, modules.value.members),
        view: `/projects/${projectId.value}/team`,
        altView: `/projects/${projectId.value}/team/edit`,
        condition: !!modules.value.members,
        dataTest: 'project-team',
        icon: ProjectModuleIcon.members,
      },

      {
        key: 'project-locations',
        label: t(ProjectModuleTitle.locations, modules.value.locations),
        view: `/projects/${projectId.value}/locations`,
        altView: `/projects/${projectId.value}/locations/edit`,
        condition: !!modules.value.locations,
        dataTest: 'project-locations',
        icon: ProjectModuleIcon.locations,
      },
      {
        key: 'project-goals',
        label: t(ProjectModuleTitle.goals, modules.value.goals),
        view: `/projects/${projectId.value}/goals`,
        altView: `/projects/${projectId.value}/goals/edit`,
        condition: !!modules.value.goals,
        dataTest: 'project-goals',
        icon: ProjectModuleIcon.goals,
      },
      {
        key: 'project-blog',
        label: t(ProjectModuleTitle.blogs, modules.value.blogs),
        view: `/projects/${projectId.value}/blog-entries`,
        altView: `/projects/${projectId.value}/blog-entries/edit`,
        condition: !!modules.value.blogs,
        dataTest: 'project-blog',
        icon: ProjectModuleIcon.blogs,
      },
      {
        key: 'project-files',
        label: t(ProjectModuleTitle.files, modules.value.files),
        view: `/projects/${projectId.value}/resources`,
        altView: `/projects/${projectId.value}/resources/edit`,
        condition: !!modules.value.files,
        dataTest: 'project-resources',
        icon: ProjectModuleIcon.files,
      },
      {
        key: 'project-documents',
        label: t(ProjectModuleTitle.links, modules.value.links),
        view: `/projects/${projectId.value}/resources`,
        altView: `/projects/${projectId.value}/resources/edit`,
        condition: !!modules.value.links,
        dataTest: 'project-resources',
        icon: ProjectModuleIcon.links,
      },
      {
        key: 'project-linked-projects',
        label: t(ProjectModuleTitle.linked_projects, modules.value.linked_projects),
        view: `/projects/${projectId.value}/linked-projects`,
        altView: `/projects/${projectId.value}/linked-projects/edit`,
        condition: !!modules.value.linked_projects,
        dataTest: 'project-linked-projects',
        icon: ProjectModuleIcon.linked_projects,
      },
      {
        key: 'project-announcements',
        label: t(ProjectModuleTitle.announcements, modules.value.announcements),
        view: `/projects/${projectId.value}/announcements`,
        altView: `/projects/${projectId.value}/announcements/edit`,
        condition: !!modules.value.announcements,
        dataTest: 'project-announcements',
        icon: ProjectModuleIcon.announcements,
      },
      {
        key: 'project-comments',
        label: t(ProjectModuleTitle.comments, modules.value.comments),
        view: `/projects/${projectId.value}/comments`,
        altView: `/projects/${projectId.value}/comments/edit`,
        // always show comments tabs to post comment
        condition: true,
        dataTest: 'project-comments',
        icon: ProjectModuleIcon.comments,
      },
      {
        key: 'project-private-exchange',
        label: t('comment.private-exchange.tab'),
        view: `/projects/${projectId.value}/private-exchange`,
        altView: `/projects/${projectId.value}/private-exchange/edit`,
        condition: true, // isMemberOrAdmin.value,
        dataTest: 'project-private-exchange',
        icon: 'EmailOutline',
      },
    ].map((t) => ({ ...t, isEditing: false }))
  })

  const TabsDisplayFiltered = computed(() => TabsDisplay.value.filter((tab) => tab.condition))

  const groupTabsEdit = computed(() =>
    [
      {
        key: 'project-summary',
        label: t('project.summary'),
        view: `/projects/${projectId.value}/summary/edit`,
        altView: `/projects/${projectId.value}/summary`,
        condition: true,
        dataTest: 'project-summary',
        icon: 'Home',
      },
      {
        key: 'project-description',
        label: t('form.description'),
        view: `/projects/${projectId.value}/description/edit`,
        altView: `/projects/${projectId.value}/description`,
        condition: true,
        dataTest: 'project-description',
        icon: 'Article',
      },
      {
        key: 'project-team',
        label: t(ProjectModuleTitle.members, modules.value.members),
        view: `/projects/${projectId.value}/team/edit`,
        altView: `/projects/${projectId.value}/team`,
        condition: true,
        dataTest: 'project-team',
        icon: ProjectModuleIcon.members,
        addModal: 'teamMember',
      },

      {
        key: 'project-locations',
        label: t(ProjectModuleTitle.locations, modules.value.locations),
        view: `/projects/${projectId.value}/locations/edit`,
        altView: `/projects/${projectId.value}/locations`,
        condition: true,
        dataTest: 'project-locations',
        icon: ProjectModuleIcon.locations,
        addModal: 'location',
      },
      {
        key: 'project-goals',
        label: t(ProjectModuleTitle.goals, modules.value.goals),
        view: `/projects/${projectId.value}/goals/edit`,
        altView: `/projects/${projectId.value}/goals`,
        condition: true,
        dataTest: 'project-goals',
        icon: ProjectModuleIcon.goals,
        addModal: 'goalOrSdg',
      },
      {
        key: 'project-blog',
        label: t(ProjectModuleTitle.blogs, modules.value.blogs),
        view: `/projects/${projectId.value}/blog-entries/edit`,
        altView: `/projects/${projectId.value}/blog-entries`,
        condition: true,
        dataTest: 'project-blog',
        icon: ProjectModuleIcon.blogs,
        addModal: 'blogEntry',
      },
      {
        key: 'project-resources',
        label: t(ProjectModuleTitle.files, modules.value.files),
        view: `/projects/${projectId.value}/resources/edit`,
        altView: `/projects/${projectId.value}/resources`,
        condition: true,
        dataTest: 'project-resources',
        icon: ProjectModuleIcon.files,
        addModal: 'resource',
      },
      {
        key: 'project-resources',
        label: t(ProjectModuleTitle.links, modules.value.links),
        view: `/projects/${projectId.value}/resources/edit`,
        altView: `/projects/${projectId.value}/resources`,
        condition: true,
        dataTest: 'project-resources',
        icon: ProjectModuleIcon.links,
        addModal: 'resource',
      },
      {
        key: 'project-linked-projects',
        label: t(ProjectModuleTitle.linked_projects, modules.value.linked_projects),
        view: `/projects/${projectId.value}/linked-projects/edit`,
        altView: `/projects/${projectId.value}/linked-projects`,
        condition: true,
        dataTest: 'project-linked-projects',
        icon: ProjectModuleIcon.linked_projects,
        addModal: 'linkedProject',
      },
      {
        key: 'project-announcements',
        label: t(ProjectModuleTitle.announcements, modules.value.announcements),
        view: `/projects/${projectId.value}/announcements/edit`,
        altView: `/projects/${projectId.value}/announcements`,
        condition: true,
        dataTest: 'project-announcements',
        icon: ProjectModuleIcon.announcements,
        addModal: 'announcement',
      },
      {
        key: 'project-comments',
        label: t(ProjectModuleTitle.comments, modules.value.comments),
        view: `/projects/${projectId.value}/comments/edit`,
        altView: `/projects/${projectId.value}/comments`,
        condition: true,
        dataTest: 'project-comments',
        icon: 'ChatBubble',
      },
      {
        key: 'project-private-exchange',
        label: t('comment.private-exchange.tab'),
        view: `/projects/${projectId.value}/private-exchange/edit`,
        altView: `/projects/${projectId.value}/private-exchange`,
        condition: true,
        // condition: isMemberOrAdmin.value,
        dataTest: 'project-private-exchange',
        icon: 'EmailOutline',
      },
      {
        key: 'project-settings',
        label: t('project.settings'),
        view: `/projects/${projectId.value}/project-settings/edit`,
        altView: `/projects/${projectId.value}/summary`,
        condition: true,
        dataTest: 'project-settings',
        icon: 'Cog',
      },
    ].map((t) => ({
      ...t,
      isEditing: true,
      isAddAction: !t.condition,
      actionIcon: t.condition ? 'Pen' : 'Plus',
      condition: true,
      dataTest: t.dataTest + (t.condition ? '-edit' : '-add'),
    }))
  )

  const groupTabsEditFiltered = computed(() => groupTabsEdit.value.filter((tab) => tab.condition))

  const allProjectTabs = computed(() => [...groupTabsEdit.value, ...TabsDisplay.value])

  const currentTab = computed(() => {
    return allProjectTabs.value.find((tab) => route.fullPath === tab.view)
  })

  const isEditing = computed(() => currentTab.value?.isEditing || false)

  const projectTabs = computed(() =>
    isEditing.value ? groupTabsEditFiltered.value : TabsDisplayFiltered.value
  )

  const toggleEditing = () => {
    const nextTab = allProjectTabs.value.find((tab) => tab.view === currentTab.value.altView)
    // if altview exists and is active, go to the page
    if (nextTab && nextTab.condition) {
      router.push(currentTab.value.altView)
    } else {
      // else we go to "home" page of edit/show tabs directly
      const tabHome = isEditing.value ? TabsDisplay.value[0] : groupTabsEdit.value[0]
      router.push(tabHome.view)
    }
  }

  return {
    currentTab,
    tabs: projectTabs,
    isEditing,
    toggleEditing,
  }
}
