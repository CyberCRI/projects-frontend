<template>
  <div class="project-nav-panel">
    <div class="nav-panel">
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
    <div class="content-panel">
      <h2 v-if="!currentTab.noTitle" class="content-title">{{ currentTab.label }}</h2>
      <NuxtPage v-bind="currentTab.props" />
    </div>
  </div>
</template>

<script>
import useProjectCategories from '@/stores/useProjectCategories.ts'
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
    comments: {
      type: Array,
      default: () => [],
    },
    projectMessages: {
      type: Array,
      default: () => [],
    },
    locations: {
      type: Array,
      default: () => [],
    },
    announcements: {
      type: Array,
      default: () => [],
    },
    fileResources: {
      type: Array,
      default: () => [],
    },
    linkResources: {
      type: Array,
      default: () => [],
    },
    blogEntries: {
      type: Array,
      default: () => [],
    },
    goals: {
      type: Array,
      default: () => [],
    },
    sdgs: {
      type: Array,
      default: () => [],
    },
    team: {
      type: Object,
      default: () => ({ owners: [], members: [], reviewers: [] }),
    },
    reviews: {
      type: Array,
      default: () => [],
    },
    linkedProjects: {
      type: Array,
      default: () => [],
    },
  },

  emits: [
    'reload-comments',
    'reload-project-messages',
    'reload-announcements',
    'reload-file-resources',
    'reload-link-resources',
    'reload-blog-entries',
    'reload-goals',
    'reload-sdgs',
    'reload-team',
    'reload-reviews',
    'reload-linked-projects',
    'reload-project',
    'update-follow',
  ],

  setup() {
    const usersStore = useUsersStore()
    const projectCategoriesStore = useProjectCategories()
    const { canEditProject, isAdmin } = usePermissions()
    return {
      projectCategoriesStore,
      usersStore,
      canEditProject,
      isAdmin,
    }
  },

  data() {
    return {
      addToProjectMenuVisible: false,
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

    categories() {
      return this.projectCategoriesStore.hierarchy
    },

    isMemberOrAdmin() {
      const members = [...this.team.members, ...this.team.owners, ...this.team.reviewers]
      return this.isAdmin || members.find((user) => this.usersStore.id === user.id)
    },

    projectTabs() {
      return [
        {
          key: 'project-summary',
          label: this.$t('project.summary'),
          view: `/projects/${this.$route.params.slugOrId}/summary`,
          props: {
            project: this.project,
            comments: this.comments,
            goals: this.goals,
            similarProjects: this.similarProjects,
            locations: this.locations,
            fileResources: this.fileResources,
            linkResources: this.linkResources,
            blogEntries: this.blogEntries,
            team: this.team,
            reviews: this.reviews,
            linkedProjects: this.linkedProjects,
            onReloadReviews: () => this.$emit('reload-reviews'),
            onReloadProject: () => this.$emit('reload-project'),
          },
          condition: true,
          dataTest: 'project-summary',
          icon: 'Home',
          noTitle: true,
        },
        {
          key: 'project-description',
          label: this.$t('form.description'),
          view: `/projects/${this.$route.params.slugOrId}/description`,
          props: {
            project: this.project,
          },
          condition: true,
          dataTest: 'project-description',
          icon: 'Article',
        },
        {
          key: 'project-goals',
          label: this.$t('goal.goals'),
          view: `/projects/${this.$route.params.slugOrId}/goals`,
          props: {
            project: this.project,
            goals: this.goals,
            sdgs: this.sdgs,
            onReloadGoals: () => this.$emit('reload-goals'),
            onReloadSdgs: () => this.$emit('reload-sdgs'),
          },
          condition: this.goals?.length || this.sdgs?.length || this.isRoute('projectGoals'), // prevent error when emptying the current tab
          dataTest: 'project-goals',
          icon: 'TimerLine',
        },
        {
          key: 'project-blog',
          label: this.$t('blog.title'),
          view: `/projects/${this.$route.params.slugOrId}/blog-entries`,
          props: {
            project: this.project,
            blogEntries: this.blogEntries,
            onReloadBlogEntries: () => this.$emit('reload-blog-entries'),
          },
          condition: !!this.blogEntries.length || this.isRoute('projectBlog'), // prevent error when emptying the current tab
          dataTest: 'project-blog',
          icon: 'Progress5',
        },
        {
          key: 'project-resources',
          label: this.$t('resource.resources'),
          view: `/projects/${this.$route.params.slugOrId}/resources`,
          props: {
            project: this.project,
            fileResources: this.fileResources,
            linkResources: this.linkResources,
            onReloadFileResources: () => this.$emit('reload-file-resources'),
            onReloadLinkResources: () => this.$emit('reload-link-resources'),
          },
          condition:
            (this.project && !!(this.project.files.length || this.project.links.length)) ||
            this.isRoute('projectResources'), // prevent error when emptying the current tab
          dataTest: 'project-resources',
          icon: 'Globe',
        },
        {
          key: 'project-linked-projects',
          label: this.$t('project.linked-projects'),
          view: `/projects/${this.$route.params.slugOrId}/linked-projects`,
          props: {
            project: this.project,
            linkedProjects: this.linkedProjects,
            onReloadLinkedProjects: () => this.$emit('reload-linked-projects'),
          },
          condition: !!this.linkedProjects?.length || this.isRoute('projectLinkedProjects'), // prevent error when emptying the current tab
          dataTest: 'project-linked-projects',
          icon: 'LinkRotated',
        },
        {
          key: 'project-team',
          label: this.$t('team.team'),
          view: `/projects/${this.$route.params.slugOrId}/team`,
          props: {
            project: this.project,
            team: this.team,
            onReloadTeam: () => {
              console.log('reload tabs')
              this.$emit('reload-team')
            },
          },
          condition: true,
          dataTest: 'project-team',
          icon: 'PeopleGroup',
        },
        {
          key: 'project-comments',
          label: this.$t('comment.comments'),
          view: `/projects/${this.$route.params.slugOrId}/comments`,
          props: {
            project: this.project,
            comments: this.comments,
            onReloadComments: () => this.$emit('reload-comments'),
          },
          condition: true,
          dataTest: 'project-comments',
          icon: 'ChatBubble',
        },
        {
          key: 'project-private-exchange',
          label: this.$t('comment.private-exchange.tab'),
          view: `/projects/${this.$route.params.slugOrId}/private-exchange`,
          props: {
            project: this.project,
            team: this.team,
            projectMessages: this.projectMessages,
            onReloadProjectMessages: () => this.$emit('reload-project-messages'),
          },
          condition: this.isMemberOrAdmin,
          dataTest: 'project-private-exchange',
          icon: 'ChatBubble',
        },
        {
          key: 'project-announcements',
          label: this.$t('home.announcements'),
          view: `/projects/${this.$route.params.slugOrId}/announcements`,
          props: {
            project: this.project,
            announcements: this.announcements,
            onReloadAnnouncements: () => this.$emit('reload-announcements'),
          },
          condition: this.announcements?.length > 0 || this.isRoute('projectAnnouncements'), // prevent error when emptying the current tab
          dataTest: 'project-announcements',
          icon: 'BullhornOutline',
        },
        {
          key: 'project-settings',
          label: this.$t('project.settings'),
          view: `/projects/${this.$route.params.slugOrId}/project-settings`,
          condition: true,
          props: {
            project: this.project,
            team: this.team,
            categories: this.categories,
            onReloadTeam: () => this.$emit('reload-team'),
            onReloadReviews: () => this.$emit('reload-reviews'),
            onReloadProject: () => this.$emit('reload-project'),
          },
          dataTest: 'project-settings',
          icon: 'Cog',
        },
      ].filter((tab) => tab.condition)
    },
  },

  methods: {
    toggleAddToProject() {
      this.addToProjectMenuVisible = !this.addToProjectMenuVisible
    },

    isRoute(name) {
      return this.$route && this.$route.name === name
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
  flex-basis: 16rem;
  flex-shrink: 0;
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
