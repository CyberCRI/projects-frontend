<template>
  <div class="project-summary">
    <ProjectHeaderV2 :project="project" class="project-header v2" />

    <ProjectDescriptionPreview v-if="!descripitonEmpty" :project="project" />

    <ProjectMembersPreview v-if="project.modules.members" :project="project" />

    <ProjectLocationsPreview v-if="project.modules.locations" :project="project" />

    <ProjectGoalsPreview v-if="project.modules.goals" :project="project" />

    <ProjectBlogEntriesPreview v-if="project.modules.blogs" :project="project" />

    <ProjectLinkedProjectsPreview v-if="project.modules.linked_projects" :project="project" />

    <ProjectResourcesPreview
      v-if="project.modules.links || project.modules.files"
      :project="project"
    />

    <ProjectReviewPreview v-if="project.modules.reviews" :project="project" />

    <ProjectAnnouncementsPreview v-if="project.modules.announcements" :project="project" />

    <ProjectCommentsPreview v-if="project.modules.comments" :project="project" />

    <ProjectPrivateExchangePreview
      v-if="project.modules.messages && isMemberOrAdmin"
      :project="project"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectPrivateExchangePreview from '@/components/project/modules/PrivateExchange/ProjectPrivateExchangePreview.vue'
import ProjectLinkedProjectsPreview from '@/components/project/modules/LinkedProjects/ProjectLinkedProjectsPreview.vue'
import ProjectAnnouncementsPreview from '@/components/project/modules/Announcements/ProjectAnnouncementsPreview.vue'
import ProjectBlogEntriesPreview from '@/components/project/modules/BlogEntries/ProjectBlogEntriesPreview.vue'
import ProjectResourcesPreview from '@/components/project/modules/Resources/ProjectResourcesPreview.vue'
import ProjectLocationsPreview from '@/components/project/modules/Locations/ProjectLocationsPreview.vue'
import ProjectCommentsPreview from '@/components/project/modules/Comments/ProjectCommentsPreview.vue'
import ProjectMembersPreview from '@/components/project/modules/Members/ProjectMembersPreview.vue'
import ProjectDescriptionPreview from '@/components/project/modules/ProjectDescriptionPreview.vue'
import ProjectGoalsPreview from '@/components/project/modules/Goals/ProjectGoalsPreview.vue'
import ProjectReviewPreview from '@/components/project/review/ProjectReviewPreview.vue'
import type { TranslatedProject } from '@/models/project.model'
import { textIsEmpty } from '@/functs/string'

const props = defineProps<{
  project: TranslatedProject
}>()

// const router = useRouter()

const isMemberOrAdmin = computed(() => false)

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
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
