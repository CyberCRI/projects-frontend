import type { RouterConfig } from '@nuxt/schema'
import type { RouteRecordRaw } from 'vue-router'
import { useRuntimeConfig } from '#imports'
import useProfilePagesRoutes from './useProfilePagesRoutes'
import useProjectPagesRoutes from './useProjectPagesRoutes'
import useGroupPagesRoutes from './useGroupPagesRoutes'
import useAdminPageRoutes from './useAdminPagesRoutes'

const routes = ({
  showDebug,
  projectPageRoutes,
  profilePagesRoutes,
  groupPageRoutes,
  adminPageRoutes,
}: {
  showDebug: boolean
  projectPageRoutes: any[]
  profilePagesRoutes: any[]
  groupPageRoutes: any[]
  adminPageRoutes: any[]
}): Array<RouteRecordRaw> => [
  {
    path: '/',
    name: 'HomeRoot',
    component: () => import(`../pages/NewHomePage/NewHomePage.vue`),
    meta: {
      resetScroll: true,
    },
  },
  // TODO: Remove or recreate ?
  // {
  //     path: '/discover',
  //     name: 'Discover',
  //     component: () => import( '../views/DiscoverPage.vue'),
  //     meta: {
  //         resetScroll: true,
  //     },
  // },
  {
    path: '/documents',
    name: 'DocumentsPage',
    component: () => import('../pages/OrganizationResourcesPage/OrganizationResourcesPage.vue'),
    meta: { requiresAuth: true, resetScroll: true },
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../pages/HelpPage/HelpPage.vue'),

    redirect: { name: 'HelpFaqTab' },
    meta: {
      resetScroll: true,
    },

    children: [
      {
        path: 'faq',
        name: 'HelpFaqTab',
        component: () => import('../pages/HelpPage/Tabs/OnBoardingTab.vue'),
      },
      {
        path: 'help',
        name: 'HelpHelpTab',
        component: () => import('../pages/HelpPage/Tabs/HelpTab.vue'),
      },
      {
        path: 'tutorials',
        name: 'HelpVideoTab',
        component: () => import('../pages/HelpPage/Tabs/VideoTab.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: () => import(`../pages/NewHomePage/NewHomePage.vue`),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/login',
    name: 'LoginPseudoPage',
    component: () => import('../pages/LoginPage/LoginPage.vue'),
  },
  {
    path: '/me', // back compatibility with old routes
    redirect: { name: 'ProfileSummary' },
  },
  {
    path: '/me/*', // back compatibility with old routes
    redirect: { name: 'ProfileSummary' },
  },

  // Keeping this route for debug purpose
  // TODO: remove when no longer needed
  // {
  //     path: '/complete-profile',
  //     name: 'CompleteProfilePage',
  //     component: () =>
  //         import(
  //              '../components/people/CompleteProfileDrawer/CompleteProfileDrawer.vue'
  //         ),
  //     props: {
  //         isOpened: true,
  //     },
  //     meta: {
  //         resetScroll: true,
  //         requiresAuth: true,
  //     },
  // },
  ...profilePagesRoutes,
  {
    path: '/mentorship/respond/:token',
    name: 'MentorhipRespondPage',
    props: true,
    component: () => import('../pages/MentorshipRespondPage/MentorshipRespondPage.vue'),
  },

  ...adminPageRoutes,
  {
    path: '/portal',
    name: 'Portal',
    component: () => import('../pages/PortalPage/PortalPage.vue'),
  },
  {
    path: '/people/',
    name: 'People',
    component: () => import('../pages/PeoplePage/PeoplePage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/categories/',
    name: 'Categories',
    component: () => import('../pages/CategoriesPage/CategoriesPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/category/:slugOrId',
    name: 'Category',
    component: () => import('../pages/CategoryPage/CategoryPage.vue'),
    props: true,
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/register/:token',
    name: 'Register',
    component: () => import('../pages/RegisterPage/RegisterPage.vue'),
    props: true,
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/request-access',
    name: 'RequestAccess',
    component: () => import('../pages/RequestAccessPage/RequestAccessPage.vue'),
    meta: {
      resetScroll: true,
      // redirct to 404 if request access is not enabled
      checkAccessRequestEnabled: true,
    },
  },

  {
    path: '/groups/:groupId?',
    name: 'Groups',
    component: () => import('../pages/GroupsPage/GroupsPage.vue'),
    props: true,
    meta: {
      resetScroll: true,
    },
  },

  ...groupPageRoutes,

  {
    path: '/search',
    name: 'Search',

    component: () => import('../pages/SearchPage/SearchPage.vue'),
    meta: {
      resetScroll: true,
    },
    // keep child route for retro compatibility of shared search links
    children: [
      {
        path: 'global',
        name: 'GlobalSearch',
        redirect: { name: 'Search' },
      },
      {
        path: 'projects',
        name: 'ProjectSearch',
        redirect: { name: 'Search' },
      },
      {
        path: 'groups',
        name: 'GroupSearch',
        redirect: { name: 'Search' },
      },
      {
        path: 'people',
        name: 'PeopleSearch',
        redirect: { name: 'Search' },
      },
    ],
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('../pages/MapPage/MapPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/create-group',
    name: 'createGroup',
    component: () => import('../pages/CreateEditGroupPage/CreateEditGroupPage.vue'),

    meta: {
      resetScroll: true,
      requiresAuth: true,
    },
  },
  {
    path: '/create-project',
    name: 'createProject',
    component: () => import('../pages/CreateProjectPage/CreateProjectPage.vue'),

    meta: {
      resetScroll: true,
      requiresAuth: true,
    },
  },
  ...projectPageRoutes,
  {
    path: '/stats',
    name: 'stats',
    component: () => import('../pages/StatsPage/StatsPage.vue'),
    meta: { requiresAuth: true, resetScroll: true },
  },
  {
    path: '/notifications-settings',
    name: 'settings',
    component: () => import('../pages/NotificationSettingsPage/NotificationSettingsPage.vue'),
    meta: {
      requiresAuth: true,
      resetScroll: true,
    },
  },
  {
    path: '/tos', // back compatibility with old routes
    redirect: 'terms-of-service',
  },
  {
    path: '/terms-of-service',
    name: 'tos',
    component: () => import('../pages/TermsOfServicePage/TermsOfServicePage.vue'),

    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/legal-notices',
    name: 'legal-notices',
    component: () => import('../pages/LegalNoticesPage/LegalNoticesPage.vue'),

    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: () => import('../pages/CookiesPage/CookiesPage.vue'),

    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/accessibility',
    name: 'accessibility',
    component: () => import('../pages/AccessibilityPage/AccessibilityPage.vue'),

    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/personal-data',
    name: 'personal-data',
    component: () => import('../pages/PersonalDataPage/PersonalDataPage.vue'),

    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/plan-de-continuite-d-action',
    name: 'pca-page',
    component: () => import('../pages/PcaPage/PcaPage.vue'),

    meta: {
      resetScroll: true,
    },
  },

  {
    path: '/plan-de-securite-des-systemes-d-information',
    name: 'pssi-page',
    component: () => import('../pages/PssiPage/PssiPage.vue'),

    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'page404',
    component: () => import('../pages/ErrorPage/ErrorPage.vue'),
    meta: {
      resetScroll: true,
      checkAccessRequestEnabled: false,
    },
  },
  {
    path: '/newsfeed',
    name: 'Newsfeed',
    component: () =>
      import(/* webpackChunkName: NewsfeedPage" */ '../pages/NewsfeedPage/NewsfeedPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  // TDOD nuxt test this
  ...(showDebug
    ? [
        {
          path: '/debug',
          name: 'debug',
          component: () => import('../pages/DebugPage/DebugPage.vue'),
          redirect: { name: 'DebugIcons' },
          children: [
            {
              path: 'icons',
              name: 'DebugIcons',
              component: () => import('../pages/DebugPage/Tabs/DebugIcons.vue'),
            },
            {
              path: 'onboarding',
              name: 'DebugOnboarding',
              component: () => import('../pages/DebugPage/Tabs/DebugOnboarding.vue'),
            },
          ],
        },
      ]
    : []),
  {
    path: '/announcements',
    name: 'AnnouncementsPage',
    component: () => import('../pages/AnnouncementsPage/AnnouncementsPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/create-event',
    name: 'CreateEvent',
    component: () => import('../pages/CreateEventPage/CreateEventPage.vue'),
    meta: {
      resetScroll: true,
      requiresAuth: true,
      requiresAdminOrFacilitator: true,
    },
  },

  {
    path: '/calendar',
    name: 'CalendarPage',
    component: () => import('../pages/CalendarPage/CalendarPage.vue'),
    redirect: { name: 'FutureEvents' },
    meta: {
      resetScroll: true,
    },
    children: [
      {
        path: 'future',
        name: 'FutureEvents',
        component: () => import('../pages/CalendarPage/Tabs/FutureEvents.vue'),
        meta: {
          resetScroll: true,
        },
      },
      {
        path: 'past',
        name: 'PastEvents',
        component: () => import('../pages/CalendarPage/Tabs/PastEvents.vue'),
        meta: {
          resetScroll: true,
        },
      },
    ],
  },
  {
    path: '/create-news',
    name: 'CreateNewsPage',
    component: () => import('../pages/CreateNewsPage/CreateNewsPage.vue'),
    meta: {
      resetScroll: true,
      requiresAuth: true,
      requiresAdminOrFacilitator: true,
    },
  },
  {
    path: '/news',
    name: 'NewsListPage',
    component: () => import('../pages/NewsListPage/NewsListPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/news/:slugOrId',
    name: 'NewsPage',
    component: () => import('../pages/NewsPage/NewsPage.vue'),
    props: true,
    meta: {
      resetScroll: true,
    },
  },

  {
    path: '/create-instruction',
    name: 'CreateInstructionPage',
    component: () => import('../pages/CreateInstructionPage/CreateInstructionPage.vue'),
    meta: {
      resetScroll: true,
      requiresAuth: true,
      requiresAdminOrFacilitator: true,
    },
  },
  {
    path: '/instructions',
    name: 'InstructionListPage',
    component: () => import('../pages/InstructionListPage/InstructionListPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/instructions/:slugOrId',
    name: 'InstructionPage',
    component: () => import('../pages/InstructionPage/InstructionPage.vue'),
    props: true,
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/recommendations/projects',
    name: 'ProjectRecommendationPage',
    component: () => import('../pages/ProjectRecommendationPage/ProjectRecommendationPage.vue'),
    meta: {
      resetScroll: true,
    },
  },
  {
    path: '/recommendations/people',
    name: 'UserRecommendationPage',
    component: () => import('../pages/UserRecommendationPage/UserRecommendationPage.vue'),
    meta: {
      resetScroll: true,
      requiresAuth: true,
    },
  },
]

export default {
  routes: () => {
    const runtimeConfig = useRuntimeConfig()

    const projectPageRoutes = useProjectPagesRoutes()

    const profilePagesRoutes = useProfilePagesRoutes()

    const groupPageRoutes = useGroupPagesRoutes()

    const adminPageRoutes = useAdminPageRoutes()

    return routes({
      showDebug: !!runtimeConfig.public.appShowDebug,
      projectPageRoutes,
      profilePagesRoutes,
      groupPageRoutes,
      adminPageRoutes,
    })
  },
} satisfies RouterConfig
