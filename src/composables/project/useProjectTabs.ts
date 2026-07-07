import type { ProjectModel, ProjectSlugOrId, TranslatedProject } from 'shared-projects-frontend'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { PROJECT_MODULE_ICON, PROJECT_MODULE_TITLE } from '~/functs/constants'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { projectSkeleton } from '@/skeletons/project.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { safeProjectIconTab } from '~/functs/projects'

export const useProjectTabs = (
  projectId: ComputedRef<ProjectSlugOrId>,
  project: ComputedRef<TranslatedProject | null>
) => {
  const route = useRoute()
  const router = useRouter()
  const organizationCode = useOrganizationCode()

  const { t } = useNuxtI18n()

  const modules = computed<ProjectModel['modules']>(() => {
    return {
      ...projectSkeleton().modules,
      ...(project.value?.modules ?? {}),
    }
  })

  const { data: tabs } = getAllProjectTab(organizationCode, projectId, {
    default: () => factoryPagination(projectTabSkeleton, project?.value?.modules?.tabs || 0),
  })

  const { isAdmin } = usePermissions()
  const { isMember } = usePermissionProject(projectId)

  const isMemberOrAdmin = computed(() => isMember.value || isAdmin.value)

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
        key: 'project-members',
        label: t(PROJECT_MODULE_TITLE.members, modules.value.members),
        view: `/projects/${projectId.value}/members`,
        altView: `/projects/${projectId.value}/members/edit`,
        condition: !!modules.value.members,
        dataTest: 'project-members',
        icon: PROJECT_MODULE_ICON.members,
      },
      {
        key: 'project-groups',
        label: t(PROJECT_MODULE_TITLE.groups, modules.value.groups),
        view: `/projects/${projectId.value}/groups`,
        altView: `/projects/${projectId.value}/groups/edit`,
        condition: !!modules.value.groups,
        dataTest: 'project-groups',
        icon: PROJECT_MODULE_ICON.groups,
      },
      {
        key: 'project-linked-projects',
        label: t(PROJECT_MODULE_TITLE.linked_projects, modules.value.linked_projects),
        view: `/projects/${projectId.value}/linked-projects`,
        altView: `/projects/${projectId.value}/linked-projects/edit`,
        condition: !!modules.value.linked_projects,
        dataTest: 'project-linked-projects',
        icon: PROJECT_MODULE_ICON.linked_projects,
      },
      {
        key: 'project-locations',
        label: t(PROJECT_MODULE_TITLE.locations, modules.value.locations),
        view: `/projects/${projectId.value}/locations`,
        altView: `/projects/${projectId.value}/locations/edit`,
        condition: !!modules.value.locations,
        dataTest: 'project-locations',
        icon: PROJECT_MODULE_ICON.locations,
      },
      {
        key: 'project-goals',
        label: t(PROJECT_MODULE_TITLE.goals, modules.value.goals),
        view: `/projects/${projectId.value}/goals`,
        altView: `/projects/${projectId.value}/goals/edit`,
        condition: !!modules.value.goals,
        dataTest: 'project-goals',
        icon: PROJECT_MODULE_ICON.goals,
      },
      {
        key: 'project-blog',
        label: t(PROJECT_MODULE_TITLE.blogs, modules.value.blogs),
        view: `/projects/${projectId.value}/blog-entries`,
        altView: `/projects/${projectId.value}/blog-entries/edit`,
        condition: !!modules.value.blogs,
        dataTest: 'project-blog',
        icon: PROJECT_MODULE_ICON.blogs,
      },
      {
        key: 'project-resources',
        label: t(PROJECT_MODULE_TITLE.resources, modules.value.files + modules.value.links),
        view: `/projects/${projectId.value}/resources`,
        altView: `/projects/${projectId.value}/resources/edit`,
        condition: !!(modules.value.files + modules.value.links),
        dataTest: 'project-resources',
        icon: PROJECT_MODULE_ICON.resources,
      },
      {
        key: 'project-announcements',
        label: t(PROJECT_MODULE_TITLE.announcements, modules.value.announcements),
        view: `/projects/${projectId.value}/announcements`,
        altView: `/projects/${projectId.value}/announcements/edit`,
        condition: !!modules.value.announcements,
        dataTest: 'project-announcements',
        icon: PROJECT_MODULE_ICON.announcements,
      },
      {
        key: 'project-comments',
        label: t(PROJECT_MODULE_TITLE.comments, modules.value.comments),
        view: `/projects/${projectId.value}/comments`,
        altView: `/projects/${projectId.value}/comments/edit`,
        // always show comments tabs to post comment
        condition: true,
        dataTest: 'project-comments',
        icon: PROJECT_MODULE_ICON.comments,
      },
      {
        key: 'project-reviews',
        label: t(PROJECT_MODULE_TITLE.reviews, modules.value.reviews),
        view: `/projects/${projectId.value}/reviews`,
        altView: `/projects/${projectId.value}/reviews/edit`,
        condition: !!modules.value.reviews,
        dataTest: 'project-reviews',
        icon: PROJECT_MODULE_ICON.reviews,
      },
      {
        key: 'project-private-exchange',
        label: t('comment.private-exchange.tab'),
        view: `/projects/${projectId.value}/private-exchange`,
        altView: `/projects/${projectId.value}/private-exchange/edit`,
        condition: isMemberOrAdmin.value,
        dataTest: 'project-private-exchange',
        icon: 'EmailOutline',
      },

      ...tabs.value.map((tab) => {
        return {
          key: `project-additionals-${tab.id}`,
          label: tab.$t.title,
          view: `/projects/${projectId.value}/additionals/${tab.id}`,
          altView: `/projects/${projectId.value}/additionals/${tab.id}/edit`,
          dataTest: `project-additionals-${tab.id}`,
          condition: tab.modules.items >= 1,
          icon: safeProjectIconTab(tab.icon, tab.type),
          props: {
            tab,
          },
        }
      }),
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
        key: 'project-members',
        label: t(PROJECT_MODULE_TITLE.members, modules.value.members),
        view: `/projects/${projectId.value}/members/edit`,
        altView: `/projects/${projectId.value}/members`,
        condition: true,
        dataTest: 'project-members',
        icon: PROJECT_MODULE_ICON.members,
        addModal: 'membersMember',
      },
      {
        key: 'project-groups',
        label: t(PROJECT_MODULE_TITLE.groups, modules.value.groups),
        view: `/projects/${projectId.value}/groups/edit`,
        altView: `/projects/${projectId.value}/groups`,
        condition: true,
        dataTest: 'project-groups',
        icon: PROJECT_MODULE_ICON.groups,
        addModal: 'membersMember',
      },
      {
        key: 'project-linked-projects',
        label: t(PROJECT_MODULE_TITLE.linked_projects, modules.value.linked_projects),
        view: `/projects/${projectId.value}/linked-projects/edit`,
        altView: `/projects/${projectId.value}/linked-projects`,
        condition: true,
        dataTest: 'project-linked-projects',
        icon: PROJECT_MODULE_ICON.linked_projects,
        addModal: 'linkedProject',
      },
      {
        key: 'project-locations',
        label: t(PROJECT_MODULE_TITLE.locations, modules.value.locations),
        view: `/projects/${projectId.value}/locations/edit`,
        altView: `/projects/${projectId.value}/locations`,
        condition: true,
        dataTest: 'project-locations',
        icon: PROJECT_MODULE_ICON.locations,
        addModal: 'location',
      },
      {
        key: 'project-goals',
        label: t(PROJECT_MODULE_TITLE.goals, modules.value.goals),
        view: `/projects/${projectId.value}/goals/edit`,
        altView: `/projects/${projectId.value}/goals`,
        condition: true,
        dataTest: 'project-goals',
        icon: PROJECT_MODULE_ICON.goals,
        addModal: 'goalOrSdg',
      },
      {
        key: 'project-blog',
        label: t(PROJECT_MODULE_TITLE.blogs, modules.value.blogs),
        view: `/projects/${projectId.value}/blog-entries/edit`,
        altView: `/projects/${projectId.value}/blog-entries`,
        condition: true,
        dataTest: 'project-blog',
        icon: PROJECT_MODULE_ICON.blogs,
        addModal: 'blogEntry',
      },
      {
        key: 'project-resources',
        label: t(PROJECT_MODULE_TITLE.resources, modules.value.files + modules.value.links),
        view: `/projects/${projectId.value}/resources/edit`,
        altView: `/projects/${projectId.value}/resources`,
        condition: true,
        dataTest: 'project-resources',
        icon: PROJECT_MODULE_ICON.resources,
        addModal: 'resource',
      },
      {
        key: 'project-announcements',
        label: t(PROJECT_MODULE_TITLE.announcements, modules.value.announcements),
        view: `/projects/${projectId.value}/announcements/edit`,
        altView: `/projects/${projectId.value}/announcements`,
        condition: true,
        dataTest: 'project-announcements',
        icon: PROJECT_MODULE_ICON.announcements,
        addModal: 'announcement',
      },
      {
        key: 'project-reviews',
        label: t(PROJECT_MODULE_TITLE.reviews, modules.value.reviews),
        view: `/projects/${projectId.value}/reviews/edit`,
        altView: `/projects/${projectId.value}/reviews`,
        condition: !!modules.value.reviews || project.value.life_status === 'toreview',
        dataTest: 'project-reviews',
        icon: PROJECT_MODULE_ICON.reviews,
      },
      ...tabs.value.map((tab) => {
        return {
          key: `project-additionals-${tab.id}`,
          label: tab.$t.title,
          view: `/projects/${projectId.value}/additionals/${tab.id}/edit`,
          altView: `/projects/${projectId.value}/additionals/${tab.id}`,
          dataTest: `project-additionals-${tab.id}`,
          condition: true,
          icon: safeProjectIconTab(tab.icon, tab.type),
          props: {
            tab,
          },
        }
      }),
      {
        key: 'project-additionals-add',
        label: t('tab.tab.add'),
        view: `/projects/${projectId.value}/additionals/create`,
        altView: ``,
        condition: true,
        dataTest: 'project-additionals-add',
        icon: 'Plus',
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
    ]
      .map((t) => ({
        condition: true,
        ...t,
        isEditing: true,
        isAddAction: !t.condition,
        actionIcon: t.condition ? 'Pen' : 'Plus',
        dataTest: t.dataTest + (t.condition ? '-edit' : '-add'),
      }))
      .filter((item) => item.condition)
  )

  const groupTabsEditFiltered = computed(() => groupTabsEdit.value.filter((tab) => tab.condition))

  const allProjectTabs = computed(() => [...groupTabsEdit.value, ...TabsDisplay.value])

  const currentTab = computed(() => {
    return allProjectTabs.value.find((tab) => route.path === tab.view)
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
