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

  const { canEditUser } = usePermissionUser(userId)

  const TabsDisplay = computed(() => {
    return [
      {
        key: 'profile-summary',
        label: t('profile.snapshot'),
        view: `/profile/${userSlugOrId.value}/summary`,
        altView: `/profile/${userSlugOrId.value}/summary/edit`,
        condition: true,
        dataTest: 'profile-summary',
        icon: 'Home',
        noTitle: true,
      },
      {
        key: 'profile-bio',
        label: t('profile.bio'),
        view: `/profile/${userSlugOrId.value}/bio`,
        altView: `/profile/${userSlugOrId.value}/bio/edit`,
        condition: !textIsEmpty(user.value?.description),
        dataTest: 'profile-bio',
        icon: 'Account',
      },
      {
        key: 'profile-projects',
        label: t(USER_MODULE_TITLE.projects, modules.value.projects),
        view: `/profile/${userSlugOrId.value}/projects`,
        altView: `/profile/${userSlugOrId.value}/projects/edit`,
        condition: !!modules.value.projects,
        dataTest: 'profile-projects',
        icon: USER_MODULE_ICON.projects,
      },
      {
        key: 'profile-skills',
        label: t(USER_MODULE_TITLE.skills, modules.value.skills),
        view: `/profile/${userSlugOrId.value}/skills`,
        altView: `/profile/${userSlugOrId.value}/skills/edit`,
        condition: !!modules.value.skills,
        dataTest: 'profile-skills',
        icon: USER_MODULE_ICON.skills,
      },
      {
        key: 'profile-groups',
        label: t(USER_MODULE_TITLE.groups, modules.value.groups),
        view: `/profile/${userSlugOrId.value}/groups`,
        altView: `/profile/${userSlugOrId.value}/groups/edit`,
        condition: !!modules.value.groups,
        dataTest: 'profile-groups',
        icon: USER_MODULE_ICON.groups,
      },
      {
        key: 'profile-publications',
        label: t(USER_MODULE_TITLE.publications, modules.value.publications),
        view: `/profile/${userSlugOrId.value}/documents/publications`,
        altView: `/profile/${userSlugOrId.value}/documents/publications/edit`,
        condition: !!modules.value.publications,
        dataTest: 'profile-publications',
        icon: USER_MODULE_ICON.publications,
      },
      {
        key: 'profile-conferences',
        label: t(USER_MODULE_TITLE.conferences, modules.value.conferences),
        view: `/profile/${userSlugOrId.value}/documents/conferences`,
        altView: `/profile/${userSlugOrId.value}/documents/conferences/edit`,
        condition: !!modules.value.conferences,
        dataTest: 'profile-conferences',
        icon: USER_MODULE_ICON.conferences,
      },
      {
        key: 'profile-resources',
        label: t(USER_MODULE_TITLE.resources, modules.value.files + modules.value.links),
        view: `/profile/${userSlugOrId.value}/resources`,
        altView: `/profile/${userSlugOrId.value}/resources/edit`,
        condition: !!(modules.value.files || modules.value.links),
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
