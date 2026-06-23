<script setup lang="ts">
import { getProjectComments, getProjectMessages } from '@/api/v2/comments.service'
import EmptyComment from '~/components/project/modules/Comments/EmptyComment.vue'
import CommentItem from '~/components/project/modules/Comments/CommentItem.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import { projectCommentSkeleton } from '@/skeletons/comments.skeletons'
import type FetchLoader from '@/components/base/FetchLoader.vue'
import type { TranslatedProject } from '@/models/project.model'
import { throttle } from 'es-toolkit'

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

const throttleRefresh = throttle(() => refresh(), 100)

const throttlefullRefresh = throttle(() => {
  refreshProjectData(props.project).then(() => throttleRefresh())
}, 100)
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div>
      <MakeComment
        v-if="!preview"
        :project="project"
        :is-private="isPrivate"
        @comment-posted="throttlefullRefresh"
        @project-message-posted="throttlefullRefresh"
        @comment-edited="throttleRefresh"
        @project-message-edited="throttleRefresh"
      />
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :project="project"
        :comment="comment"
        :is-private="isPrivate"
        @project-message-posted="throttlefullRefresh"
        @project-message-edited="throttleRefresh"
        @project-message-deleted="throttlefullRefresh"
        @comment-posted="throttlefullRefresh"
        @comment-edited="throttleRefresh"
        @comment-deleted="throttlefullRefresh"
      />
      <EmptyComment v-if="comments.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>
</template>
