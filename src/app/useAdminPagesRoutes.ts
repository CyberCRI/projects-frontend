export default function useAdminPagesRoutes() {
  const vectorStoreRoutes = []
  const agentRoutes = []
  if (useRuntimeConfig().public.appHasVectorDb) {
    vectorStoreRoutes.push({
      path: 'vector-store',
      name: 'VectorStoreAdminTab',
      component: () => import('../pages/AdminPortalPageV2/Tabs/VectorStoreAdminTab.vue'),
    })
  }
  if (useRuntimeConfig().public.appHasChatbotPromptDb) {
    agentRoutes.push(
      {
        path: 'agents',
        name: 'AgentsAdminTab',
        component: () => import('../pages/AdminPortalPageV2/Tabs/AgentsAdminTab.vue'),
      },

      {
        path: 'side-assitant',
        name: 'SideAssistantAdminTab',
        component: () => import('../pages/AdminPortalPageV2/Tabs/SideAssistantAdminTab.vue'),
      },

      {
        path: 'prompts',
        name: 'PromptsAdminTab',
        component: () => import('../pages/AdminPortalPageV2/Tabs/PromptsAdminTab.vue'),
      },

      {
        path: 'agent-skills',
        name: 'AgentSkillsAdminTab',
        component: () => import('../pages/AdminPortalPageV2/Tabs/AgentSkillsAdminTab.vue'),
      },

      {
        path: 'mcps',
        name: 'McpsAdminTab',
        component: () => import('../pages/AdminPortalPageV2/Tabs/McpsAdminTab.vue'),
      },
      {
        path: 'conversations',
        name: 'ConversationsAdminTab',
        component: () => import('../pages/AdminPortalPageV2/Tabs/AgentConversationsAdminTab.vue'),
      }
      // TODO: keeping for now
      // {
      //   path: 'checkpoints',
      //   name: 'CheckpointsAdminTab',
      //   component: () => import('../pages/AdminPortalPageV2/Tabs/AgentCheckpointsAdminTab.vue'),
      // }
    )
  }
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
          redirect: { name: 'general' },
        },
        {
          path: 'templates',
          name: 'templates',
          redirect: { name: 'templatesList' },
          children: [
            {
              path: 'list',
              name: 'templatesList',
              component: () => import('../pages/AdminPortalPageV2/Tabs/Templates/TemplatesTab.vue'),
            },
            {
              path: 'edit/:id',
              name: 'templatesEdit',
              component: () =>
                import('../pages/AdminPortalPageV2/Tabs/Templates/TemplatesEditTab.vue'),
            },
            {
              path: 'create',
              name: 'templatesCreate',
              component: () =>
                import('../pages/AdminPortalPageV2/Tabs/Templates/TemplatesCreateTab.vue'),
            },
          ],
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
          children: [
            {
              path: 'list',
              name: 'groupsList',
              component: () => import('../pages/AdminPortalPageV2/Tabs/GroupsListTab.vue'),
            },
            {
              path: 'create',
              name: 'adminCreateGroup',
              component: () => import('../pages/GroupPageV2/Tabs/GroupEditTab.vue'),
              props: {
                postCancelRouteFactory: () => ({ name: 'groupsList' }),
                postCreateRouteFactory: () => ({ name: 'groupsList' }),
                postUpdateRouteFactory: () => ({ name: 'groupsList' }),
              },
            },
            // maybe we'll need this later
            {
              path: 'edit/:groupIdOrSlug',
              name: 'adminEditGroup',
              props: (route) => ({
                groupIdOrSlug: route.params.groupIdOrSlug,
                postCancelRouteFactory: () => ({ name: 'groupsList' }),
                postCreateRouteFactory: () => ({ name: 'groupsList' }),
                postUpdateRouteFactory: () => ({ name: 'groupsList' }),
              }),
              component: () => import('../pages/GroupPageV2/Tabs/GroupEditTab.vue'),
            },
          ],
        },
        {
          path: 'terms-and-conditions',
          name: 'termsAdmin',
          component: () => import('../pages/AdminPortalPageV2/Tabs/TermsAdminTab.vue'),
        },
        ...vectorStoreRoutes,
        ...agentRoutes,
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
