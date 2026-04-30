<template>
  <div class="project-comments narrow-content">
    <!-- <div class="header">
      <h2 class="title">
        {{ $t('comment.add-comment') }}
      </h2>
    </div> -->

    <MakeComment :project="project" @comment-posted="$emit('reload-comments')" />

    <NoItem v-if="!comments.length" message="comment.no-comments" />

    <div v-else>
      <CommentItem
        v-for="comment in comments"
        :id="comment.id"
        :key="comment.id"
        :comment="comment"
        :project="project"
        @edit-comment="openCommentModal"
        @reply-to-comment="openCommentModal"
        @comment-posted="$emit('reload-comments')"
        @comment-edited="$emit('reload-comments')"
        @comment-deleted="$emit('reload-comments')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'
import type { CommentModel } from '~/models/comment.model'

import MakeComment from '~/components/project/comment/MakeComment.vue'
import CommentItem from '~/components/project/comment/CommentItem.vue'
import NoItem from '~/components/project/comment/NoItem.vue'

defineProps<{
  project: TranslatedProject
  comments: CommentModel[]
}>()

const projectLayoutToggleAddModal = inject<(string, CommentModel) => void>(
  'projectLayoutToggleAddModal'
)

defineEmits<{
  'reload-comments': []
}>()

useScrollToTab()

const openCommentModal = (comment) => {
  projectLayoutToggleAddModal('comment', comment)
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 2rem;

  .title {
    font-size: $font-size-2xl;
    font-weight: 700;
    line-height: 1.25;
  }

  .notice {
    margin-top: 1rem;
    font-size: $font-size-m;
  }
}

.project-comments {
  margin-top: $space-2xl;
  margin-bottom: $space-l;
}
</style>
