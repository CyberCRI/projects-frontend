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
      name: 'ProfilePublications',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfilePublicationsTab.vue'),
    },
    {
      path: 'conference',
      name: 'ProfileConference',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileConferenceTab.vue'),
    },
    {
      path: 'reward',
      name: 'ProfileReward',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileRewardTab.vue'),
    },
    {
      path: 'funding',
      name: 'ProfileFunding',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileFundingTab.vue'),
    },
    {
      path: 'teaching',
      name: 'ProfileTeaching',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileTeachingTab.vue'),
    },
    {
      path: 'team',
      name: 'ProfileTeam',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileTeamTab.vue'),
    },
    {
      path: 'resources',
      name: 'ProfileResources',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileResourcesTab.vue'),
    },
    {
      path: 'search-associate',
      name: 'ProfileSearchAssociate',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSearchAssociateTab.vue'),
    },
    {
      path: 'research-area',
      name: 'ProfileResearchArea',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileResearchAreaTab.vue'),
    },
    {
      path: 'researcher-summary',
      name: 'ProfileSummaryResearcher',
      component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSummaryResearcherTab.vue'),
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
