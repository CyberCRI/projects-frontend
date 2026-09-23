import type {
  ProjectModel,
  ProjectSlugOrId,
  TranslatedProject,
} from 'shared-projects-frontend/models'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import { projectSkeleton } from '@/skeletons/project.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import { safeProjectIconTab } from '~/functs/projects'
import { sanitizeTabs } from '~/functs/tabs'

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
    uniqueKey: 'menu',
    paginationConfig: {
      limit: 999,
    },
  })
  const allTabs = computed(() =>
    sanitizeTabs(tabs.value, modules.value).filter((tab) => tab.show_tab)
  )

  const { isAdmin } = usePermissions()
  const { isMember, canCreateTab } = usePermissionProject(projectId, project)

  const isMemberOrAdmin = computed(() => isMember.value || isAdmin.value)

  const TabsDisplay = computed(() => {
    const display = allTabs.value.map((tab) => {
      let condition = tab.show_tab && (!!tab.modules.items || !!modules.value[tab.type])

      let tabType = tab.type as string
      if (tabType === 'comments' || tabType === 'messages') {
        condition = true
      } else if (tabType === 'linked_projects') {
        tabType = 'linked-projects'
      }

      const base = {
        key: `project-${tab.type}`,
        label: tab.$t.title,
        view: `/projects/${projectId.value}/${tabType}`,
        altView: `/projects/${projectId.value}/${tabType}/edit`,
        condition,
        dataTest: `project-${tab.type}`,
        icon: safeProjectIconTab(tab.icon, tab.type),
        props: {
          tab,
        },
      }

      if (['blog', 'text'].includes(tab.type)) {
        return {
          ...base,
          view: `/projects/${projectId.value}/additionals/${tab.slug || tab.id}`,
          altView: `/projects/${projectId.value}/additionals/${tab.slug || tab.id}/edit`,
          dataTest: `project-additionals-${tab.slug || tab.id}`,
        }
      }
      return base
    })

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
      ...display,
    ].map((t) => ({ ...t, isEditing: false }))
  })

  const TabsDisplayFiltered = computed(() => TabsDisplay.value.filter((tab) => tab.condition))

  const groupTabsEdit = computed(() => {
    const display = allTabs.value.map((tab) => {
      let condition = tab.show_tab
      let tabType: string = tab.type
      if (tabType === 'comments') {
        condition = false
      } else if (tabType === 'messages') {
        condition = isMemberOrAdmin.value
      } else if (tabType === 'reviews') {
        condition = !!modules.value.reviews || project.value.life_status === 'toreview'
      } else if (tabType === 'linked_projects') {
        tabType = 'linked-projects'
      }

      const base = {
        key: `project-${tab.type}-edit`,
        label: tab.$t.title,
        view: `/projects/${projectId.value}/${tabType}/edit`,
        altView: `/projects/${projectId.value}/${tabType}`,
        condition,
        dataTest: `project-${tab.type}-edit`,
        icon: safeProjectIconTab(tab.icon, tab.type),
        props: {
          tab,
        },
      }

      if (['blog', 'text'].includes(tab.type)) {
        return {
          ...base,
          view: `/projects/${projectId.value}/additionals/${tab.slug || tab.id}/edit`,
          altView: `/projects/${projectId.value}/additionals/${tab.slug || tab.id}`,
          dataTest: `project-additionals-${tab.slug || tab.id}`,
        }
      }
      return base
    })

    return [
      {
        key: 'project-summary',
        label: t('project.summary'),
        view: `/projects/${projectId.value}/summary/edit`,
        altView: `/projects/${projectId.value}/summary`,
        condition: true,
        dataTest: 'project-summary',
        icon: 'Home',
      },
      ...display,
      {
        key: 'project-settings-tabs',
        label: t('tab.tab.settings'),
        view: `/projects/${projectId.value}/settings-tabs/edit`,
        altView: ``,
        condition: canCreateTab.value || isAdmin.value,
        dataTest: 'project-settings-tabs',
        icon: 'Cog',
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
  })

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
