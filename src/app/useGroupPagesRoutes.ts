export default function useGroupPagesRoutes() {
  const runtimeConfig = useRuntimeConfig()

  return runtimeConfig.public.appUseProjectPageV2
    ? [
        {
          path: '/group/:groupId',
          name: 'Group',
          redirect: { name: 'groupSnapshot' },
          component: () => import('../pages/GroupPageV2/GroupPage.vue'),
          children: [
            {
              path: 'snapshot',
              name: 'groupSnapshot',
              component: () => import('../pages/GroupPageV2/Tabs/GroupSnapshotTab.vue'),
            },
            {
              path: 'members',
              name: 'groupMembers',
              component: () => import('../pages/GroupPageV2/Tabs/GroupMembersTab.vue'),
            },
            {
              path: 'projects',
              name: 'groupProjects',
              component: () => import('../pages/GroupPageV2/Tabs/GroupProjectsTab.vue'),
            },
            {
              path: 'Edit',
              name: 'frontEditGroup',
              props: (route) => ({ isV2: true, groupId: route.params.groupId }),
              component: () => import('../pages/CreateEditGroupPage/CreateEditGroupPage.vue'),
            },
          ],
          props: true,
        },
      ]
    : [
        {
          path: '/group/:groupId',
          name: 'Group',
          redirect: { name: 'groupSnapshot' },
          component: () => import('../pages/GroupPage/GroupPage.vue'),
          children: [
            {
              path: 'snapshot',
              name: 'groupSnapshot',
              component: () => import('../pages/GroupPage/Tabs/GroupSnapshotTab.vue'),
            },
            {
              path: 'members',
              name: 'groupMembers',
              component: () => import('../pages/GroupPage/Tabs/GroupMembersTab.vue'),
            },
            {
              path: 'projects',
              name: 'groupProjects',
              component: () => import('../pages/GroupPage/Tabs/GroupProjectsTab.vue'),
            },
          ],
          props: true,
        },
        {
          path: '/group/:groupId/Edit',
          name: 'frontEditGroup',
          props: true,
          component: () => import('../pages/CreateEditGroupPage/CreateEditGroupPage.vue'),
        },
      ]
}
