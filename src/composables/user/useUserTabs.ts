import type { UserModel, TranslatedUserModel } from 'shared-projects-frontend/models'
import { usePermissionUser } from '~/composables/usePermissions/useUserPermissions'
import type { MenuEntry } from '~/components/base/navigation/NavPanelMenu.vue'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'
import { userSkeleton } from '~/skeletons/user.skeletons'
import { textIsEmpty } from '~/functs/tiptap'

export const useUserTabs = (user: ComputedRef<TranslatedUserModel>) => {
  const route = useRoute()
  const router = useRouter()

  const { t } = useNuxtI18n()

  const modules = computed<UserModel['modules']>(() => {
    return {
      ...userSkeleton().modules,
      ...(user.value?.modules ?? {}),
    }
  })

  const userId = computed(() => user.value?.id)
  const userSlugOrId = computed(() => user.value?.slug || user.value?.id)

  const isResearcher = computed(() => !!user.value.researcher)

  const getUserModule = (key: string) => modules.value?.[key] || 0
  const hasUserModule = (key: string) => !!getUserModule(key)

  const getResearcherModule = (key: string) => user.value?.researcher?.modules[key] || 0
  const hasResearcherModule = (_key: string): boolean => isResearcher.value // && !!getResearcherModule(_key)

  const { canEditUser } = usePermissionUser(userId)

  const TabsDisplay = computed(() => {
    return [
      {
        key: 'profile-summary', //  TODO: "home"
        label: t('profile.snapshot'),
        view: `/profile/${userSlugOrId.value}/summary`,
        altView: `/profile/${userSlugOrId.value}/summary/edit`,
        condition: true,
        dataTest: 'profile-summary',
        icon: 'Home',
        noTitle: true,
      },
      {
        key: 'profile-bio', // TODO: "overview"
        label: t('profile.bio'),
        view: `/profile/${userSlugOrId.value}/bio`,
        altView: `/profile/${userSlugOrId.value}/bio/edit`,
        condition: !textIsEmpty(user.value?.description),
        dataTest: 'profile-bio',
        icon: 'Account',
      },
      {
        key: 'profile-projects',
        label: t(USER_MODULE_TITLE.projects, getUserModule('projects')),
        view: `/profile/${userSlugOrId.value}/projects`,
        altView: `/profile/${userSlugOrId.value}/projects/edit`,
        condition: hasUserModule('projects'),
        dataTest: 'profile-projects',
        icon: USER_MODULE_ICON.projects,
      },
      {
        key: 'profile-skills',
        label: t(USER_MODULE_TITLE.skills, getUserModule('skills')),
        view: `/profile/${userSlugOrId.value}/skills`,
        altView: `/profile/${userSlugOrId.value}/skills/edit`,
        condition: !isResearcher.value && hasUserModule('skills'),
        dataTest: 'profile-skills',
        icon: USER_MODULE_ICON.skills,
      },
      {
        key: 'profile-domains',
        label: t(USER_MODULE_TITLE.researchAreas),
        pageLabel: t(USER_MODULE_TITLE.researchAreas, {
          count: getUserModule('skills') + getResearcherModule('domains'),
        }),
        tabLabel: t(USER_MODULE_TITLE.researchAreasTab),
        view: `/profile/${userSlugOrId.value}/domains`,
        altView: `/profile/${userSlugOrId.value}/skills/edit`,
        condition:
          isResearcher.value && (hasUserModule('skills') || hasResearcherModule('domains')),
        dataTest: 'profile-domains',
        icon: USER_MODULE_ICON.skills,
      },

      {
        key: 'profile-groups', //  TODO: "labo" ?
        label: t(USER_MODULE_TITLE.groups, getUserModule('groups')),
        view: `/profile/${userSlugOrId.value}/groups`,
        altView: `/profile/${userSlugOrId.value}/groups/edit`,
        condition: hasUserModule('groups'),
        dataTest: 'profile-groups',
        icon: USER_MODULE_ICON.groups,
      },
      {
        key: 'profile-publications',
        pageLabel: t(USER_MODULE_TITLE.publications, {
          count: getResearcherModule('publications'),
        }),
        tabLabel: t(USER_MODULE_TITLE.publicationsTab),
        view: `/profile/${userSlugOrId.value}/documents/publications`,
        altView: `/profile/${userSlugOrId.value}/documents/publications/edit`,
        condition: hasResearcherModule('publications'),
        dataTest: 'profile-publications',
        icon: USER_MODULE_ICON.publications,
      },
      {
        key: 'profile-conferences',
        pageLabel: t(USER_MODULE_TITLE.conferences, { count: getResearcherModule('conferences') }),
        tabLabel: t(USER_MODULE_TITLE.conferencesTab),
        view: `/profile/${userSlugOrId.value}/documents/conferences`,
        altView: `/profile/${userSlugOrId.value}/documents/conferences/edit`,
        condition: hasResearcherModule('conferences'),
        dataTest: 'profile-conferences',
        icon: USER_MODULE_ICON.conferences,
      },
      {
        key: 'profile-network',
        label: t(USER_MODULE_TITLE.network, { count: getResearcherModule('network') }),
        tabLabel: t(USER_MODULE_TITLE.networkTab),
        view: `/profile/${userSlugOrId.value}/network`,
        altView: `/profile/${userSlugOrId.value}/network/edit`,
        condition: hasResearcherModule('network'),
        dataTest: 'profile-resources',
        icon: USER_MODULE_ICON.network,
      },
      {
        key: 'profile-affiliations',
        label: t(USER_MODULE_TITLE.affiliated, { count: getResearcherModule('affiliate') }),
        tabLabel: t(USER_MODULE_TITLE.affiliatedTab),
        view: `/profile/${userSlugOrId.value}/affiliations`,
        altView: `/profile/${userSlugOrId.value}/affiliations/edit`,
        condition: hasResearcherModule('affiliate'),
        dataTest: 'profile-affiliations',
        icon: USER_MODULE_ICON.affiliations,
      },
      {
        key: 'profile-awards',
        label: t(USER_MODULE_TITLE.awards, { count: getResearcherModule('awards') }),
        tabLabel: t(USER_MODULE_TITLE.awardsTab),
        view: `/profile/${userSlugOrId.value}/awards`,
        altView: `/profile/${userSlugOrId.value}/awards/edit`,
        condition: hasResearcherModule('awards'),
        dataTest: 'profile-awards',
        icon: USER_MODULE_ICON.awards,
      },
      {
        key: 'profile-patents',
        label: t(USER_MODULE_TITLE.patents, { count: getResearcherModule('patents') }),
        tabLabel: t(USER_MODULE_TITLE.patentsTab),
        view: `/profile/${userSlugOrId.value}/patents`,
        altView: `/profile/${userSlugOrId.value}/patents/edit`,
        condition: hasResearcherModule('patents'),
        dataTest: 'profile-patents',
        icon: USER_MODULE_ICON.patents,
      },

      {
        key: 'profile-fundings',
        label: t(USER_MODULE_TITLE.fundings, { count: getResearcherModule('fundings') }),
        tabLabel: t(USER_MODULE_TITLE.fundingsTab),
        view: `/profile/${userSlugOrId.value}/fundings`,
        altView: `/profile/${userSlugOrId.value}/fundings/edit`,
        condition: hasResearcherModule('fundings'),
        dataTest: 'profile-fundings',
        icon: USER_MODULE_ICON.fundings,
      },

      {
        key: 'profile-teaching',
        label: t(USER_MODULE_TITLE.teaching, { count: getResearcherModule('teaching') }),
        tabLabel: t(USER_MODULE_TITLE.teachingTab),
        view: `/profile/${userSlugOrId.value}/teaching`,
        altView: `/profile/${userSlugOrId.value}/teaching/edit`,
        condition: hasResearcherModule('teaching'),
        dataTest: 'profile-teaching',
        icon: USER_MODULE_ICON.teaching,
      },

      {
        key: 'profile-positions',
        label: t(USER_MODULE_TITLE.positions, { count: getResearcherModule('positons') }),
        tabLabel: t(USER_MODULE_TITLE.positionsTab),
        view: `/profile/${userSlugOrId.value}/positions`,
        altView: `/profile/${userSlugOrId.value}/positions/edit`,
        condition: hasResearcherModule('positions'),
        dataTest: 'profile-positions',
        icon: USER_MODULE_ICON.positions,
      },
      {
        key: 'profile-trade',
        label: t(USER_MODULE_TITLE.trade, {
          count: getResearcherModule('needs') + getResearcherModule('availabilitie'),
        }),
        tabLabel: t(USER_MODULE_TITLE.tradeTab),
        view: `/profile/${userSlugOrId.value}/trade`,
        altView: `/profile/${userSlugOrId.value}/trade/edit`,
        condition: hasResearcherModule('needs') || hasResearcherModule('availabilities'),
        dataTest: 'profile-trade',
        icon: USER_MODULE_ICON.trade,
      },
      {
        key: 'profile-resources',
        label: t(USER_MODULE_TITLE.resources, getUserModule('files') + getUserModule('links')),
        view: `/profile/${userSlugOrId.value}/resources`,
        altView: `/profile/${userSlugOrId.value}/resources/edit`,
        condition: hasUserModule('files') || hasUserModule('links'),
        dataTest: 'profile-resources',
        icon: USER_MODULE_ICON.resources,
      },
    ] satisfies MenuEntry[]
  })
  const groupTabsEdit = computed(() => {
    return (
      [
        {
          key: 'profile-summary-edit',
          label: t('profile.snapshot'),
          view: `/profile/${userSlugOrId.value}/summary/edit`,
          altView: `/profile/${userSlugOrId.value}/summary`,
          condition: true,
          dataTest: 'profile-summary-edit',
          icon: 'Pen',
          noTitle: true,
        },
        {
          key: 'profile-bio-edit',
          label: t('profile.bio'),
          view: `/profile/${userSlugOrId.value}/bio/edit`,
          altView: `/profile/${userSlugOrId.value}/bio`,
          condition: true,
          dataTest: 'profile-bio-edit',
          icon: 'Pen',
        },
        // TODO: re-enable... or not...
        // {
        //   key: 'profile-projects-edit',
        //   label: t(USER_MODULE_TITLE.projects, modules.value.projects),
        //   view: `/profile/${userSlugOrId.value}/projects/edit`,
        //   altView: `/profile/${userSlugOrId.value}/projects`,
        //   condition: true,
        //   dataTest: 'profile-projects-edit',
        //   icon: 'Pen',
        // },
        {
          key: 'profile-skills-edit',
          label: t(USER_MODULE_TITLE.skills, modules.value.skills),
          view: `/profile/${userSlugOrId.value}/skills/edit`,
          altView: `/profile/${userSlugOrId.value}/skills`,
          condition: true,
          dataTest: 'profile-skills-edit',
          icon: 'Pen',
        },
        {
          key: 'profile-publications-edit',
          label: t(USER_MODULE_TITLE.publications, modules.value.publications),
          view: `/profile/${userSlugOrId.value}/documents/publications/edit`,
          altView: `/profile/${userSlugOrId.value}/documents/publications`,
          condition: true,
          dataTest: 'profile-publications-edit',
          icon: 'Pen',
        },
        {
          key: 'profile-conferences-edit',
          label: t(USER_MODULE_TITLE.conferences, modules.value.conferences),
          view: `/profile/${userSlugOrId.value}/documents/conferences/edit`,
          altView: `/profile/${userSlugOrId.value}/documents/conferences`,
          condition: true,
          dataTest: 'profile-conferences-edit',
          icon: 'Pen',
        },
        {
          key: 'profile-resources-edit',
          label: t(USER_MODULE_TITLE.resources, modules.value.files + modules.value.links),
          view: `/profile/${userSlugOrId.value}/resources/edit`,
          altView: `/profile/${userSlugOrId.value}/resources`,
          condition: true,
          dataTest: 'profile-resources-edit',
          icon: 'Pen',
        },
        {
          key: 'profile-privacy-edit',
          label: t('profile.edit.privacy.tab'),
          view: `/profile/${userSlugOrId.value}/privacy/edit`,
          altView: `/profile/${userSlugOrId.value}/summary`,
          dataTest: 'profile-edit-privacy',
          condition: true,
          icon: 'Pen',
        },
      ] satisfies MenuEntry[]
    ).map((tab) => ({ ...tab, isEditing: true }))
  })

  const TabsDisplayFiltered = computed(() => TabsDisplay.value.filter((tab) => tab.condition))
  const groupTabsEditFiltered = computed(() => {
    if (!canEditUser.value) {
      return []
    }
    return groupTabsEdit.value.filter((tab) => tab.condition)
  })

  const allUserTabs = computed<MenuEntry[]>(() => [...groupTabsEdit.value, ...TabsDisplay.value])

  const currentTab = computed(() => {
    return allUserTabs.value.find((tab) => route.path === tab.view)
  })

  const isEditing = computed(() => currentTab.value?.isEditing || false)

  const projectTabs = computed(() =>
    isEditing.value ? groupTabsEditFiltered.value : TabsDisplayFiltered.value
  )

  const toggleEditing = () => {
    const nextTab = allUserTabs.value.find((tab) => tab.view === currentTab.value.altView)
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
