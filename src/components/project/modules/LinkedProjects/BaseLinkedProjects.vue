<script setup lang="ts">
import { getLinkedProject } from '@/api/v2/project.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { projectSkeleton } from '@/skeletons/project.skeletons'

const props = withDefaults(
  defineProps<{ project: TranslatedProject; preview?: boolean; limit?: number }>(),
  {
    preview: false,
    limit: null,
  }
)

const limitSkeletons = computed(() =>
  maxSkeleton(props.project.modules.linked_projects, props.limit)
)

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: projects,
  pagination,
} = getLinkedProject(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectSkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="list-container">
      <LinkedProjects :project="project" :linked-projects="projects" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
