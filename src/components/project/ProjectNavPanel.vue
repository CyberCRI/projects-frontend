<template>
  <div class="project-nav-panel">
    <div class="nav-panel" :class="{ collapsed: isNavCollapsed }">
      <LpiButton
        :btn-icon="isNavCollapsed ? 'ChevronRight' : 'ChevronLeft'"
        class="toggle-button"
        @click="toggleNavPanel"
      />
      <div v-if="!isNavCollapsed" class="nav-panel-inner">
        <div v-if="project && canEditProject" class="edit-btn-ctn">
          <LpiButton
            :label="$t('project.edit')"
            btn-icon="Pen"
            data-test="header-project-button"
            class="edit-btn"
            @click="editProject"
          />
        </div>

        <menu>
          <li
            v-for="entry in projectTabs"
            :key="entry.view"
            class="menu-entry"
            :class="{ active: entry == currentTab }"
          >
            <NuxtLink
              v-if="entry.condition"
              class="link"
              :data-test="entry.dataTest"
              :to="entry.view"
            >
              <IconImage class="icon" :name="entry.icon || 'Article'" />
              {{ entry.label }}
            </NuxtLink>
          </li>
        </menu>

        <div
          v-if="project && canEditProject"
          v-click-outside="() => (addToProjectMenuVisible = false)"
          class="add-to-project-ctn"
        >
          <LpiButton
            v-if="canEditProject"
            :animation="false"
            :class="{ active: addToProjectMenuVisible }"
            :label="$t('common.add')"
            class="add-to-project-button"
            btn-icon="Plus"
            data-test="add-to-project"
            @click="toggleAddToProject"
          />

          <transition name="fade">
            <AddToProjectDropdown
              v-if="addToProjectMenuVisible && canEditProject"
              :project="project"
              class="add-to-project"
              @close-dropdown="toggleAddToProject"
            />
          </transition>
        </div>

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
          <ToolTip class="share-tip shadowed" placement="bottom" trigger="clickToOpen">
            <template #custom-content>
              <div class="share-ctn">
                <button @click="facebookShare">
                  <IconImage name="Facebook" />
                </button>
                <button @click="linkedinShare">
                  <IconImage name="Linkedin" />
                </button>
              </div>
            </template>
            <ExternalLabelButton
              class="space-button bg-on-hover"
              :label="$t('group.share')"
              btn-icon="Share"
              vertical-layout
            />
          </ToolTip>
        </div>

        <SimilarProjectsV2
          v-if="similarProjects && similarProjects.length"
          id="similar-projects"
          :similar-projects="similarProjects"
          class="similar-projects v2"
        />
      </div>
    </div>
    <div class="content-panel">
      <h2 v-if="!currentTab.noTitle" class="content-title">{{ currentTab.label }}</h2>
      <NuxtPage v-bind="currentTab.props" />
    </div>
  </div>
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
  },

  emits: ['update-follow'],

  setup() {
    const usersStore = useUsersStore()
    const { canEditProject, isAdmin } = usePermissions()
    return {
      usersStore,
      canEditProject,
      isAdmin,
    }
  },

  data() {
    return {
      addToProjectMenuVisible: false,
      isNavCollapsed: false,
    }
  },

  computed: {
    currentTab() {
      return this.projectTabs.find((tab) =>
        tab.view?.name
          ? this.$route.matched.some((r) => r.name === tab.view?.name)
          : this.$route.path.indexOf(tab.view) === 0
      )
    },

    followed() {
      return this.follow && this.follow.is_followed
    },
  },

  methods: {
    toggleNavPanel() {
      this.isNavCollapsed = !this.isNavCollapsed
    },
    toggleAddToProject() {
      this.addToProjectMenuVisible = !this.addToProjectMenuVisible
    },

    editProject() {
      this.projectLayoutToggleAddModal('project')
    },

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
      this.projectLayoutGoToTab('comments')
    },
    goToAnnouncements() {
      this.projectLayoutGoToTab('announcements')
    },
    facebookShare() {
      window?.open(`https://www.facebook.com/sharer/sharer.php?u=${this.sharedUrl}`)
    },
    // twitterShare() {
    //     window?.open(`https://twitter.com/intent/tweet?url=${this.sharedUrl}&text=`)
    // },
    linkedinShare() {
      window?.open(`https://www.linkedin.com/shareArticle?mini=true&url=${this.sharedUrl}`)
    },

    /* TODO: Put this back once we figured out to who are we supposed to write to */
    // mailTo() {
    //     window?.open('mailto:projects.platform@learningplanetinstitute.org')
    // },
  },
}
</script>

<style lang="scss" scoped>
.project-nav-panel {
  display: flex;
  gap: 3rem;
}

.nav-panel {
  flex-shrink: 0;
  flex-grow: 0;

  .toggle-button {
    margin-left: auto;
  }
}

.nav-panel-inner {
  width: 16rem;
}

.content-panel {
  flex-basis: 100%;
}

.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

menu {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  list-style-type: none;

  .menu-entry {
    &:hover,
    &.active {
      background-color: $primary-light;
    }

    .link {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0.4rem;
      color: $primary-dark;

      .icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        fill: $primary-dark;
      }
    }
  }
}

.similar-projects {
  margin-top: 3rem;
}

.add-to-project-ctn {
  display: flex;
  justify-content: center;
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
    bottom: 0;
    left: 1px;
  }

  .project-config {
    top: 42px;
    right: 0;
  }
}

.content-title {
  font-size: $font-size-4xl;
}

.share-buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.5rem 0;
  margin: 0.5rem 0;
  border-width: 1px 0;
  border-style: solid;
  border-color: $light-gray;

  .share-ctn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-m;
    z-index: 1;
    flex-grow: 1;
    flex-shrink: 1;

    svg {
      width: 24px;
      fill: $primary-dark;
      cursor: pointer;
    }
  }
}
</style>
