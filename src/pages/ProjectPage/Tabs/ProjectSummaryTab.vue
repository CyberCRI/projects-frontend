<template>
  <div class="project-summary">
    <div class="top">
      <div class="left">
        <DescriptionPlaceholder
          v-if="canEditProject && showDescriptionPlaceHolder"
          :project="project"
        />

        <DescriptionRecap
          v-else-if="project && project.description"
          :description="project.description"
        />

        <GoalsRecap v-if="filteredGoals.length" :goals="filteredGoals" />

        <PublicationRecap v-if="blogEntries.length" :is-blog="true" :publications="blogEntries" />

        <LinkedProjectsRecap v-if="linkedProjects?.length" :linked-projects="linkedProjects" />

        <ReviewRecap
          v-if="project && project.publication_status"
          :project="project"
          :reviews="reviews"
          @reload-reviews="$emit('reload-reviews')"
          @reload-project="$emit('reload-project')"
        />
      </div>

      <div class="right">
        <LazyMapRecap v-if="locations.length" :locations="locations" />

        <ProjectMemberSection
          v-if="mergedTeam?.length"
          :members="mergedTeam"
          @user-click="openProfileDrawer"
        />

        <ResourcesRecap
          v-if="linkResources?.length || fileResources?.length"
          :files="fileResources"
          :links="linkResources"
        />

        <PublicationRecap v-if="comments.length" :is-blog="false" :publications="comments" />
      </div>
    </div>

    <SimilarProjects
      v-if="similarProjects && similarProjects.length"
      id="similar-projects"
      :similar-projects="similarProjects"
      class="similar-projects"
    />

    <BaseDrawer
      no-footer
      :is-opened="profileDrawer.isOpened"
      :title="$t('profile.drawer_title')"
      @close="closeProfileDrawer"
      @confirm="closeProfileDrawer"
    >
      <UserProfile
        v-if="profileDrawer.isOpened"
        ref="profile-user"
        :can-edit="false"
        :user-id="profileDrawer.user_id"
      />
    </BaseDrawer>
  </div>
</template>

<script>
import DescriptionRecap from '@/components/project/description/DescriptionRecap.vue'
import GoalsRecap from '@/components/project/goal/GoalsRecap.vue'
import PublicationRecap from '@/components/project/blog/PublicationRecap.vue'
import LinkedProjectsRecap from '@/components/project/linked-project/LinkedProjectsRecap.vue'
import { LazyMapRecap } from '#components'
import ResourcesRecap from '@/components/project/resource/ResourcesRecap.vue'
import ReviewRecap from '@/components/project/review/ReviewRecap.vue'
import SimilarProjects from '@/components/project/SimilarProjects.vue'
import ProjectMemberSection from '@/components/group/ProjectMemberSection/ProjectMemberSection.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserProfile from '@/components/people/UserProfile.vue'
import DescriptionPlaceholder from '@/components/project/description/DescriptionPlaceholder.vue'

export default {
  name: 'ProjectSummaryTab',

  components: {
    DescriptionPlaceholder,
    DescriptionRecap,
    GoalsRecap,
    PublicationRecap,
    LinkedProjectsRecap,
    LazyMapRecap,
    ResourcesRecap,
    ReviewRecap,
    SimilarProjects,
    ProjectMemberSection,
    UserProfile,
    BaseDrawer,
  },

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
  },

  emits: ['reload-reviews', 'reload-project'],

  setup() {
    useScrollToTab()
    const { canEditProject } = usePermissions()
    return { canEditProject }
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
        ...(this.team.owners || []).map((o) => ({ ...o, role: 'owners' })),
        ...(this.team.reviewers || []).map((o) => ({ ...o, role: 'reviewers' })),
        ...(this.team.members || []).map((o) => ({ ...o, role: 'members' })),
        ...(this.team.owner_groups || []).map((o) => ({ ...o, role: 'owner_groups' })),
        ...(this.team.reviewer_groups || []).map((o) => ({
          ...o,
          role: 'reviewer_groups',
        })),
        ...(this.team.member_groups || []).map((o) => ({ ...o, role: 'member_groups' })),
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
  padding: $space-2xl 0;

  .top {
    display: flex;

    .left {
      margin-right: $space-xl;
      width: calc(66.66% - $space-xl);
    }

    .right {
      width: calc(33.34% - $space-xl);
      flex-grow: 1;
    }

    > div > div:not(:first-of-type) {
      margin-top: $space-xl;
    }
  }

  .similar-projects {
    margin-top: 80px;
  }
}

@media screen and (max-width: $max-tablet) {
  .project-summary .top {
    flex-direction: column;

    .left,
    .right {
      width: 100%;
    }

    .left {
      margin-right: 0;
      margin-bottom: $space-l;
    }
  }
}

@media screen and (max-width: $min-tablet) {
  .project-summary {
    padding: $space-2xl $space-s;
  }
}
</style>
