<template>
  <div :key="groupId" class="group-layout">
    <div class="page-section-extra-wide">
      <NavPanelLayout
        :is-loading="loading"
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="groupHierarchy || []"
        @toggle-nav-panel="toggleNavPanel"
        @collapse-nav-panel="isNavCollapsed = true"
      >
        <template #nav-panel>
          <LazyGroupNavPanel
            v-if="!loading && !isNavCollapsed"
            :class="{ collapsed: isNavCollapsed }"
            :group-tabs="groupTabs"
            :current-tab="currentTab"
            :email="groupEmail"
            :can-edit-group="canEditGroup"
            :is-editing="isEditing"
            :edit-group-link="editGroupLink"
            class="slide-panel"
            @navigated="onNavigated"
          />
        </template>
        <template v-if="currentTab" #content>
          <h2 v-if="!currentTab.noTitle" class="content-title">
            {{ groupName }} - {{ currentTab.label }}
          </h2>
          <NuxtPage v-bind="currentTab.props" />
        </template>
      </NavPanelLayout>
    </div>
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
      groupSlug: '',
      groupName: '',
      groupImage: null,
      groupEmail: '',
      groupVisibility: '',
      groupDescription: '',
      groupShortDescription: '',
      membersInitialRequest: {},
      projectsInitialRequest: {},
      isLoading: true,
      isProjectsLoading: true,
      isMembersLoading: true,
      groupHierarchy: [],
      groupChildren: [],
    }
  },

  computed: {
    groupTabs() {
      return [
        {
          key: 'snapshot',
          label: this.$t('group.snapshot'),
          view: `/group/${this.$route.params.groupId}/snapshot`,
          props: {
            description: this.description,
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
          key: 'members',
          label: this.$t('group.members'),
          view: `/group/${this.$route.params.groupId}/members`,
          props: {
            membersInitialRequest: this.membersInitialRequest,
            isMembersLoading: this.isMembersLoading,
          },
          condition: true,
          icon: 'Users',
        },
        {
          key: 'projects',
          label: this.$t('group.projects'),
          view: `/group/${this.$route.params.groupId}/projects`,
          props: {
            projectsInitialRequest: this.projectsInitialRequest,
            isProjectsLoading: this.isProjectsLoading,
          },
          condition: true,
          icon: 'Archive',
        },
        {
          key: 'projects',
          label: this.$t('group.edit.title'),
          view: `/group/${this.$route.params.groupId}/Edit`,
          props: {
            projectsInitialRequest: this.projectsInitialRequest,
            isProjectsLoading: this.isProjectsLoading,
            isV2: true,
          },
          condition: this.canEditGroup,
          icon: 'Cog',
          actionIcon: 'Pen',
        },
      ].filter((tab) => tab.condition)
    },

    currentTab() {
      return this.groupTabs.find((tab) => this.$route.fullPath === tab.view)
    },

    currentOrganizationCode() {
      return this.organizationsStore.current.code
    },
    editGroupLink() {
      return this.isEditing
        ? `/group/${this.groupSlug || this.groupId}`
        : `/group/${this.groupSlug || this.groupId}/Edit`
    },

    isEditing() {
      return this.$route.fullPath === `/group/${this.groupSlug || this.groupId}/Edit`
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
  },

  methods: {
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
        const groupData = await getGroup(
          this.currentOrganizationCode,
          this.groupId,
          /*no error*/ true
        )
        this.groupName = groupData.name
        this.groupImage = groupData.header_image
        this.groupEmail = groupData.email
        this.groupVisibility = groupData.publication_status
        this.groupSlug = groupData.slug

        this.groupDescription = groupData.description
        this.groupShortDescription = groupData.short_description

        this.groupHierarchy = [
          {
            name: this.$filters.capitalize(this.$t('common.groups')),
            route: { name: 'Groups' },
          },
          ...groupData.hierarchy.map((group) => ({
            name: group.name,
            route: { name: 'Group', params: { groupId: group.slug || group.id } },
          })),
        ]
        this.groupChildren = groupData.children

        // we can't use "this.groupId" because it might be a slug and not an id....
        this.peopleGroupsStore.currentId = groupData.id
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
.group-layout {
  margin-top: pxToRem(48px);
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: $space-2xl 0;
}

.recommandations {
  margin-top: $space-2xl;
}

.content-title {
  color: $primary-dark;
  font-size: $font-size-4xl;
}
</style>
