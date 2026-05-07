<script setup lang="ts">
import { getProjectComments, getProjectMessages } from '@/api/v2/comments.service'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import { projectCommentSkeleton } from '@/skeletons/comments.skeletons'
import CommentItem from '@/components/project/comment/CommentItem.vue'
import type FetchLoader from '@/components/base/FetchLoader.vue'
import type { TranslatedProject } from '@/models/project.model'

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

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div>
      <MakeComment
        v-if="!preview"
        :project="project"
        :is-private="isPrivate"
        @comment-posted="fullRefresh"
        @project-message-posted="fullRefresh"
        @comment-edited="refresh"
        @project-message-edited="refresh"
      />
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
