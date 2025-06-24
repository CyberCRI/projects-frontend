export default function useProfilePagesRoutes() {
  const runtimeConfig = useRuntimeConfig()

  return runtimeConfig.public.appUseProjectPageV2
    ? [
        // PROFILE PAGE V2
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
          ],
        },
        {
          path: '/profile/edit',
          name: 'ProfileEdit',
          redirect: { name: 'ProfileEditGeneral' },
          component: () => import('../pages/UserProfilePageV2/UserProfilePage.vue'),
          props: {
            userId: null,
            isEditing: true,
          },
          children: [
            {
              path: 'general',
              name: 'ProfileEditGeneral',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileGeneralEditTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileEditBio',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileBioEditTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileEditProjects',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileProjectsEditTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileEditGroups',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileGroupsEditTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileEditSkills',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileSkillsEditTab.vue'),
            },
            {
              path: 'privacy',
              name: 'ProfileEditPrivacy',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfilePrivacyEditTab.vue'),
            },
          ],
          meta: {
            resetScroll: true,
            requiresAuth: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
          },
        },
        // END PROFILE PAGE V2
        // OTHER PROFILE PAGE V2
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
            // props: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
          },
          children: [
            {
              path: 'summary',
              name: 'ProfileSummaryOther',
              component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSummaryTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileBioOther',
              component: () => import('../pages/UserProfilePageV2/Tabs/ProfileBioTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileProjectsOther',
              component: () => import('../pages/UserProfilePageV2/Tabs/ProfileProjectTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileGroupsOther',
              component: () => import('../pages/UserProfilePageV2/Tabs/ProfileGroupsTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileSkillsOther',
              component: () => import('../pages/UserProfilePageV2/Tabs/ProfileSkillTab.vue'),
            },
          ],
        },
        {
          path: '/profile/edit/:userId',
          name: 'ProfileEditOtherUser',
          redirect: { name: 'ProfileEditGeneralOther' },
          component: () => import('../pages/UserProfilePageV2/UserProfilePage.vue'),
          props: (route) => ({ isEditing: true, userId: route.params.userId }),
          children: [
            {
              path: 'general',
              name: 'ProfileEditGeneralOther',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileGeneralEditTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileEditBioOther',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileBioEditTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileEditProjectsOther',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileProjectsEditTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileEditGroupsOther',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileGroupsEditTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileEditSkillsOther',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfileSkillsEditTab.vue'),
            },
            {
              path: 'privacy',
              name: 'ProfileEditPrivacyOther',
              component: () => import('../pages/ProfileEditPageV2/Tabs/ProfilePrivacyEditTab.vue'),
            },
          ],
          meta: {
            resetScroll: true,
            requiresAdmin: true,
            props: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
          },
        },
      ] // END OTHER PROFILE PAGE V2
    : [
        // PROFILE PAGE V1
        {
          path: '/profile',
          name: 'Profile',
          redirect: { name: 'ProfileSummary' },
          component: () => import('../pages/UserProfilePage/UserProfilePage.vue'),
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
              component: () => import('../pages/UserProfilePage/Tabs/ProfileSummaryTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileBio',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileBioTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileProjects',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileProjectTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileGroups',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileGroupsTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileSkills',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileSkillTab.vue'),
            },
          ],
        }, // END PROFILE PAGE V1
        {
          path: '/profile/edit',
          name: 'ProfileEdit',
          redirect: { name: 'ProfileEditGeneral' },
          component: () => import('../pages/ProfileEditPage/ProfileEditPage.vue'),
          children: [
            {
              path: 'general',
              name: 'ProfileEditGeneral',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileGeneralEditTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileEditBio',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileBioEditTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileEditProjects',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileProjectsEditTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileEditGroups',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileGroupsEditTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileEditSkills',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileSkillsEditTab.vue'),
            },
            {
              path: 'privacy',
              name: 'ProfileEditPrivacy',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfilePrivacyEditTab.vue'),
            },
          ],
          meta: {
            resetScroll: true,
            requiresAuth: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
          },
        },
        // OTHER PROFILE PAGE V1
        {
          path: '/profile/:userId',
          name: 'ProfileOtherUser',
          redirect: { name: 'ProfileSummaryOther' },
          component: () => import('../pages/UserProfilePage/UserProfilePage.vue'),
          props: true,
          meta: {
            resetScroll: true,
            // props: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
          },
          children: [
            {
              path: 'summary',
              name: 'ProfileSummaryOther',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileSummaryTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileBioOther',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileBioTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileProjectsOther',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileProjectTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileGroupsOther',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileGroupsTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileSkillsOther',
              component: () => import('../pages/UserProfilePage/Tabs/ProfileSkillTab.vue'),
            },
          ],
        },
        {
          path: '/profile/edit/:userId',
          name: 'ProfileEditOtherUser',
          redirect: { name: 'ProfileEditGeneralOther' },
          component: () => import('../pages/ProfileEditPage/ProfileEditPage.vue'),
          children: [
            {
              path: 'general',
              name: 'ProfileEditGeneralOther',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileGeneralEditTab.vue'),
            },
            {
              path: 'bio',
              name: 'ProfileEditBioOther',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileBioEditTab.vue'),
            },
            {
              path: 'projects',
              name: 'ProfileEditProjectsOther',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileProjectsEditTab.vue'),
            },
            {
              path: 'groups',
              name: 'ProfileEditGroupsOther',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileGroupsEditTab.vue'),
            },
            {
              path: 'skills',
              name: 'ProfileEditSkillsOther',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfileSkillsEditTab.vue'),
            },
            {
              path: 'privacy',
              name: 'ProfileEditPrivacyOther',
              component: () => import('../pages/ProfileEditPage/Tabs/ProfilePrivacyEditTab.vue'),
            },
          ],
          props: true,
          meta: {
            resetScroll: true,
            requiresAdmin: true,
            props: true,
            loginFromNotification: true,
            loginFromNotificationNewQueryParam: 'editNotifications',
          },
        }, // END OTHER PROFILE PAGE V1
      ]
}
