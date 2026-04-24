export default function useProjectPagesRoutes() {
  return [
    {
      // For retro compatibility with old URLS, both slugs and ids can be used
      path: '/projects/:slugOrId',
      name: 'pageProject',
      redirect: { name: 'projectSummary' },
      component: () => import('../pages/ProjectPageV2/ProjectPage.vue'),
      meta: {
        chatBotContext: (route) => `
          This page describes a project whose slug or id is ${route.params.slugOrId}. This is the slugOrId route parameter expected by tools that use projects.
        `,
      },
      // dont reset scroll here it is done in the component as it handle complex scroll behavior for tabs
      children: [
        {
          path: 'summary',
          name: 'projectSummary',
          component: () => import('../pages/ProjectPageV2/Tabs/Summary/ProjectSummaryTab.vue'),
        },
        {
          path: 'des', // back compatibility with old routes
          redirect: 'description',
        },
        {
          path: 'description',
          name: 'projectDescription',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/Description/ProjectDescriptionTab.vue'),
        },
        {
          path: 'blogentries', // back compatibility with old routes
          redirect: 'blog-entries',
        },
        {
          path: 'blog-entries',
          name: 'projectBlog',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/BlogEntries/ProjectBlogEntriesTab.vue'),
        },
        {
          path: 'goals',
          name: 'projectGoals',
          component: () => import('../pages/ProjectPageV2/Tabs/Goals/ProjectGoalsTab.vue'),
        },
        {
          path: 'team',
          name: 'projectTeam',
          component: () => import('../pages/ProjectPageV2/Tabs/Team/ProjectTeamTab2.vue'),
        },
        {
          path: 'ressources', // back compatibility with old routes
          redirect: 'resources',
        },
        {
          path: 'resources',
          name: 'projectResources',
          component: () => import('../pages/ProjectPageV2/Tabs/Resources/ProjectResourcesTab.vue'),
        },
        {
          path: 'linked-projects',
          name: 'projectLinkedProjects',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/LinkedProjects/ProjectLinkedProjectsTab.vue'),
        },
        {
          path: 'comments',
          name: 'projectComments',
          component: () => import('../pages/ProjectPageV2/Tabs/Comments/ProjectCommentsTab.vue'),
        },
        {
          path: 'private-exchange',
          name: 'projectPrivateExchange',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/PrivateExchange/ProjectPrivateExchangeTab.vue'),
        },
        {
          path: 'announcements',
          name: 'projectAnnouncements',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/Announcements/ProjectAnnouncementsTab.vue'),
        },
        {
          path: 'project-settings',
          name: 'ProjectSettings',
          // component: () => import('../pages/ProjectPageV2/Tabs/ProjectSettingsTab.vue'),
          redirect: { name: 'projectSummary' },
        },

        {
          path: 'locations',
          name: 'ProjectLocations',
          component: () => import('../pages/ProjectPageV2/Tabs/Locations/ProjectLocationsTab.vue'),
        },

        // EDIT PATHS

        {
          path: 'summary/edit',
          name: 'projectSummaryEdit',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/Summary/ProjectEditGeneralInfos.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        // {
        //   path: 'des', // back compatibility with old routes
        //   redirect: 'description',
        //   meta: {
        //     requiresAuth: true,
        //   },
        // },
        {
          path: 'description/edit',
          name: 'projectDescriptionEdit',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/Description/ProjectEditDescriptionTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        // {
        //   path: 'blogentries/edit', // back compatibility with old routes
        //   redirect: 'blog-entries',
        //   meta: {
        //     requiresAuth: true,
        //   },
        // },
        {
          path: 'blog-entries/edit',
          name: 'projectBlogEdit',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/BlogEntries/ProjectBlogEntriesTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'goals/edit',
          name: 'projectGoalsEdit',
          component: () => import('../pages/ProjectPageV2/Tabs/Goals/ProjectGoalsTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'team/edit',
          name: 'projectTeamEdit',
          component: () => import('../pages/ProjectPageV2/Tabs/Team/ProjectTeamTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        // {
        //   path: 'ressources/edit', // back compatibility with old routes
        //   redirect: 'resourcesEdit',
        //   meta: {
        //     requiresAuth: true,
        //   },
        // },
        {
          path: 'resources/edit',
          name: 'projectResourcesEdit',
          component: () => import('../pages/ProjectPageV2/Tabs/Resources/ProjectResourcesTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'linked-projects/edit',
          name: 'projectLinkedProjectsEdit',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/LinkedProjects/ProjectLinkedProjectsTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'comments/edit',
          name: 'projectCommentsEdit',
          component: () => import('../pages/ProjectPageV2/Tabs/Comments/ProjectCommentsTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'private-exchange/edit',
          name: 'projectPrivateExchangeEdit',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/PrivateExchange/ProjectPrivateExchangeTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'announcements/edit',
          name: 'projectAnnouncementsEdit',
          component: () =>
            import('../pages/ProjectPageV2/Tabs/Announcements/ProjectAnnouncementsTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'project-settings/edit',
          name: 'ProjectSettingsEdit',
          component: () => import('../pages/ProjectPageV2/Tabs/Settings/ProjectSettingsTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
        {
          path: 'locations/edit',
          name: 'ProjectLocationsEdit',
          component: () => import('../pages/ProjectPageV2/Tabs/Locations/ProjectLocationsTab.vue'),
          meta: {
            requiresAuth: true,
          },
        },
      ],
    },
  ]
}
