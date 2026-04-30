<script setup lang="ts">
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { projectLinkedSkeleton } from '@/skeletons/project.skeletons'
import type { TranslatedProject } from '@/models/project.model'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getLinkedProject } from '@/api/v2/project.service'

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
  data: linkedProjects,
  pagination,
} = getLinkedProject(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectLinkedSkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="list-container">
      <LinkedProjects :project="project" :linked-projects="linkedProjects" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
