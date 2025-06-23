<template>
  <div class="nav-panel">
    <div class="nav-panel-inner">
      <menu>
        <li
          v-for="entry in profileTabs"
          :key="entry.view"
          class="menu-entry"
          :class="{ active: entry == currentTab }"
        >
          <NuxtLink
            v-if="entry.condition"
            class="link"
            :data-test="entry.dataTest"
            :to="entry.view"
            @click="navigated"
          >
            <IconImage class="icon" :name="entry.icon || 'Article'" />
            {{ entry.label }}
          </NuxtLink>
        </li>
      </menu>

      <div v-if="isSelf || canEditUser" class="edit-btn-ctn">
        <LpiButton
          :label="editButtonLabel"
          btn-icon="Pen"
          data-test="edit-profile"
          class="edit-btn small"
          :to="editProfileLink"
          @click="editProfile"
        />
      </div>

      <!--
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
          class="add-to-project-button small"
          btn-icon="Plus"
          data-test="add-to-project"
          @click="toggleAddToProject"
        />

        <transition name="fade">
          <AddToProjectDropdown
            v-if="addToProjectMenuVisible && canEditProject"
            is-v2
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
      -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileNavPanel',

  props: {
    // user: {
    //   type: Object,
    //   default: () => {},
    // },

    isSelf: {
      type: Boolean,
      default: false,
    },

    editButtonLabel: {
      type: String,
      required: true,
    },
    editProfileLink: {
      type: String,
      required: true,
    },

    canEditUser: {
      type: Boolean,
      default: false,
    },
    profileTabs: { type: Array, required: true },
    currentTab: {
      type: Object,
      default: () => {},
    },
  },

  emits: ['navigated'],
  // data() {
  //   return {
  //     addToProjectMenuVisible: false,
  //   }
  // },

  methods: {
    navigated() {
      this.$emit('navigated')
    },

    // toggleAddToProject() {
    //   this.addToProjectMenuVisible = !this.addToProjectMenuVisible
    // },

    editProfile() {
      this.navigated()
      // TODO
      // this.projectLayoutToggleAddModal('project')
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-panel {
  flex-shrink: 0;
  flex-grow: 0;
}

@media screen and (max-width: $min-tablet) {
  .nav-panel {
    position: fixed;
    box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 10%);
    background-color: $white;
    z-index: 100;
    width: calc(18rem + 2.125rem);
    top: 3rem;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    padding: 2.125rem;
    box-sizing: border-box;
    padding-top: 4rem;
  }
}

@media screen and (min-width: $min-tablet) {
  .nav-panel-inner {
    width: 16rem;
  }
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
  padding: 0.5rem 0;

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
