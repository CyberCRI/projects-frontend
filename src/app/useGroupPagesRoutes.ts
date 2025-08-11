export default function useGroupPagesRoutes() {
  return [
    {
      path: '/group/:groupId',
      name: 'Group',
      redirect: { name: 'groupSnapshot' },
      component: () => import('../pages/GroupPageV2/GroupPage.vue'),
      children: [
        // display
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
        // retro compat
        {
          path: 'Edit',
          name: 'frontEditGroup',
          redirect: { name: 'groupSnapshotEdit' },
        },
        // edit
        {
          path: 'snapshot/edit',
          name: 'groupSnapshotEdit',
          props: (route) => ({
            isReducedMode: true,
            groupId: route.params.groupId,
          }),
          component: () => import('../pages/CreateEditGroupPage/CreateEditGroupPage.vue'),
        },
        {
          path: 'members/edit',
          name: 'groupMembersEdit',
          component: () => import('../pages/GroupPageV2/Tabs/GroupMembersEditTab.vue'),
        },
        {
          path: 'projects/edit',
          name: 'groupProjectsEdit',
          component: () => import('../pages/GroupPageV2/Tabs/GroupProjectsEditTab.vue'),
        },
      ],
      props: true,
    },
  ]
}
