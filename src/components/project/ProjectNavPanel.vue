<template>
  <NavPanelAside>
    <div v-if="project && canEditProject" class="edit-btn-ctn">
      <GroupButton
        :model-value="isEditing"
        :options="[
          { value: false, label: 'Show' },
          { value: true, label: 'Edit' },
        ]"
        :data-test="isEditing ? 'display-project' : 'edit-project'"
        class="edit-btn small"
        @update:model-value="switchView"
      />
    </div>

    <NavPanelMenu
      :menu-entries="projectTabs"
      :current-tab="currentTab"
      @navigated="navigated"
      @action-triggered="onActionTriggered"
    />

    <div class="share-buttons">
      <ExternalLabelButton
        v-if="usersStore.isConnected"
        class="space-button bg-on-hover"
        :label="followed ? $t('project.followed') : $t('project.follow')"
        :btn-icon="followed ? 'Heart' : 'HeartOutline'"
        vertical-layout
        @click="toggleFollow"
      />
      <ExternalLabelButton
        v-if="announcements?.length"
        class="space-button article-button bg-on-hover"
        :label="$t('group.news')"
        btn-icon="Article"
        vertical-layout
        :nb-button="announcements.length.toString()"
        @click="goToAnnouncements"
      />
      <ExternalLabelButton
        class="space-button bg-on-hover"
        :label="$filters.capitalize($t('comment.comment-verb'))"
        btn-icon="ChatBubble"
        vertical-layout
        @click="goToCommentView"
      />
      <SocialShareButton :shared-url="sharedUrl" />
    </div>

    <div v-if="actionMenu.length" class="side-actions">
      <NavPanelMenu
        :menu-entries="actionMenu"
        @navigated="navigated"
        @action-triggered="onActionTriggered"
      />
    </div>

    <SimilarProjectsV2
      v-if="similarProjects && similarProjects.length"
      id="similar-projects"
      :similar-projects="similarProjects"
      class="similar-projects v2"
    />
  </NavPanelAside>
</template>

<script>
import useUsersStore from '@/stores/useUsers.ts'
import followUtils from '@/functs/followUtils.ts'

export default {
  name: 'ProjectNavPanel',

  inject: ['projectLayoutToggleAddModal', 'projectLayoutGoToTab'],

  props: {
    project: {
      type: Object,
      default: () => {},
    },

    similarProjects: {
      type: Array,
      default: () => [],
    },

    announcements: {
      type: Array,
      default: () => [],
    },
    projectTabs: { type: Array, required: true },
    currentTab: {
      type: Object,
      default: () => {},
    },
    follow: {
      type: Object,
      default: () => {},
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    actionMenu: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update-follow', 'navigated', 'toggle-editing', 'duplicate-project'],

  setup() {
    const usersStore = useUsersStore()
    const { canEditProject, isAdmin, isOrgAdmin } = usePermissions()
    return {
      usersStore,
      canEditProject,
      isAdmin,
      isOrgAdmin,
    }
  },

  data() {
    return {
      addToProjectMenuVisible: false,
      sharedUrl: useRequestURL().toString(),
    }
  },

  computed: {
    followed() {
      return this.follow && this.follow.is_followed
    },
  },

  methods: {
    onActionTriggered(menuEntry) {
      if (menuEntry.addModal === 'duplicate') {
        this.$emit('duplicate-project')
      } else {
        this.projectLayoutToggleAddModal(menuEntry.addModal)
      }
    },

    navigated() {
      this.$emit('navigated')
    },

    switchView() {
      this.$emit('toggle-editing', !this.isEditing)
    },

    // toggleAddToProject() {
    //   this.addToProjectMenuVisible = !this.addToProjectMenuVisible
    // },

    // editProject() {
    //   this.navigated()
    //   this.projectLayoutToggleAddModal('project')
    // },

    async toggleFollow() {
      try {
        if (this.follow && this.follow.is_followed) {
          await followUtils.unfollow({
            follower_id: this.follow.follow_id,
            project_id: this.project.id,
          })
          this.$emit('update-follow', { is_followed: false })
        } else {
          await followUtils.follow({
            follower_id: this.usersStore.id,
            project_id: this.project.id,
          })
          this.$emit('update-follow', {
            follower_id: this.usersStore.id,
            is_followed: true,
          })
        }
      } catch (error) {
        console.error('Error updating follow', error)
      }
    },

    goToCommentView() {
      this.navigated()
      this.projectLayoutGoToTab('comments')
    },
    goToAnnouncements() {
      this.navigated()
      this.projectLayoutGoToTab('announcements')
    },

    /* TODO: Put this back once we figured out to who are we supposed to write to */
    // mailTo() {
    //     window?.open('mailto:projects.platform@learningplanetinstitute.org')
    // },
  },
}
</script>

<style lang="scss" scoped>
.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.similar-projects {
  margin-top: 3rem;
}

// .add-to-project-ctn {
//   display: flex;
//   justify-content: center;
//   position: relative;
//   padding: 0.5rem 0;

//   .add-to-project-button:hover,
//   .project-config-button:hover {
//     opacity: 1 !important;
//   }

//   .add-to-project-button.active,
//   .project-config-button.active {
//     background-color: $white !important;
//     color: $primary-dark !important;

//     svg {
//       fill: $primary-dark;
//     }
//   }

//   .add-to-project,
//   .project-config {
//     position: absolute;
//     z-index: $zindex-toast;
//   }

//   .add-to-project {
//     bottom: 0;
//     left: 1px;
//   }

//   .project-config {
//     top: 42px;
//     right: 0;
//   }
// }

.share-buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  border-width: 1px 0;
  border-style: solid;
  border-color: $light-gray;

  --external-button-outer-size: 1.2rem;
  --external-button-inner-size: 1.2rem;
}
</style>
