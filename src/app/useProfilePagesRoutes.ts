export default function useProfilePagesRoutes() {
  const profileDisplayTabs = [
    {
      path: 'summary',
      name: 'ProfileSummary',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSummaryTab.vue'),
    },
    {
      path: 'bio',
      name: 'ProfileBio',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileBioTab.vue'),
    },
    {
      path: 'projects',
      name: 'ProfileProjects',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileProjectTab.vue'),
    },
    {
      path: 'groups',
      name: 'ProfileGroups',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileGroupsTab.vue'),
    },
    {
      path: 'skills',
      name: 'ProfileSkills',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSkillTab.vue'),
    },
    {
      path: 'publications',
      name: 'ResearcherPublications',
      component: () => import('../pages/UserProfilePageV2/Tabs/ResearcherDocumentsTab.vue'),
      props: {
        docType: 'publications',
      },
    },
  ]

  const profileEditTabs = [
    {
      path: 'general',
      name: 'ProfileEditGeneral',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileGeneralEditTab.vue'),
    },
    {
      path: 'bio',
      name: 'ProfileEditBio',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileBioEditTab.vue'),
    },
    {
      path: 'projects',
      name: 'ProfileEditProjects',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileProjectsEditTab.vue'),
    },
    {
      path: 'groups',
      name: 'ProfileEditGroups',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileGroupsEditTab.vue'),
    },
    {
      path: 'skills',
      name: 'ProfileEditSkills',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSkillsEditTab.vue'),
    },
    {
      path: 'privacy',
      name: 'ProfileEditPrivacy',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfilePrivacyEditTab.vue'),
    },
    {
      path: 'publications',
      name: 'ProfileEditPublications',
      component: () => import('../pages/UserProfilePageV2/Tabs/ResearcherEditDocumentsTab.vue'),
      props: {
        docType: 'publications',
      },
    },
  ]
  return [
    {
      path: '/profile',
      name: 'Profile',
      redirect: { name: 'ProfileSummary' },
      component: () => import('../pages/UserProfilePageV2/UserProfilePage.vue'),
      props: {
        userId: null,
        isEditing: false,
      },
      meta: {
        resetScroll: true,
        requiresAuth: true,
        loginFromNotification: true,
        loginFromNotificationNewQueryParam: 'editNotifications',
      },
      children: [
        ...profileDisplayTabs,
        ...profileEditTabs.map((route) => ({ ...route, path: route.path + '/edit' })),
      ],
    },
    // legacy (path redirects)
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      redirect: { name: 'ProfileEditGeneral' },
      children: profileEditTabs.map((route) => ({
        ...route,
        name: route.name + 'Legacy',
        redirect: { name: route.name },
      })),
    },
    // END PROFILE
    // OTHER PROFILE
    {
      path: '/profile/:userId',
      name: 'ProfileOtherUser',
      redirect: { name: 'ProfileSummaryOther' },
      component: () => import('../pages/UserProfilePageV2/UserProfilePage.vue'),
      props: (route) => ({
        isEditing: false,
        userId: route.params.userId,
      }),
      meta: {
        resetScroll: true,
        loginFromNotification: true,
        loginFromNotificationNewQueryParam: 'editNotifications',
      },

      children: [
        ...profileDisplayTabs.map((r) => ({ ...r, name: r.name + 'Other' })),
        ...profileEditTabs.map((route) => ({
          ...route,
          name: route.name + 'Other',
          path: route.path + '/edit',
        })),
      ],
    },
    // legacy (path redirects)
    {
      path: '/profile/edit/:userId',
      name: 'ProfileEditOtherUser',
      redirect: { name: 'ProfileEditGeneralOther' },
      children: profileEditTabs.map((route) => ({
        ...route,
        name: route.name + 'OtherLegacy',
        redirect: { name: route.name + 'Other' },
      })),
    },
  ] // END OTHER PROFILE
}
