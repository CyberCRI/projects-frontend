import { RouteRecordRaw } from 'vue-router'
import store from '@/store'

const checkAccessRequestEnabled = (to, _from, next) => {
    if (!store.getters['organizations/current']?.access_request_enabled) {
        next({
            name: 'page404',
            params: { pathMatch: to.path.substring(1).split('/') },
        })
    }
    next()
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        // beforeEnter(_to, _from, next) {
        //     if (import.meta.env.VITE_APP_API_ORG_CODE === '') next('/discover')
        //     else next('/dashboard')
        // },

        name: 'HomeRoot',
        component: () => {
            if (`${import.meta.env.VITE_APP_HOME}` === 'new') {
                return import(
                    /* webpackChunkName: "NewHomePage" */ '../pages/NewHomePage/NewHomePage.vue'
                )
            } else {
                return import(/* webpackChunkName: "HomePage" */ '../pages/HomePage/HomePage.vue')
            }
        },
        meta: {
            resetScroll: true,
        },
    },
    // TODO: Remove or recreate ?
    // {
    //     path: '/discover',
    //     name: 'Discover',
    //     component: () => import(/* webpackChunkName: "Discover" */ '../views/DiscoverPage.vue'),
    //     meta: {
    //         resetScroll: true,
    //     },
    // },

    {
        path: '/help',
        name: 'Help',
        component: () =>
            import(/* webpackChunkName: "HelpPage" */ '../pages/HelpPage/HelpPage.vue'),

        redirect: { name: 'HelpFaqTab' },
        meta: {
            resetScroll: true,
        },

        children: [
            {
                path: 'faq',
                name: 'HelpFaqTab',
                component: () =>
                    import(
                        /* webpackChunkName: "OnBoardingTab" */ '../pages/HelpPage/Tabs/OnBoardingTab.vue'
                    ),
            },
            {
                path: 'help',
                name: 'HelpHelpTab',
                component: () =>
                    import(/* webpackChunkName: "HelpTab" */ '../pages/HelpPage/Tabs/HelpTab.vue'),
            },
            {
                path: 'tutorials',
                name: 'HelpVideoTab',
                component: () =>
                    import(
                        /* webpackChunkName: "VideoTab" */ '../pages/HelpPage/Tabs/VideoTab.vue'
                    ),
            },
        ],
    },
    {
        path: '/dashboard',
        name: 'Home',
        component: () => {
            if (`${import.meta.env.VITE_APP_HOME}` === 'new') {
                return import(
                    /* webpackChunkName: "NewHomePage" */ '../pages/NewHomePage/NewHomePage.vue'
                )
            } else {
                return import(/* webpackChunkName: "HomePage" */ '../pages/HomePage/HomePage.vue')
            }
        },
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/login',
        name: 'LoginPseudoPage',
        component: () =>
            import(/* webpackChunkName: "LoginPseudoPage" */ '../pages/LoginPage/LoginPage.vue'),
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
    //             /* webpackChunkName: "CompleteProfilePage" */ '../components/lpikit/CompleteProfileDrawer/CompleteProfileDrawer.vue'
    //         ),
    //     props: {
    //         isOpened: true,
    //     },
    //     meta: {
    //         resetScroll: true,
    //         requiresAuth: true,
    //     },
    // },
    {
        path: '/profile',
        name: 'Profile',
        redirect: { name: 'ProfileSummary' },
        component: () =>
            import(
                /* webpackChunkName: "UserProfilePage" */ '../pages/UserProfilePage/UserProfilePage.vue'
            ),
        props: {
            userId: null,
        },
        meta: {
            resetScroll: true,
            requiresAuth: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
        },
        children: [
            {
                path: 'summary',
                name: 'ProfileSummary',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileSummaryTab" */ '../pages/UserProfilePage/Tabs/ProfileSummaryTab.vue'
                    ),
            },
            {
                path: 'bio',
                name: 'ProfileBio',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileBioTab" */ '../pages/UserProfilePage/Tabs/ProfileBioTab.vue'
                    ),
            },
            {
                path: 'projects',
                name: 'ProfileProjects',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileProjectTab" */ '../pages/UserProfilePage/Tabs/ProfileProjectTab.vue'
                    ),
            },
            {
                path: 'groups',
                name: 'ProfileGroups',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileGroupsTab" */ '../pages/UserProfilePage/Tabs/ProfileGroupsTab.vue'
                    ),
            },
            {
                path: 'skills',
                name: 'ProfileSkills',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileSkillTab" */ '../pages/UserProfilePage/Tabs/ProfileSkillTab.vue'
                    ),
            },
        ],
    },
    {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: () =>
            import(
                /* webpackChunkName: "ProfileEditPage" */ '../pages/ProfileEditPage/ProfileEditPage.vue'
            ),
        meta: {
            resetScroll: true,
            requiresAuth: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
        },
    },
    {
        path: '/profile/:userId',
        name: 'ProfileOtherUser',
        component: () =>
            import(
                /* webpackChunkName: "UserProfilePage" */ '../pages/UserProfilePage/UserProfilePage.vue'
            ),
        props: true,
        meta: {
            resetScroll: true,
            props: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
        },
    },
    {
        path: '/profile/edit/:userId',
        name: 'ProfileEditOtherUser',
        component: () =>
            import(
                /* webpackChunkName: "ProfileEditPage" */ '../pages/ProfileEditPage/ProfileEditPage.vue'
            ),
        props: true,
        meta: {
            resetScroll: true,
            requiresAdmin: true,
            props: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
        },
    },
    {
        path: '/admin',
        name: 'Admin',
        redirect: { name: 'general' },
        component: () =>
            import(
                /* webpackChunkName: "PAgeAdmin" */ '../pages/AdminPortalPage/AdminPortalPage.vue'
            ),
        children: [
            {
                path: 'general',
                name: 'general',
                component: () =>
                    import(
                        /* webpackChunkName: "PortalGeneralAdmin" */ '../pages/AdminPortalPage/Tabs/InformationTab.vue'
                    ),
            },
            {
                path: 'tags',
                name: 'tags',
                component: () =>
                    import(
                        /* webpackChunkName: "TagsAdmin" */ '../pages/AdminPortalPage/Tabs/TagsTab.vue'
                    ),
            },
            {
                path: 'categories',
                name: 'categories',
                component: () =>
                    import(
                        /* webpackChunkName: "CategoriesAdmin" */ '../pages/AdminPortalPage/Tabs/CategoriesTab.vue'
                    ),
            },
            {
                path: 'faq',
                name: 'faq',
                component: () =>
                    import(
                        /* webpackChunkName: "FaqAdmin" */ '../pages/AdminPortalPage/Tabs/HelpAdminTab.vue'
                    ),
            },
            {
                path: 'templates',
                name: 'templates',
                component: () =>
                    import(
                        /* webpackChunkName: "TemplateAdmin" */ '../pages/AdminPortalPage/Tabs/TemplatesTab.vue'
                    ),
            },
            {
                path: 'accounts',
                name: 'Accounts',
                component: () =>
                    import(
                        /* webpackChunkName: "TemplateAdmin" */ '../pages/AdminPortalPage/Tabs/AccountsTab.vue'
                    ),
            },
            {
                path: 'links',
                name: 'links',
                redirect: { name: 'linksList' },
                component: () =>
                    import(
                        /* webpackChunkName: "LinksTab" */ '../pages/AdminPortalPage/Tabs/LinksTab.vue'
                    ),
                children: [
                    {
                        path: 'list',
                        name: 'linksList',
                        component: () =>
                            import(
                                /* webpackChunkName: "LinksList" */ '../pages/AdminPortalPage/Tabs/LinksList.vue'
                            ),
                    },
                    {
                        path: 'create',
                        name: 'linksCreate',
                        component: () =>
                            import(
                                /* webpackChunkName: "LinkCreate" */ '../pages/AdminPortalPage/Tabs/LinkCreate.vue'
                            ),
                    },
                ],
            },
            {
                path: 'requests',
                name: 'RequestsAdminTab',
                component: () =>
                    import(
                        /* webpackChunkName: "RequestsAdminTab" */ '../pages/AdminPortalPage/Tabs/RequestsAdminTab.vue'
                    ),
                beforeEnter: checkAccessRequestEnabled,
            },
            {
                path: 'groups',
                name: 'groups',
                redirect: { name: 'groupsList' },
                component: () =>
                    import(
                        /* webpackChunkName: "TemplateAdmin" */ '../pages/AdminPortalPage/Tabs/GroupsTab.vue'
                    ),
                children: [
                    {
                        path: 'list',
                        name: 'groupsList',
                        component: () =>
                            import(
                                /* webpackChunkName: "groupsListTab" */ '../pages/AdminPortalPage/Tabs/GroupsListTab.vue'
                            ),
                    },
                    {
                        path: 'create',
                        name: 'adminCreateGroup',
                        component: () =>
                            import(
                                /* webpackChunkName: "CreateEditGroupPage" */ '../pages/CreateEditGroupPage/CreateEditGroupPage.vue'
                            ),
                    },
                    // maybe we'll need this later
                    // {
                    //     path: 'edit/:groupId',
                    //     name: 'adminEditGroup',
                    //     props: true,
                    //     component: () =>
                    //         import(
                    //             /* webpackChunkName: "CreateEditGroupPage" */ '../pages/CreateEditGroupPage/CreateEditGroupPage.vue'
                    //         ),
                    // },
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
    {
        path: '/portal',
        name: 'Portal',
        component: () =>
            import(/* webpackChunkName: "PortalPage" */ '../pages/PortalPage/PortalPage.vue'),
    },
    {
        path: '/people/',
        name: 'People',
        component: () =>
            import(/* webpackChunkName: "PeoplePage" */ '../pages/PeoplePage/PeoplePage.vue'),
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/categories/',
        name: 'Categories',
        component: () =>
            import(
                /* webpackChunkName: "CategoriesPage" */ '../pages/CategoriesPage/CategoriesPage.vue'
            ),
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/category/:id',
        name: 'Category',
        component: () =>
            import(/* webpackChunkName: "CategoryPage" */ '../pages/CategoryPage/CategoryPage.vue'),
        props: true,
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/register/:token',
        name: 'Register',
        component: () =>
            import(/* webpackChunkName: "RegisterPage" */ '../pages/RegisterPage/RegisterPage.vue'),
        props: true,
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/request-access',
        name: 'RequestAccess',
        component: () =>
            import(
                /* webpackChunkName: "RequestAccess" */ '../pages/RequestAccessPage/RequestAccessPage.vue'
            ),
        meta: {
            resetScroll: true,
        },
        // redirct to 404 if request access is not enabled
        beforeEnter: checkAccessRequestEnabled,
    },

    {
        path: '/groups/:groupId?',
        name: 'Groups',
        component: () =>
            import(/* webpackChunkName: "GroupsPage" */ '../pages/GroupsPage/GroupsPage.vue'),
        props: true,
        meta: {
            resetScroll: true,
        },
    },

    {
        path: '/group/:groupId',
        name: 'Group',
        redirect: { name: 'groupSnapshot' },
        component: () =>
            import(/* webpackChunkName: "GroupPage" */ '../pages/GroupPage/GroupPage.vue'),
        children: [
            {
                path: 'snapshot',
                name: 'groupSnapshot',
                component: () =>
                    import(
                        /* webpackChunkName: "GroupSnapshotTab" */ '../pages/GroupPage/Tabs/GroupSnapshotTab.vue'
                    ),
            },
            {
                path: 'members',
                name: 'groupMembers',
                component: () =>
                    import(
                        /* webpackChunkName: "GroupMembersTab" */ '../pages/GroupPage/Tabs/GroupMembersTab.vue'
                    ),
            },
            {
                path: 'projects',
                name: 'groupProjects',
                component: () =>
                    import(
                        /* webpackChunkName: "GroupProjectsTab" */ '../pages/GroupPage/Tabs/GroupProjectsTab.vue'
                    ),
            },
        ],
        props: true,
    },
    {
        path: '/group/:groupId/Edit',
        name: 'frontEditGroup',
        props: true,
        component: () =>
            import(
                /* webpackChunkName: "CreateEditGroupPage" */ '../pages/CreateEditGroupPage/CreateEditGroupPage.vue'
            ),
    },
    {
        path: '/search',
        name: 'Search',
        redirect: { name: 'GlobalSearch' },

        component: () =>
            import(/* webpackChunkName: "SearchPage" */ '../pages/SearchPage/SearchPage.vue'),
        meta: {
            resetScroll: true,
        },
        children: [
            {
                path: 'global',
                name: 'GlobalSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../pages/SearchPage/Tabs/GlobalSearchTab.vue'
                    ),
            },
            {
                path: 'projects',
                name: 'ProjectSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../pages/SearchPage/Tabs/ProjectSearchTab.vue'
                    ),
            },
            {
                path: 'groups',
                name: 'GroupSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../pages/SearchPage/Tabs/GroupSearchTab.vue'
                    ),
            },
            {
                path: 'people',
                name: 'PeopleSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../pages/SearchPage/Tabs/PeopleSearchTab.vue'
                    ),
            },
        ],
    },
    {
        path: '/map',
        name: 'map',
        component: () => import(/* webpackChunkName: "MapPage" */ '../pages/MapPage/MapPage.vue'),
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/create-group',
        name: 'createGroup',
        component: () =>
            import(
                /* webpackChunkName: "CreateEditGroupPage" */ '../pages/CreateEditGroupPage/CreateEditGroupPage.vue'
            ),

        meta: {
            resetScroll: true,
            requiresAuth: true,
        },
    },
    {
        path: '/create-project',
        name: 'createProject',
        component: () =>
            import(
                /* webpackChunkName: "CreateProjectPage" */ '../pages/CreateProjectPage/CreateProjectPage.vue'
            ),

        meta: {
            resetScroll: true,
            requiresAuth: true,
        },
    },
    {
        // For retro compatibility with old URLS, both slugs and ids can be used
        path: '/projects/:slugOrId',
        name: 'pageProject',
        redirect: { name: 'projectSummary' },
        component: () =>
            import(/* webpackChunkName: "ProjectPage" */ '../pages/ProjectPage/ProjectPage.vue'),
        // dont reset scroll here it is done in the component as it handle complex scroll behavior for tabs
        children: [
            {
                path: 'summary',
                name: 'projectSummary',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectSummaryTab" */ '../pages/ProjectPage/Tabs/Summary/ProjectSummaryTab.vue'
                    ),
            },
            {
                path: 'des', // back compatibility with old routes
                redirect: 'description',
            },
            {
                path: 'description',
                name: 'projectDescription',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectDescriptionTab" */ '../pages/ProjectPage/Tabs/Description/ProjectDescriptionTab.vue'
                    ),
            },
            {
                path: 'blogentries', // back compatibility with old routes
                redirect: 'blog-entries',
            },
            {
                path: 'blog-entries',
                name: 'projectBlog',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectBlogEntriesTab" */ '../pages/ProjectPage/Tabs/BlogEntries/ProjectBlogEntriesTab.vue'
                    ),
            },
            {
                path: 'goals',
                name: 'projectGoals',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectGoalsTab" */ '../pages/ProjectPage/Tabs/ProjectGoals/ProjectGoalsTab.vue'
                    ),
            },
            {
                path: 'team',
                name: 'projectTeam',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectTeamTab" */ '../pages/ProjectPage/Tabs/Team/ProjectTeamTab.vue'
                    ),
            },
            {
                path: 'ressources', // back compatibility with old routes
                redirect: 'resources',
            },
            {
                path: 'resources',
                name: 'projectResources',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectResourcesTab" */ '../pages/ProjectPage/Tabs/Resources/ProjectResourcesTab.vue'
                    ),
            },
            {
                path: 'linked-projects',
                name: 'projectLinkedProjects',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectLinkedProjectsTab" */ '../pages/ProjectPage/Tabs/LinkedProjects/ProjectLinkedProjectsTab.vue'
                    ),
            },
            {
                path: 'comments',
                name: 'projectComments',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectCommentsTab" */ '../pages/ProjectPage/Tabs/ProjectComments/ProjectCommentsTab.vue'
                    ),
            },
            {
                path: 'announcements',
                name: 'projectAnnouncements',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectAnnouncementsTab" */ '../pages/ProjectPage/Tabs/ProjectAnnouncements/ProjectAnnouncementsTab.vue'
                    ),
            },
            {
                path: 'project-settings',
                name: 'ProjectSettings',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectSettingsTab" */ '../pages/ProjectPage/Tabs/ProjectSettings/ProjectSettingsTab.vue'
                    ),
            },
        ],
    },
    {
        path: '/stats',
        name: 'stats',
        component: () =>
            import(/* webpackChunkName: "StatPage" */ '../pages/StatsPage/StatsPage.vue'),
        meta: { requiresAuth: true, resetScroll: true },
    },
    {
        path: '/notifications-settings',
        name: 'settings',
        component: () =>
            import(
                /* webpackChunkName: "NotificationSettingsPage" */ '../pages/NotificationSettingsPage/NotificationSettingsPage.vue'
            ),
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
        component: () =>
            import(
                /* webpackChunkName: "TermsOfServicePage" */ '../pages/TermsOfServicePage/TermsOfServicePage.vue'
            ),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/legal-notices',
        name: 'legal-notices',
        component: () =>
            import(
                /* webpackChunkName: "LegalNoticesPage" */ '../pages/LegalNoticesPage/LegalNoticesPage.vue'
            ),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/cookies',
        name: 'cookies',
        component: () =>
            import(/* webpackChunkName: "CookiesPage" */ '../pages/CookiesPage/CookiesPage.vue'),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/accessibility',
        name: 'accessibility',
        component: () =>
            import(
                /* webpackChunkName: "AccessibilityPage" */ '../pages/AccessibilityPage/AccessibilityPage.vue'
            ),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/personal-data',
        name: 'personal-data',
        component: () =>
            import(
                /* webpackChunkName: "PersonalDataPage" */ '../pages/PersonalDataPage/PersonalDataPage.vue'
            ),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'page404',
        component: () =>
            import(/* webpackChunkName: "ErrorPage" */ '../pages/ErrorPage/ErrorPage.vue'),
        meta: {
            resetScroll: true,
        },
    },
    ...(import.meta.env.VITE_APP_SHOW_DEBUG
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
]

export default routes
