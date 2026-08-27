export default function useProfilePagesRoutes() {
  const profileDisplayTabs = [
    {
      path: 'summary',
      name: 'ProfileUser',
      component: () => import('../pages/UserPageV2/Tabs/ProfileSummaryTab.vue'),
    },
    {
      path: 'bio',
      name: 'ProfileBio',
      component: () => import('../pages/UserPageV2/Tabs/ProfileBioTab.vue'),
    },
    {
      path: 'projects',
      name: 'ProfileProjects',
      component: () => import('../pages/UserPageV2/Tabs/ProfileProjectsTab.vue'),
    },
    {
      path: 'groups',
      name: 'ProfileGroups',
      component: () => import('../pages/UserPageV2/Tabs/ProfileGroupsTab.vue'),
    },
    {
      path: 'skills',
      name: 'ProfileSkills',
      component: () => import('../pages/UserPageV2/Tabs/ProfileSkillsTab.vue'),
    },
    {
      path: 'documents/:documentType',
      name: 'ProfileDocuments',
      component: () => import('../pages/UserPageV2/Tabs/ProfileDocumentsTab.vue'),
      props: (route) => ({
        documentType: route.params.documentType.toString(),
      }),
    },
    {
      path: 'resources',
      name: 'ProfileResources',
      component: () => import('../pages/UserPageV2/Tabs/ProfileResourcesTab.vue'),
    },
  ]

  const profileEditTabs = [
    {
      path: 'summary/edit',
      name: 'ProfileEditUser',
      component: () => import('../pages/UserPageV2/Tabs/ProfileSummaryTab.vue'),
      props: {
        editable: true,
      },
    },
    {
      path: 'bio/edit',
      name: 'ProfileEditBio',
      component: () => import('../pages/UserPageV2/Tabs/ProfileBioTab.vue'),
      props: {
        editable: true,
      },
    },
    {
      path: 'projects/edit',
      name: 'ProfileEditProjects',
      component: () => import('../pages/UserPageV2/Tabs/ProfileProjectsTab.vue'),
      props: {
        editable: true,
      },
    },
    {
      path: 'groups/edit',
      name: 'ProfileEditGroups',
      component: () => import('../pages/UserPageV2/Tabs/ProfileGroupsTab.vue'),
      props: {
        editable: true,
      },
    },
    {
      path: 'skills/edit',
      name: 'ProfileEditSkills',
      component: () => import('../pages/UserPageV2/Tabs/ProfileSkillsTab.vue'),
      props: {
        editable: true,
      },
    },
    {
      path: 'documents/:documentType/edit',
      name: 'ProfileEditDocuments',
      component: () => import('../pages/UserPageV2/Tabs/ProfileDocumentsTab.vue'),
      props: (route) => ({
        documentType: route.params.documentType.toString(),
        editable: true,
      }),
    },
    {
      path: 'resources/edit',
      name: 'ProfileEditResources',
      component: () => import('../pages/UserPageV2/Tabs/ProfileResourcesTab.vue'),
      props: {
        editable: true,
      },
    },
  ]

  return [
    {
      path: '/profile/:userIdOrSlug',
      name: 'ProfileUserBase',
      redirect: { name: 'ProfileUser' },
      component: () => import('../pages/UserPageV2/UserPage.vue'),
      children: [...profileDisplayTabs, ...profileEditTabs],
    },
  ]
}
