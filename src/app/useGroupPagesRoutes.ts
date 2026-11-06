export default function useGroupPagesRoutes() {
  return [
    {
      path: '/group/:groupIdOrSlug',
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
        {
          path: 'locations',
          name: 'groupLocations',
          component: () => import('../pages/GroupPageV2/Tabs/Locations/GroupLocationsTab.vue'),
        },

        {
          path: 'network',
          name: 'groupNetwork',
          component: () => import('../pages/GroupPageV2/Tabs/Network/GroupNetworkTab.vue'),
        },
        {
          path: 'gallery',
          name: 'groupGallery',
          component: () => import('../pages/GroupPageV2/Tabs/Gallery/GroupGalleryTab.vue'),
        },
        {
          path: 'subgroups',
          name: 'subGroups',
          component: () => import('../pages/GroupPageV2/Tabs/SubGroups/SubGroupsTab.vue'),
        },
        {
          path: 'news',
          name: 'groupNews',
          component: () => import('../pages/GroupPageV2/Tabs/News/GroupNewsTab.vue'),
        },
        {
          path: 'event',
          name: 'groupEvent',
          component: () => import('../pages/GroupPageV2/Tabs/Event/GroupEventTab.vue'),
        },
        // teams
        {
          path: 'positions',
          name: 'groupPositions',
          component: () => import('../pages/GroupPageV2/Tabs/Positions/GroupPositionsTab.vue'),
        },
        // labs
        {
          path: 'teams',
          name: 'groupTeams',
          component: () => import('../pages/GroupPageV2/Tabs/Teams/GroupTeamsTab.vue'),
        },
        {
          path: 'domains',
          name: 'groupDomains',
          component: () => import('../pages/GroupPageV2/Tabs/Domains/GroupDomainsTab.vue'),
        },
        {
          path: 'awards',
          name: 'groupAwards',
          component: () => import('../pages/GroupPageV2/Tabs/Positions/GroupPositionsTab.vue'),
        },
        {
          path: 'funding',
          name: 'groupFunding',
          component: () => import('../pages/GroupPageV2/Tabs/Funding/GroupFundingTab.vue'),
        },
        {
          path: 'teaching',
          name: 'groupTeaching',
          component: () => import('../pages/GroupPageV2/Tabs/Teaching/GroupTeachingTab.vue'),
        },
        {
          path: 'plateform',
          name: 'groupPlatform',
          component: () => import('../pages/GroupPageV2/Tabs/Platform/groupPlatformTab.vue'),
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
            groupIdOrSlug: route.params.groupIdOrSlug,
          }),
          component: () => import('../pages/GroupPageV2/Tabs/GroupEditTab.vue'),
        },
        {
          path: 'members/edit',
          name: 'groupMembersEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Members/GroupMembersTab.vue'),
        },
        {
          path: 'projects/edit',
          name: 'groupProjectsEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Projects/GroupProjectsTab.vue'),
        },
        {
          path: 'gallery/edit',
          name: 'groupGalleryEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Gallery/GroupGalleryTab.vue'),
        },
        {
          path: 'news/edit',
          name: 'groupNewsEdit',
          component: () => import('../pages/GroupPageV2/Tabs/News/GroupNewsTab.vue'),
        },
        {
          path: 'event/edit',
          name: 'groupEventEdit',
          component: () => import('../pages/GroupPageV2/Tabs/Event/GroupEventTab.vue'),
        },
      ],
      props: true,
    },
  ]
}
