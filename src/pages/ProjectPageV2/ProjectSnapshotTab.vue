<template>
  <div class="project-summary">
    <ProjectHeaderV2 :project="project" class="project-header v2" />

    <ProjectDescriptionPreview v-if="!descripitonEmpty" :project="project" />

    <ProjectMembersPreview v-if="project.modules.members" :project="project" />
    <ProjectGroupsPreview v-if="project.modules.groups" :project="project" />

    <ProjectLocationsPreview v-if="project.modules.locations" :project="project" />

    <ProjectGoalsPreview v-if="project.modules.goals" :project="project" />

    <ProjectBlogEntriesPreview v-if="project.modules.blogs" :project="project" />

    <ProjectLinkedProjectsPreview v-if="project.modules.linked_projects" :project="project" />

    <FetchLoader :status="status" :error="error" only-error skeleton>
      <template v-for="tab in tabs">
        <ProjectTabItemPreview
          v-if="tab.modules.items"
          :key="tab.id"
          :tab="tab"
          :project="project"
        />
      </template>
    </FetchLoader>

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
import ProjectTabItemPreview from '~/components/project/modules/Additionals/ProjectTabItemPreview.vue'
import ProjectCommentsPreview from '@/components/project/modules/Comments/ProjectCommentsPreview.vue'
import ProjectMembersPreview from '~/components/project/modules/Members/ProjectMembersPreview.vue'
import ProjectDescriptionPreview from '@/components/project/modules/ProjectDescriptionPreview.vue'
import ProjectReviewPreview from '~/components/project/modules/review/ProjectReviewPreview.vue'
import ProjectGroupsPreview from '~/components/project/modules/Groups/ProjectGroupsPreview.vue'
import ProjectGoalsPreview from '@/components/project/modules/Goals/ProjectGoalsPreview.vue'
import { projectTabSkeleton } from '~/skeletons/project-tabs.skeletons'
import { getAllProjectTab } from '~/api/v2/project-tabs.service'
import type { TranslatedProject } from '@/models/project.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import useUsersStore from '~/stores/useUsers'
import { textIsEmpty } from '@/functs/string'

const props = defineProps<{
  project: TranslatedProject
}>()

const { isMember, isAdmin } = usePermissions()

const { isConnected } = useUsersStore()

const isMemberOrAdmin = computed(() => isMember.value || isAdmin.value)

const descripitonEmpty = computed(() => textIsEmpty(props.project.$t.description))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  error,
  data: tabs,
} = getAllProjectTab(organizationCode, projectId, {
  query: {
    show_preview: true,
  },
  default: () => factoryPagination(projectTabSkeleton, 0),
  paginationConfig: {
    limit: 100,
  },
})
</script>

<style lang="scss" scoped>
.project-summary {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
