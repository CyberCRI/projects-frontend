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
          component: () => import('../pages/GroupPageV2/Tabs/Members/GroupMembersTab.vue'),
        },
        {
          path: 'projects',
          name: 'groupProjects',
          component: () => import('../pages/GroupPageV2/Tabs/Projects/GroupProjectsTab.vue'),
        },
        {
          path: 'publications',
          name: 'groupPublications',
          component: () => import('../pages/GroupPageV2/Tabs/Documents/GroupDocumentsTab.vue'),
          props: () => ({
            documentType: 'publications',
          }),
        },
        {
          path: 'conferences',
          name: 'groupConferences',
          component: () => import('../pages/GroupPageV2/Tabs/Documents/GroupDocumentsTab.vue'),
          props: () => ({
            documentType: 'conferences',
          }),
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
          component: () => import('../pages/GroupPageV2/Tabs/GroupEditTab.vue'),
        },
        {
          path: 'members/edit',
          name: 'groupMembersEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Members/GroupMembersEditTab.vue'),
        },
        {
          path: 'projects/edit',
          name: 'groupProjectsEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Projects/GroupProjectsEditTab.vue'),
        },
        {
          path: 'publications/edit',
          name: 'groupPublicationsEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Documents/GroupDocumentsEditTab.vue'),
          props: () => ({
            documentType: 'publications',
          }),
        },
        {
          path: 'conferences/edit',
          name: 'groupConferencesEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Documents/GroupDocumentsEditTab.vue'),
          props: () => ({
            documentType: 'conferences',
          }),
        },
      ],
      props: true,
    },
  ]
}
