<template>
  <div class="project-summary">
    <ProjectHeaderV2 :project="project" class="project-header v2" />

    <ProjectDescriptionPreview v-if="!descripitonEmpty" :project="project" />

    <ProjectTeamPreview
      v-if="project.modules.members || project.modules.groups"
      :project="project"
    />

    <ProjectLocationsPreview v-if="project.modules.locations" :project="project" />

    <ProjectGoalsPreview v-if="project.modules.goals" :project="project" />

    <ProjectBlogEntriesPreview v-if="project.modules.blogs" :project="project" />

    <ProjectLinkedProjectsPreview v-if="project.modules.linked_projects" :project="project" />

    <ProjectResourcesPreview
      v-if="project.modules.links || project.modules.files"
      :project="project"
    />

    <ProjectReviewPreview v-if="isConnected && project.modules.reviews" :project="project" />

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
import ProjectDescriptionPreview from '@/components/project/modules/ProjectDescriptionPreview.vue'
import ProjectReviewPreview from '~/components/project/modules/review/ProjectReviewPreview.vue'
import ProjectGoalsPreview from '@/components/project/modules/Goals/ProjectGoalsPreview.vue'
import ProjectTeamPreview from '@/components/project/modules/Teams/ProjectTeamsPreview.vue'
import type { TranslatedProject } from '@/models/project.model'
import useUsersStore from '~/stores/useUsers'
import { textIsEmpty } from '@/functs/string'

const props = defineProps<{
  project: TranslatedProject
}>()

const { isMember, isAdmin } = usePermissions()

const { isConnected } = useUsersStore()

const isMemberOrAdmin = computed(() => isMember.value || isAdmin.value)

const descripitonEmpty = computed(() => textIsEmpty(props.project.$t.description))
</script>

<style lang="scss" scoped>
.project-summary {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
