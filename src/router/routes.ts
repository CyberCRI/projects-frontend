import { RouteRecordRaw } from 'vue-router'
import HomeLayout from '@/components/Layouts/HomeLayout.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        // beforeEnter(_to, _from, next) {
        //     if (import.meta.env.VITE_APP_APIBASEORGID === '') next('/discover')
        //     else next('/dashboard')
        // },

        name: 'HomeRoot',
        component: HomeLayout,
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
            import(/* webpackChunkName: "About" */ '../components/Layouts/Help/HelpLayout.vue'),
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/dashboard',
        name: 'Home',
        component: HomeLayout,
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/me', // back compatibility with old routes
        redirect: 'profile',
    },
    {
        path: '/me/*', // back compatibility with old routes
        redirect: 'profile',
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () =>
            import(
                /* webpackChunkName: "UserProfileLayout" */ '../components/Layouts/Profile/UserProfileLayout.vue'
            ),
        props: {
            userKId: null,
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
                        /* webpackChunkName: "ProfileSummaryTab" */ '../components/Layouts/Profile/Tabs/ProfileSummaryTab.vue'
                    ),
            },
            {
                path: 'bio',
                name: 'ProfileBio',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileBioTab" */ '../components/Layouts/Profile/Tabs/ProfileBioTab.vue'
                    ),
            },
            {
                path: 'projects',
                name: 'ProfileProjects',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileProjectTab" */ '../components/Layouts/Profile/Tabs/ProfileProjectTab.vue'
                    ),
            },
            {
                path: 'groups',
                name: 'ProfileGroups',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileGroupsTab" */ '../components/Layouts/Profile/Tabs/ProfileGroupsTab.vue'
                    ),
            },
            {
                path: 'skills',
                name: 'ProfileSkills',
                component: () =>
                    import(
                        /* webpackChunkName: "ProfileSkillTab" */ '../components/Layouts/Profile/Tabs/ProfileSkillTab.vue'
                    ),
            },
        ],
    },
    {
        path: '/profile/edit',
        name: 'ProfileEdit',
        component: () =>
            import(
                /* webpackChunkName: "ProfileEditLayout" */ '../components/Layouts/ProfileEdit/ProfileEditLayout.vue'
            ),
        meta: {
            resetScroll: true,
            requiresAuth: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
        },
    },
    {
        path: '/profile/:userKId',
        name: 'ProfileOtherUser',
        component: () =>
            import(
                /* webpackChunkName: "UserProfileLayout" */ '../components/Layouts/Profile/UserProfileLayout.vue'
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
        path: '/profile/edit/:userKId',
        name: 'ProfileEditOtherUser',
        component: () =>
            import(
                /* webpackChunkName: "ProfileEditLayout" */ '../components/Layouts/ProfileEdit/ProfileEditLayout.vue'
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
                /* webpackChunkName: "PAgeAdmin" */ '../components/Layouts/Admin/AdminPortalLayout.vue'
            ),
        children: [
            {
                path: 'general',
                name: 'general',
                component: () =>
                    import(
                        /* webpackChunkName: "PortalGeneralAdmin" */ '../components/Layouts/Admin/Tabs/InformationTab.vue'
                    ),
            },
            {
                path: 'tags',
                name: 'tags',
                component: () =>
                    import(
                        /* webpackChunkName: "TagsAdmin" */ '../components/Layouts/Admin/Tabs/TagsTab.vue'
                    ),
            },
            {
                path: 'categories',
                name: 'categories',
                component: () =>
                    import(
                        /* webpackChunkName: "CategoriesAdmin" */ '../components/Layouts/Admin/Tabs/CategoriesTab.vue'
                    ),
            },
            {
                path: 'faq',
                name: 'faq',
                component: () =>
                    import(
                        /* webpackChunkName: "FaqAdmin" */ '../components/Layouts/Admin/Tabs/HelpTab.vue'
                    ),
            },
            {
                path: 'templates',
                name: 'templates',
                component: () =>
                    import(
                        /* webpackChunkName: "TemplateAdmin" */ '../components/Layouts/Admin/Tabs/TemplatesTab.vue'
                    ),
            },
            {
                path: 'accounts',
                name: 'Accounts',
                component: () =>
                    import(
                        /* webpackChunkName: "TemplateAdmin" */ '../components/Layouts/Admin/Tabs/AccountsTab.vue'
                    ),
            },
            {
                path: 'links',
                name: 'links',
                redirect: { name: 'linksList' },
                component: () =>
                    import(
                        /* webpackChunkName: "LinksTab" */ '../components/Layouts/Admin/Tabs/LinksTab.vue'
                    ),
                children: [
                    {
                        path: 'list',
                        name: 'linksList',
                        component: () =>
                            import(
                                /* webpackChunkName: "LinksList" */ '../components/Layouts/Admin/Tabs/LinksList.vue'
                            ),
                    },
                    {
                        path: 'create',
                        name: 'linksCreate',
                        component: () =>
                            import(
                                /* webpackChunkName: "LinkCreate" */ '../components/Layouts/Admin/Tabs/LinkCreate.vue'
                            ),
                    },
                ],
            },
            {
                path: 'groups',
                name: 'groups',
                redirect: { name: 'groupsList' },
                component: () =>
                    import(
                        /* webpackChunkName: "TemplateAdmin" */ '../components/Layouts/Admin/Tabs/GroupsTab.vue'
                    ),
                children: [
                    {
                        path: 'list',
                        name: 'groupsList',
                        component: () =>
                            import(
                                /* webpackChunkName: "groupsList" */ '../components/Layouts/Admin/Tabs/GroupsList.vue'
                            ),
                    },
                    {
                        path: 'create',
                        name: 'adminCreateGroup',
                        component: () =>
                            import(
                                /* webpackChunkName: "CreateEditGroupLayout" */ '../components/Layouts/CreateEditGroupLayout.vue'
                            ),
                    },
                    // maybe we'll need this later
                    // {
                    //     path: 'edit/:groupId',
                    //     name: 'adminEditGroup',
                    //     props: true,
                    //     component: () =>
                    //         import(
                    //             /* webpackChunkName: "CreateEditGroupLayout" */ '../components/Layouts/CreateEditGroupLayout.vue'
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
            import(
                /* webpackChunkName: "PortalLayout" */ '@/components/Layouts/Portal/PortalLayout.vue'
            ),
    },
    {
        path: '/categories/',
        name: 'Categories',
        component: () =>
            import(
                /* webpackChunkName: "Category" */ '../components/Layouts/Categories/CategoriesLayout.vue'
            ),
        meta: {
            resetScroll: true,
        },
    },
    // TODO: put this back once we create a new page
    // {
    //     path: '/people/',
    //     name: 'People',
    //     component: () =>
    //         import(
    //             /* webpackChunkName: "Category" */ '../components/Layouts/People/GroupLayout.vue'
    //         ),
    //     meta: {
    //         resetScroll: true,
    //     },
    // },
    {
        path: '/category/:id',
        name: 'Category',
        component: () => import(/* webpackChunkName: "Category" */ '../views/CategoryPage.vue'),
        props: true,
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/register/:token',
        name: 'Register',
        component: () => import(/* webpackChunkName: "Register" */ '../views/RegisterPage.vue'),
        props: true,
        meta: {
            resetScroll: true,
        },
    },

    {
        path: '/groups/:groupId?',
        name: 'Groups',
        component: () =>
            import(
                /* webpackChunkName: "GroupsLayout" */ '@/components/Layouts/Group/GroupsLayout.vue'
            ),
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
            import(
                /* webpackChunkName: "GroupLayout" */ '../components/Layouts/Group/GroupLayout.vue'
            ),
        children: [
            {
                path: 'snapshot',
                name: 'groupSnapshot',
                component: () =>
                    import(
                        /* webpackChunkName: "GroupSnapshot" */ '../components/lpikit/GroupView/Snapshot/GroupSnapshot.vue'
                    ),
            },
            {
                path: 'members',
                name: 'groupMembers',
                component: () =>
                    import(
                        /* webpackChunkName: "GroupMembers" */ '../components/lpikit/GroupView/Members/GroupMembers.vue'
                    ),
            },
            {
                path: 'projects',
                name: 'groupProjects',
                component: () =>
                    import(
                        /* webpackChunkName: "GroupProjects" */ '../components/lpikit/GroupView/Projects/GroupProjects.vue'
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
                /* webpackChunkName: "CreateEditGroupLayout" */ '../components/Layouts/CreateEditGroupLayout.vue'
            ),
    },
    {
        path: '/search',
        name: 'Search',
        redirect: { name: 'GlobalSearch' },

        component: () => import(/* webpackChunkName: "Browse" */ '../views/SearchPage.vue'),
        meta: {
            resetScroll: true,
        },
        children: [
            {
                path: 'global',
                name: 'GlobalSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../components/Layouts/Search/Tabs/GlobalSearchTab.vue'
                    ),
            },
            {
                path: 'projects',
                name: 'ProjectSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../components/Layouts/Search/Tabs/ProjectSearchTab.vue'
                    ),
            },
            {
                path: 'groups',
                name: 'GroupSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../components/Layouts/Search/Tabs/GroupSearchTab.vue'
                    ),
            },
            {
                path: 'people',
                name: 'PeopleSearch',
                component: () =>
                    import(
                        /* webpackChunkName: "GlobalSearchTab" */ '../components/Layouts/Search/Tabs/PeopleSearchTab.vue'
                    ),
            },
        ],
    },
    {
        path: '/map',
        name: 'map',
        component: () => import(/* webpackChunkName: "ProjectMap" */ '../views/PageMap.vue'),
        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/create-group',
        name: 'createGroup',
        component: () =>
            import(
                /* webpackChunkName: "CreateEditGroupLayout" */ '../components/Layouts/CreateEditGroupLayout.vue'
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
                /* webpackChunkName: "CreateProjectLayout" */ '../components/Layouts/CreateProjectLayout.vue'
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
            import(
                /* webpackChunkName: "ProjectLayout" */ '../components/Layouts/Project/ProjectLayout.vue'
            ),
        // dont reset scroll here it is done in the component as it handle complex scroll behavior for tabs
        children: [
            {
                path: 'summary',
                name: 'projectSummary',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectSummary" */ '../components/lpikit/ProjectView/Summary/ProjectSummary.vue'
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
                        /* webpackChunkName: "ProjectDescription" */ '../components/lpikit/ProjectView/Description/ProjectDescription.vue'
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
                        /* webpackChunkName: "ProjectBlogEntries" */ '../components/lpikit/ProjectView/BlogEntries/ProjectBlogEntries.vue'
                    ),
            },
            {
                path: 'goals',
                name: 'projectGoals',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectGoals" */ '../components/lpikit/ProjectGoals/ProjectGoals.vue'
                    ),
            },
            {
                path: 'team',
                name: 'projectTeam',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectTeam" */ '../components/lpikit/ProjectView/Team/ProjectTeam.vue'
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
                        /* webpackChunkName: "ProjectResources" */ '../components/lpikit/ProjectView/Resources/ProjectResources.vue'
                    ),
            },
            {
                path: 'linked-projects',
                name: 'projectLinkedProjects',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectLinkedProjects" */ '../components/lpikit/ProjectView/LinkedProjects/ProjectLinkedProjects.vue'
                    ),
            },
            {
                path: 'comments',
                name: 'projectComments',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectComments" */ '../components/lpikit/ProjectComments/ProjectComments.vue'
                    ),
            },
            {
                path: 'announcements',
                name: 'projectAnnouncements',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectAnnouncements" */ '../components/lpikit/ProjectAnnouncements/ProjectAnnouncements.vue'
                    ),
            },
            {
                path: 'project-settings',
                name: 'ProjectSettings',
                component: () =>
                    import(
                        /* webpackChunkName: "ProjectSettings" */ '../components/lpikit/ProjectSettings/ProjectSettings.vue'
                    ),
            },
        ],
    },
    {
        path: '/stats',
        name: 'stats',
        component: () =>
            import(/* webpackChunkName: "Stat" */ '../components/lpikit/Stats/StatsLayout.vue'),
        meta: { requiresAuth: true, resetScroll: true },
    },
    {
        path: '/notifications-settings',
        name: 'settings',
        component: () =>
            import(
                /* webpackChunkName: "SettingsLayout" */ '../components/lpikit/Settings/SettingsLayout.vue'
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
                /* webpackChunkName: "TermsOfService" */ '../components/lpikit/TermsOfService/TermsOfService.vue'
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
                /* webpackChunkName: "LegalNotices" */ '../components/lpikit/Legal/LegalNotices.vue'
            ),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/cookies',
        name: 'cookies',
        component: () =>
            import(/* webpackChunkName: "Cookies" */ '../components/lpikit/Legal/CookiesPage.vue'),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/accessibility',
        name: 'accessibility',
        component: () =>
            import(
                /* webpackChunkName: "Accessibility" */ '../components/lpikit/Legal/AccessibilityPage.vue'
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
                /* webpackChunkName: "PersonalData" */ '../components/lpikit/Legal/PersonalData.vue'
            ),

        meta: {
            resetScroll: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'page404',
        component: () => import(/* webpackChunkName: "ErrorPage" */ '../views/ErrorPage.vue'),
        meta: {
            resetScroll: true,
        },
    },
]

export default routes
