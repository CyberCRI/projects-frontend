<template>
  <div
    :key="groupId"
    class="group-layout"
    :class="{
      'can-edit-group': canEditGroup,
      'group-edit-layout': isEditing,
      'group-display-layout': !isEditing,
    }"
  >
    <div v-if="groupData" class="page-section-extra-wide">
      <NavPanelLayout
        :is-loading="isLoading"
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="groupHierarchy || []"
        @toggle-nav-panel="toggleNavPanel"
        @collapse-nav-panel="isNavCollapsed = true"
      >
        <template #nav-panel>
          <LazyGroupNavPanel
            v-if="!isLoading && !isNavCollapsed"
            :class="{ collapsed: isNavCollapsed }"
            :group-tabs="groupTabs"
            :current-tab="currentTab"
            :email="groupEmail"
            :can-edit-group="canEditGroup"
            :is-editing="isEditing"
            class="slide-panel"
            @navigated="onNavigated"
            @toggle-editing="toggleEditing"
          />
        </template>
        <template v-if="currentTab" #content>
          <SubPageTitle :title-prefix="groupName" :current-tab="currentTab" />
          <NuxtPage v-bind="currentTab.props" />
        </template>
      </NavPanelLayout>
    </div>

    <NavPanelLoader v-else />
    <!--div class="page-section-extra-wide tabs-wrapper">
      <GroupTabs
        :description="groupDescription"
        :projects-initial-request="projectsInitialRequest"
        :is-projects-loading="isProjectsLoading"
        :members-initial-request="membersInitialRequest"
        :is-members-loading="isMembersLoading"
        :is-loading="isLoading"
        :align-left="true"
        :border="false"
      />
    </div-->
  </div>
</template>

<script>
import { capitalize } from 'es-toolkit'

import { getGroup, getGroupMember, getGroupProject } from '@/api/groups.service'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'GroupPageInnerV2',
  props: {
    groupId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const peopleGroupsStore = usePeopleGroupsStore()
    const organizationsStore = useOrganizationsStore()
    const { canEditGroup } = usePermissions()
    const uniqueId = 'group-nav-panel'
    const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
      useToggleableNavPanel(uniqueId)

    const onNavigated = collapseIfUnderBreakpoint

    return {
      peopleGroupsStore,
      organizationsStore,
      canEditGroup,
      isNavCollapsed,
      toggleNavPanel,
      onNavigated,
    }
  },

  data() {
    return {
      groupData: null,
      membersInitialRequest: {},
      projectsInitialRequest: {},
      isLoading: true,
      isProjectsLoading: true,
      isMembersLoading: true,
    }
  },

  computed: {
    groupName() {
      return this.groupData?.name
    },
    groupImage() {
      return this.groupData?.header_image
    },
    groupEmail() {
      return this.groupData?.email
    },
    groupVisibility() {
      return this.groupData?.publication_status
    },
    // groupSlug() {
    //   return this.groupData?.slug
    // },

    groupDescription() {
      return this.groupData?.description
    },
    groupShortDescription() {
      return this.groupData?.short_description
    },

    groupHierarchy() {
      const root = {
        name: capitalize(this.$t('common.groups')),
        route: { name: 'Groups' },
      }
      if (!this.groupData) return [root]
      return [
        root,
        ...this.groupData.hierarchy.map((group) => ({
          name: group.name,
          route: { name: 'Group', params: { groupId: group.slug || group.id } },
        })),
      ]
    },
    groupChildren() {
      return this.groupData?.children
    },

    groupTabsDisplay() {
      return [
        {
          key: 'group-snapshot',
          dataTest: 'group-snapshot',
          label: this.$t('group.snapshot'),
          view: `/group/${this.$route.params.groupId}/snapshot`,
          altView: `/group/${this.$route.params.groupId}/snapshot/edit`,
          props: {
            description: this.groupDescription,
            projectsInitialRequest: this.projectsInitialRequest,
            isProjectsLoading: this.isProjectsLoading,
            membersInitialRequest: this.membersInitialRequest,
            isMembersLoading: this.isMembersLoading,
            isLoading: this.isLoading,
            groupName: this.groupName,
            groupImage: this.groupImage,
            groupVisibility: this.groupVisibility,
            groupShortDescription: this.groupShortDescription,
            groupChildren: this.groupChildren,
          },
          condition: true,
          noTitle: true,
          icon: 'Home',
        },
        {
          key: 'group-members',
          dataTest: 'group-members',
          label: this.$t('group.members'),
          view: `/group/${this.$route.params.groupId}/members`,
          altView: `/group/${this.$route.params.groupId}/members/edit`,
          props: {
            membersInitialRequest: this.membersInitialRequest,
            isMembersLoading: this.isMembersLoading,
          },
          condition: true,
          icon: 'Users',
        },
        {
          key: 'group-projects',
          dataTest: 'group-projects',
          label: this.$t('group.projects'),
          view: `/group/${this.$route.params.groupId}/projects`,
          altView: `/group/${this.$route.params.groupId}/projects/edit`,
          props: {
            projectsInitialRequest: this.projectsInitialRequest,
            isProjectsLoading: this.isProjectsLoading,
          },
          condition: true,
          icon: 'Archive',
        },
      ]
    },

    groupTabsDisplayFiltered() {
      return this.groupTabsDisplay.filter((tab) => tab.condition)
    },

    groupTabsEdit() {
      return [
        {
          key: 'group-snapshot-edit',
          dataTest: 'group-snapshot-edit',
          label: this.$t('group.snapshot'),
          view: `/group/${this.$route.params.groupId}/snapshot/edit`,
          altView: `/group/${this.$route.params.groupId}/snapshot`,
          props: {
            isInEditingMode: true,
            description: this.groupDescription,
            projectsInitialRequest: this.projectsInitialRequest,
            isProjectsLoading: this.isProjectsLoading,
            membersInitialRequest: this.membersInitialRequest,
            isMembersLoading: this.isMembersLoading,
            isLoading: this.isLoading,
            groupName: this.groupName,
            groupImage: this.groupImage,
            groupVisibility: this.groupVisibility,
            groupShortDescription: this.groupShortDescription,
            groupChildren: this.groupChildren,
            onReloadGroup: this.loadGroup,
          },
          condition: true,
          noTitle: true,
          icon: 'Home',
        },
        {
          key: 'groups-members-edit',
          dataTest: 'groups-members-edit',
          label: this.$t('group.members'),
          view: `/group/${this.$route.params.groupId}/members/edit`,
          altView: `/group/${this.$route.params.groupId}/members`,
          props: {
            isInEditingMode: true,
            groupData: this.groupData,
            onReloadGroupMembers: this.loadGroupMembers,
          },
          condition: this.groupData,
          icon: 'Users',
        },
        {
          key: 'group-projects-edit',
          dataTest: 'group-projects-edit',
          label: this.$t('group.projects'),
          view: `/group/${this.$route.params.groupId}/projects/edit`,
          altView: `/group/${this.$route.params.groupId}/projects`,
          props: {
            isInEditingMode: true,
            groupData: this.groupData,
            onReloadGroupProjects: this.loadGroupProjects,
          },
          condition: this.groupData,
          icon: 'Archive',
        },
      ].map((entry) => ({
        ...entry,
        isEditing: true,
        actionIcon: 'Pen',
      }))
    },

    groupTabsEditFiltered() {
      return this.groupTabsEdit.filter((tab) => tab.condition)
    },

    groupTabs() {
      return this.isEditing ? this.groupTabsEditFiltered : this.groupTabsDisplayFiltered
    },

    allGroupsTabs() {
      return [...this.groupTabsDisplay, ...this.groupTabsEdit]
    },

    currentTab() {
      return this.allGroupsTabs.find((tab) => this.$route.fullPath === tab.view)
    },

    currentOrganizationCode() {
      return this.organizationsStore.current.code
    },

    isEditing() {
      return this.currentTab?.isEditing || false
    },
  },
  watch: {
    groupId: {
      handler: function (neo, old) {
        if (neo && neo != old) {
          this.load()
        }
      },
      immediate: true,
    },

    canEditGroup: {
      handler: function (neo /*, old*/) {
        if (!neo && /*neo !== old && */ this.isEditing) {
          if (import.meta.client) this.$router.push(this.currentTab.altView)
        }
      },
      immediate: true,
    },

    isEditing: {
      handler: function (neo /*, old*/) {
        if (neo && /* neo !== old && */ !this.canEditGroup) {
          if (import.meta.client) this.$router.push(this.currentTab.altView)
        }
      },
      immediate: true,
    },
  },

  methods: {
    toggleEditing() {
      this.$router.push(this.currentTab.altView)
    },
    async load() {
      if (!import.meta.client) return
      this.isLoading = true
      this.isProjectsLoading = true
      this.isMembersLoading = true

      this.peopleGroupsStore.currentId = this.groupId
      try {
        await Promise.all([this.loadGroup(), this.loadGroupMembers(), this.loadGroupProjects()])
      } catch {
        console.error("group data couldn't be loaded")
      }

      this.isLoading = false
    },

    async loadGroup() {
      try {
        this.isLoading = true
        this.groupData = await getGroup(
          this.currentOrganizationCode,
          this.groupId,
          /*no error*/ true
        )

        // we can't use "this.groupId" because it might be a slug and not an id....
        this.peopleGroupsStore.currentId = this.groupData.id
      } catch {
        this.$router.replace({
          name: 'page404',
          params: { pathMatch: this.$route.path.substring(1).split('/') },
        })
      } finally {
        this.isLoading = false
      }
    },

    async loadGroupMembers() {
      try {
        const groupMemberData = await getGroupMember(
          this.currentOrganizationCode,
          this.groupId,
          /*no error*/ true
        )
        this.membersInitialRequest = groupMemberData
      } finally {
        // no catch / log because it might be a permission denied
        this.isMembersLoading = false
      }
    },

    async loadGroupProjects() {
      try {
        const groupProjectData = await getGroupProject(
          this.currentOrganizationCode,
          this.groupId,
          /*no error*/ true
        )
        this.projectsInitialRequest = groupProjectData
      } finally {
        // no catch / log because it might be a permission denied
        this.isProjectsLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.group-layout,
.group-edit-layout {
  margin-top: pxToRem(48px);
}

.recommandations {
  margin-top: $space-2xl;
}
</style>
