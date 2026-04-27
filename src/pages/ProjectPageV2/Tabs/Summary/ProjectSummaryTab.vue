<template>
  <div class="project-summary">
    <div class="main-ctn">
      <ProjectHeaderV2 :project="project" class="project-header v2" />

      <ProjectDescriptionPreview v-if="!descripitonEmpty" :project="project" />

      <ProjectMembersPreview :project="project" />

      <ProjectLocationsPreview :project="project" />

      <ProjectGoalsPreview :project="project" />

      <ProjectBlogEntriesPreview :project="project" />

      <ProjectLinkedProjectsPreview :project="project" />

      <ProjectResourcesPreview :project="project" />

      <ProjectReviewPreview v-if="project.publication_status || true" :project="project" />

      <ProjectAnnouncementsPreview :project="project" />

      <ProjectCommentsPreview :project="project" />

      <ProjectPrivateExchangePreview :project="project" />

      <!--
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
    </BaseDrawer> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectAnnouncementsPreview from '@/components/project/modules/Announcements/ProjectAnnouncementsPreview.vue'
import ProjectBlogEntriesPreview from '@/components/project/modules/BlogEntries/ProjectBlogEntriesPreview.vue'
import ProjectCommentsPreview from '@/components/project/modules/Comments/ProjectCommentsPreview.vue'
import ProjectGoalsPreview from '@/components/project/modules/Goals/ProjectGoalsPreview.vue'
import ProjectLinkedProjectsPreview from '@/components/project/modules/LinkedProjects/ProjectLinkedProjectsPreview.vue'
import ProjectLocationsPreview from '@/components/project/modules/Locations/ProjectLocationsPreview.vue'
import ProjectMembersPreview from '@/components/project/modules/Members/ProjectMembersPreview.vue'
import ProjectPrivateExchangePreview from '@/components/project/modules/PrivateExchange/ProjectPrivateExchangePreview.vue'
import ProjectDescriptionPreview from '@/components/project/modules/ProjectDescriptionPreview.vue'
import ProjectResourcesPreview from '@/components/project/modules/Resources/ProjectResourcesPreview.vue'
import ProjectReviewPreview from '@/components/project/review/ProjectReviewPreview.vue'
import { textIsEmpty } from '@/functs/string'
import { TranslatedProject } from '@/models/project.model'

const props = defineProps<{
  project: TranslatedProject
}>()

// const router = useRouter()

const descripitonEmpty = computed(() => textIsEmpty(props.project.$t.description))
// useScrollToTab()
// const { translateUser, translateGroup } = useAutoTranslate()
// const profileDrawer = ref({
//   isOpened: false,
//   user_id: null,
// })

// const filteredGoals = computed(() => {
//   return (
//     props.goals?.filter(
//       (goal) => goal.status && (goal.status === 'complete' || goal.status === 'ongoing')
//     ) || []
//   )
// })

// const mergedTeam = computed(() => {
//   return [
//     ...(props.team.owners || []).map((o) => ({
//       ...unref(translateUser(o)),
//       role: 'owners',
//     })),
//     ...(props.team.reviewers || []).map((o) => ({
//       ...unref(translateUser(o)),
//       role: 'reviewers',
//     })),
//     ...(props.team.members || []).map((o) => ({
//       ...unref(translateUser(o)),
//       role: 'members',
//     })),
//     ...(props.team.owner_groups || []).map((o) => ({
//       ...unref(translateGroup(o)),
//       role: 'owner_groups',
//     })),
//     ...(props.team.reviewer_groups || []).map((o) => ({
//       ...unref(translateGroup(o)),
//       role: 'reviewer_groups',
//     })),
//     ...(props.team.member_groups || []).map((o) => ({
//       ...unref(translateGroup(o)),
//       role: 'member_groups',
//     })),
//   ]
// })
// }
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
