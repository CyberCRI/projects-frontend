<template>
  <div class="group-tabs">
    <TabsLayout :align-left="true" :border="false" :tabs="groupTabs" router-view />
  </div>
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'

export default {
  name: 'GroupTabs',
  components: { TabsLayout },
  props: {
    description: {
      type: String,
      default: '',
    },
    projectsInitialRequest: {
      type: Object,
      default: () => ({}),
    },
    isProjectsLoading: {
      type: Boolean,
      default: true,
    },
    membersInitialRequest: {
      type: Object,
      default: () => ({}),
    },
    isMembersLoading: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      addToProjectMenuVisible: false,
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
          },
          condition: true,
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
        },
      ].filter((tab) => tab.condition)
    },
  },
}
</script>

<style lang="scss" scoped>
.group-tabs {
  .dropdown-ctn {
    position: relative;

    .add-to-project-button:hover,
    .project-config-button:hover {
      opacity: 1 !important;
    }

    .add-to-project-button.active,
    .project-config-button.active {
      background-color: $white !important;
      color: $primary-dark !important;

      svg {
        fill: $primary-dark;
      }
    }

    .add-to-project,
    .project-config {
      position: absolute;
      z-index: $zindex-toast;
    }

    .add-to-project {
      top: 43px;
      right: 1px;
    }

    .project-config {
      top: 42px;
      right: 0;
    }
  }

  > div:nth-child(2) {
    margin: 0 pxToRem(10px) 0 pxToRem(20px);
  }
}
</style>
