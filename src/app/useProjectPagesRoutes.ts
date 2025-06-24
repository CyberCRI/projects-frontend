export default function useProjectPagesRoutes() {
  const runtimeConfig = useRuntimeConfig()

  return runtimeConfig.public.appUseProjectPageV2
    ? [
        // PROJECT PAGE V2
        {
          // For retro compatibility with old URLS, both slugs and ids can be used
          path: '/projects/:slugOrId',
          name: 'pageProject',
          redirect: { name: 'projectSummary' },
          component: () => import('../pages/ProjectPageV2/ProjectPage.vue'),
          // dont reset scroll here it is done in the component as it handle complex scroll behavior for tabs
          children: [
            {
              path: 'summary',
              name: 'projectSummary',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectSummaryTab.vue'),
            },
            {
              path: 'des', // back compatibility with old routes
              redirect: 'description',
            },
            {
              path: 'description',
              name: 'projectDescription',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectDescriptionTab.vue'),
            },
            {
              path: 'blogentries', // back compatibility with old routes
              redirect: 'blog-entries',
            },
            {
              path: 'blog-entries',
              name: 'projectBlog',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectBlogEntriesTab.vue'),
            },
            {
              path: 'goals',
              name: 'projectGoals',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectGoalsTab.vue'),
            },
            {
              path: 'team',
              name: 'projectTeam',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectTeamTab.vue'),
            },
            {
              path: 'ressources', // back compatibility with old routes
              redirect: 'resources',
            },
            {
              path: 'resources',
              name: 'projectResources',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectResourcesTab.vue'),
            },
            {
              path: 'linked-projects',
              name: 'projectLinkedProjects',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectLinkedProjectsTab.vue'),
            },
            {
              path: 'comments',
              name: 'projectComments',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectCommentsTab.vue'),
            },
            {
              path: 'private-exchange',
              name: 'projectPrivateExchange',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectPrivateExchangeTab.vue'),
            },
            {
              path: 'announcements',
              name: 'projectAnnouncements',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectAnnouncementsTab.vue'),
            },
            {
              path: 'project-settings',
              name: 'ProjectSettings',
              component: () => import('../pages/ProjectPageV2/Tabs/ProjectSettingsTab.vue'),
            },
          ],
        },
        // END PROJECT PAGE V2
      ]
    : [
        // PROJECT PAGE V1
        {
          // For retro compatibility with old URLS, both slugs and ids can be used
          path: '/projects/:slugOrId',
          name: 'pageProject',
          redirect: { name: 'projectSummary' },
          component: () => import('../pages/ProjectPage/ProjectPage.vue'),
          // dont reset scroll here it is done in the component as it handle complex scroll behavior for tabs
          children: [
            {
              path: 'summary',
              name: 'projectSummary',
              component: () => import('../pages/ProjectPage/Tabs/ProjectSummaryTab.vue'),
            },
            {
              path: 'des', // back compatibility with old routes
              redirect: 'description',
            },
            {
              path: 'description',
              name: 'projectDescription',
              component: () => import('../pages/ProjectPage/Tabs/ProjectDescriptionTab.vue'),
            },
            {
              path: 'blogentries', // back compatibility with old routes
              redirect: 'blog-entries',
            },
            {
              path: 'blog-entries',
              name: 'projectBlog',
              component: () => import('../pages/ProjectPage/Tabs/ProjectBlogEntriesTab.vue'),
            },
            {
              path: 'goals',
              name: 'projectGoals',
              component: () => import('../pages/ProjectPage/Tabs/ProjectGoalsTab.vue'),
            },
            {
              path: 'team',
              name: 'projectTeam',
              component: () => import('../pages/ProjectPage/Tabs/ProjectTeamTab.vue'),
            },
            {
              path: 'ressources', // back compatibility with old routes
              redirect: 'resources',
            },
            {
              path: 'resources',
              name: 'projectResources',
              component: () => import('../pages/ProjectPage/Tabs/ProjectResourcesTab.vue'),
            },
            {
              path: 'linked-projects',
              name: 'projectLinkedProjects',
              component: () => import('../pages/ProjectPage/Tabs/ProjectLinkedProjectsTab.vue'),
            },
            {
              path: 'comments',
              name: 'projectComments',
              component: () => import('../pages/ProjectPage/Tabs/ProjectCommentsTab.vue'),
            },
            {
              path: 'private-exchange',
              name: 'projectPrivateExchange',
              component: () => import('../pages/ProjectPage/Tabs/ProjectPrivateExchangeTab.vue'),
            },
            {
              path: 'announcements',
              name: 'projectAnnouncements',
              component: () => import('../pages/ProjectPage/Tabs/ProjectAnnouncementsTab.vue'),
            },
            {
              path: 'project-settings',
              name: 'ProjectSettings',
              component: () => import('../pages/ProjectPage/Tabs/ProjectSettingsTab.vue'),
            },
          ],
        },
        // END PROJECT PAGE V1
      ]
}
