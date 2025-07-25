<template>
  <div class="group-layout">
    <div class="page-section-extra-wide">
      <BreadCrumbs
        v-if="groupHierarchy"
        :breadcrumbs="groupHierarchy"
        :group-name="groupName"
        :is-loading="isLoading"
      />

      <SubGroups
        v-if="groupChildren.length > 0"
        :subgroups="groupChildren"
        :is-loading="isLoading"
      />

      <div v-if="!isLoading && canEditGroup" class="edit-btn-wrapper">
        <LinkButton
          class="edit-btn"
          btn-icon="Pen"
          :label="editGroupLabel"
          data-test="edit-group"
          :to="{
            name: 'frontEditGroup',
            params: { groupId: groupSlug || groupId },
          }"
        />
      </div>

      <GroupHeader
        :title="groupName"
        :image="groupImage"
        :visibility="groupVisibility"
        :email="groupEmail"
        :short-description="groupShortDescription"
        :is-loading="isLoading"
      />
    </div>
    <div class="page-section-extra-wide tabs-wrapper">
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
    </div>
  </div>
</template>

<script>
import BreadCrumbs from '@/components/base/navigation/BreadCrumbs.vue'
import SubGroups from '@/components/group/SubGroups/SubGroups.vue'
import GroupHeader from '@/components/group/GroupHeader/GroupHeader.vue'
import GroupTabs from '@/pages/GroupPage/Tabs/GroupTabs.vue'
import { getGroup, getGroupMember, getGroupProject } from '@/api/groups.service'
import LinkButton from '@/components/base/button/LinkButton.vue'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'GroupPageInner',
  components: {
    BreadCrumbs,
    SubGroups,
    GroupHeader,
    GroupTabs,
    LinkButton,
  },
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
    return {
      peopleGroupsStore,
      organizationsStore,
      canEditGroup,
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
    currentOrganizationCode() {
      return this.organizationsStore.current.code
    },
    editGroupLabel() {
      return this.$t('group.edit-group')
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
.group-layout,
.group-edit-layout {
  margin-top: pxToRem(48px);
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: $space-2xl 0;
}

.edit-btn-wrapper {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-bottom: 24px;
}

.recommandations {
  margin-top: $space-2xl;
}
</style>
