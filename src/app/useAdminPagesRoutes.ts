export default function useAdminPagesRoutes() {
  return [
    {
      path: '/admin',
      name: 'Admin',
      redirect: { name: 'general' },
      component: () => import('../pages/AdminPortalPageV2/AdminPortalPage.vue'),
      children: [
        {
          path: 'general',
          name: 'general',
          component: () => import('../pages/AdminPortalPageV2/Tabs/NewInformationTab.vue'),
        },
        {
          path: 'settings',
          name: 'AdminSettings',
          component: () => import('../pages/AdminPortalPageV2/Tabs/SettingsTab.vue'),
        },
        {
          path: 'tags',
          name: 'tags',
          component: () => import('../pages/AdminPortalPageV2/Tabs/TagsTab.vue'),
        },
        {
          path: 'skills',
          name: 'skills',
          component: () => import('../pages/AdminPortalPageV2/Tabs/SkillsTab.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('../pages/AdminPortalPageV2/Tabs/CategoriesTab.vue'),
        },
        {
          path: 'faq',
          name: 'faq',
          // component: () => import('../pages/AdminPortalPageV2/Tabs/HelpAdminTab.vue'),
          redirect: { name: 'general' },
        },
        {
          path: 'templates',
          name: 'templates',
          component: () => import('../pages/AdminPortalPageV2/Tabs/TemplatesTab.vue'),
        },
        {
          path: 'accounts',
          name: 'Accounts',
          component: () => import('../pages/AdminPortalPageV2/Tabs/AccountsTab.vue'),
        },
        {
          path: 'links',
          name: 'links',
          redirect: { name: 'linksList' },
          component: () => import('../pages/AdminPortalPageV2/Tabs/LinksTab.vue'),
          children: [
            {
              path: 'list',
              name: 'linksList',
              component: () => import('../pages/AdminPortalPageV2/Tabs/LinksListTab.vue'),
            },
            {
              path: 'create',
              name: 'linksCreate',
              component: () => import('../pages/AdminPortalPageV2/Tabs/LinkCreateTab.vue'),
            },
          ],
        },
        {
          path: 'requests',
          name: 'RequestsAdminTab',
          component: () => import('../pages/AdminPortalPageV2/Tabs/RequestsAdminTab.vue'),
          meta: { checkAccessRequestEnabled: true },
        },
        {
          path: 'groups',
          name: 'groups',
          redirect: { name: 'groupsList' },
          component: () => import('../pages/AdminPortalPageV2/Tabs/GroupsTab.vue'),
          children: [
            {
              path: 'list',
              name: 'groupsList',
              component: () => import('../pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'),
            },
            {
              path: 'create',
              name: 'adminCreateGroup',
              component: () => import('../pages/CreateEditGroupPage/CreateEditGroupPage.vue'),
              props: {
                postCancelRouteFactory: () => ({ name: 'groupsList' }),
                postCreateRouteFactory: () => ({ name: 'groupsList' }),
                postUpdateRouteFactory: () => ({ name: 'groupsList' }),
              },
            },
            // maybe we'll need this later
            {
              path: 'edit/:groupId',
              name: 'adminEditGroup',
              props: (route) => ({
                groupId: route.params.groupId,
                postCancelRouteFactory: () => ({ name: 'groupsList' }),
                postCreateRouteFactory: () => ({ name: 'groupsList' }),
                postUpdateRouteFactory: () => ({ name: 'groupsList' }),
              }),
              component: () => import('../pages/CreateEditGroupPage/CreateEditGroupPage.vue'),
            },
          ],
        },
      ],
      meta: {
        resetScroll: true,
        requiresAuth: true,
        requiresAdmin: true,
        loginFromNotification: true,
        loginFromNotificationNewQueryParam: 'editNotifications',
      },
    },
  ]
}
