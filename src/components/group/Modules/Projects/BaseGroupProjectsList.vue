<template>
  <FetchLoader :status="status" only-error skeleton>
    <ul class="project-list list-divider">
      <li v-for="project in data" :key="project.id">
        <ProjectPreview :project="project" />
      </li>
    </ul>
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupProject } from '@/api/v2/group.service'
import ProjectPreview from '@/components/project/ProjectPreview.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { maxSkeleton, toPagination } from '@/skeletons/base.skeletons'
import { projectSkeleton } from '@/skeletons/project.skeletons'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
  }>(),
  { limit: null }
)

const limitSkeletons = computed(() =>
  maxSkeleton(props.group?.modules?.featured_projects, props.limit)
)
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const { status, data } = getGroupProject(organizationCode, groupId, {
  paginationConfig: { limit: props.limit },
  default: () => toPagination(projectSkeleton, limitSkeletons.value),
})
</script>
