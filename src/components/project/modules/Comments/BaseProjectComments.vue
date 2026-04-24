<script setup lang="ts">
import { getProjectComments } from '@/api/v2/comments.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { projectCommentSkeleton } from '@/skeletons/comments.skeletons'

const props = withDefaults(
  defineProps<{ project: TranslatedProject; preview?: boolean; limit?: number }>(),
  {
    preview: false,
    limit: null,
  }
)

const limitSkeletons = computed(() => maxSkeleton(props.project.modules.comments, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: comments,
  pagination,
} = getProjectComments(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectCommentSkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div>
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
      <EmptyLabel v-if="comments.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
