<script setup lang="ts">
import { getProjectComments, getProjectMessages } from '@/api/v2/comments.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import CommentItem from '@/components/project/comment/CommentItem.vue'
import { TranslatedProject } from '@/models/project.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { projectCommentSkeleton } from '@/skeletons/comments.skeletons'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
    isPrivate?: boolean
  }>(),
  {
    preview: false,
    limit: null,
    isPrivate: false,
  }
)

const limitSkeletons = computed(() => maxSkeleton(props.project.modules.comments, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)

const {
  status,
  data: comments,
  pagination,
  refresh,
} = (props.isPrivate ? getProjectMessages : getProjectComments)(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectCommentSkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div>
      <MakeComment v-if="!preview" :project="project" @comment-posted="refresh" />
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :project="project"
        :comment="comment"
        :is-private="isPrivate"
      />
      <EmptyLabel v-if="comments.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
