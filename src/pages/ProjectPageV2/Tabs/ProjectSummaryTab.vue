<template>
  <div class="project-summary">
    <div class="main-ctn">
      <LazyProjectHeaderV2
        :project="project"
        :sdgs="sdgs"
        :loading="!project"
        class="project-header v2"
      />

      <!-- description -->
      <DescriptionPlaceholder
        v-if="canEditProject && showDescriptionPlaceHolder"
        class="unboxed"
        :project="project"
      />
      <DescriptionRecap
        v-else-if="project?.$t?.description"
        class="unboxed"
        :description="project.$t.description"
      />

      <!-- team -->
      <ProjectMemberSection
        v-if="mergedTeam?.length"
        class="unboxed"
        :members="mergedTeam"
        @user-click="openProfileDrawer"
      />

      <!-- locations -->
      <LazyMapRecap v-if="locations.length" class="unboxed" :locations="locations" />

      <!-- goals -->
      <GoalsRecap v-if="filteredGoals.length" class="unboxed" :goals="filteredGoals" />

      <!-- blog -->
      <PublicationRecap
        v-if="blogEntries.length"
        class="unboxed"
        :is-blog="true"
        :publications="blogEntries"
      />

      <!-- resources -->
      <ResourcesRecap
        v-if="linkResources?.length || fileResources?.length"
        class="unboxed"
        :files="fileResources"
        :links="linkResources"
      />

      <!-- linked projects -->
      <LinkedProjectsRecap
        v-if="linkedProjects?.length"
        class="unboxed"
        :linked-projects="linkedProjects"
      />

      <!-- reviews -->
      <ReviewRecap
        v-if="project && project.publication_status"
        class="unboxed"
        :project="project"
        :reviews="reviews"
        @reload-reviews="$emit('reload-reviews')"
        @reload-project="$emit('reload-project')"
      />

      <!-- comments -->
      <PublicationRecap
        v-if="comments.length"
        class="unboxed"
        :is-blog="false"
        :publications="comments"
      />
    </div>
    <BaseDrawer
      no-footer
      :is-opened="profileDrawer.isOpened"
      :title="$t('profile.drawer_title')"
      @close="closeProfileDrawer"
      @confirm="closeProfileDrawer"
    >
      <UserProfileV2
        v-if="profileDrawer.isOpened"
        ref="profile-user"
        :can-edit="false"
        :user-id="profileDrawer.user_id"
        is-preview
      />
    </BaseDrawer>
  </div>
</template>

<script>
export default {
  name: 'ProjectSummaryTab',

  props: {
    project: {
      type: Object,
      default: () => {},
    },

    comments: {
      type: Array,
      default: () => [],
    },

    locations: {
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
    goals: {
      type: Array,
      default: () => [],
    },
    sdgs: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['reload-reviews', 'reload-project'],

  setup() {
    useScrollToTab()
    const { canEditProject } = usePermissions()
    const { translateUser, translateGroup } = useAutoTranslate()
    return { canEditProject, translateUser, translateGroup }
  },

  data() {
    return {
      editDescriptionModalActive: false,
      profileDrawer: {
        isOpened: false,
        user_id: null,
      },
    }
  },

  computed: {
    filteredGoals() {
      return (
        this.goals?.filter(
          (goal) => goal.status && (goal.status === 'complete' || goal.status === 'ongoing')
        ) || []
      )
    },

    mergedTeam() {
      return [
        ...(this.team.owners || []).map((o) => ({
          ...unref(this.translateUser(o)),
          role: 'owners',
        })),
        ...(this.team.reviewers || []).map((o) => ({
          ...unref(this.translateUser(o)),
          role: 'reviewers',
        })),
        ...(this.team.members || []).map((o) => ({
          ...unref(this.translateUser(o)),
          role: 'members',
        })),
        ...(this.team.owner_groups || []).map((o) => ({
          ...unref(this.translateGroup(o)),
          role: 'owner_groups',
        })),
        ...(this.team.reviewer_groups || []).map((o) => ({
          ...unref(this.translateGroup(o)),
          role: 'reviewer_groups',
        })),
        ...(this.team.member_groups || []).map((o) => ({
          ...unref(this.translateGroup(o)),
          role: 'member_groups',
        })),
      ]
    },

    showDescriptionPlaceHolder() {
      return this.project.description.length === 0 || this.project.description === '<p></p>'
    },
  },
  methods: {
    async openProfileDrawer(user) {
      if (this.$filters.isNotGroup(user)) {
        this.profileDrawer.user_id = user.id
        this.profileDrawer.isOpened = true
      } else {
        this.$router.push({ name: 'Group', params: { groupId: user.id } })
      }
    },

    closeProfileDrawer() {
      this.profileDrawer.isOpened = false
      this.profileDrawer.user_id = null
    },
  },
}
</script>

<style lang="scss" scoped>
.project-summary {
  .main-ctn {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }

  .similar-projects {
    margin-top: 80px;
  }
}

.unboxed {
  border: 0 none !important;
  border-radius: 0 !important;
  padding: $space-l 0 !important;
  background: transparent !important;
}

:deep(.unboxed .section-header) {
  justify-content: space-between !important;
}
</style>
