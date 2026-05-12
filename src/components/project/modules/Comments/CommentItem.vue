<template>
  <div class="comment-ctn">
    <div v-if="!comment.deleted_at" :class="{ 'is-reply': isReply }" class="comment">
      <div class="comment-picture">
        <CroppedApiImage
          :alt="`${comment.author.given_name} ${comment.author.family_name} image`"
          class="image skeletons-background"
          :picture-data="comment.author.profile_picture"
          picture-size="medium"
          :default-picture="DEFAULT_USER_PATATOID"
        />
      </div>
      <div class="comment-body">
        <div class="comment-meta">
          <div class="authorship">
            <span class="author skeletons-text">
              {{ comment.author.given_name }} {{ comment.author.family_name }}
            </span>
            <span class="separator skeletons-text">&bull;</span>
            <span class="date skeletons-text">
              <span v-if="showEditDate">
                {{ formatDate(comment.updated_at, locale) }}
              </span>
              <span v-else>
                {{ formatDate(comment.created_at, locale) }}
              </span>
            </span>
          </div>
        </div>

        <div v-if="stateModals.edit" class="comment-body skeletons-background">
          <MakeComment
            :project="project"
            :original-comment="comment"
            :replied-comment="repliedComment"
            :is-private="isPrivate"
            @canceled="closeModals('edit')"
            @submited="closeModals('edit')"
            @comment-edited="$emit('comment-edited', $event)"
            @project-message-edited="$emit('project-message-posted', $event)"
          />
        </div>
        <TipTapOutput v-else class="comment-content skeletons-text" :content="comment.$t.content" />

        <div class="comment-footer">
          <div v-if="isConnected" class="actions">
            <div class="reply-action skeletons-background">
              <LpiButton
                v-if="!isReply"
                :label="$t('common.reply')"
                btn-icon="Reply"
                @click="toggleModals('replying')"
              />
            </div>

            <div class="author-action skeletons-background">
              <ContextActionMenuInline
                :can-edit="canEdit"
                :can-delete="canEdit"
                @delete="openModals('delete')"
                @edit="toggleModals('edit')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else :class="{ 'is-reply': isReply }" class="comment deleted">
      <div class="comment-picture skeletons-text">
        <span class="image" />
      </div>
      <div class="comment-body">
        <div class="placeholder">
          <IconImage name="Alert" class="skeletons-background" />
          <span class="skeletons-text">
            {{ isPrivate ? $t('comment.private-exchange.deleted') : $t('comment.deleted') }}
            {{ formatDate(comment.deleted_at, locale) }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="stateModals.replying" class="comment-reply-ctn skeletons-text">
      <MakeComment
        :project="project"
        :replied-comment="comment"
        :is-private="isPrivate"
        @canceled="toggleModals('replying')"
        @submited="toggleModals('replying')"
        @comment-posted="$emit('comment-posted', $event)"
        @project-message-posted="$emit('project-message-posted', $event)"
      />
    </div>
    <div v-if="comment.replies && comment.replies.length" class="comment-replies-ctn">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :is-reply="true"
        :replied-comment="comment"
        :is-private="isPrivate"
        :project="project"
        @comment-posted="$emit('comment-posted', $event)"
        @comment-edited="$emit('comment-edited', $event)"
        @comment-deleted="$emit('comment-deleted', $event)"
        @project-message-posted="$emit('project-message-posted', $event)"
        @project-message-edited="$emit('project-message-posted', $event)"
        @project-message-deleted="$emit('project-message-deleted', $event)"
      />
    </div>

    <ConfirmModal
      v-if="stateModals.delete"
      :content="
        isPrivate
          ? $t('comment.private-exchange.delete-description')
          : $t('comment.delete-description')
      "
      :title="isPrivate ? $t('comment.private-exchange.delete-title') : $t('comment.delete-title')"
      :asyncing="asyncing"
      @cancel="closeModals('delete')"
      @confirm="onDeleteComment"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProjectMessageModel, TranslatedProjectMessage } from '@/models/project-message.model'
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import MakeComment from '~/components/project/modules/Comments/MakeComment.vue'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
import type { CommentModel, TranslatedComment } from '@/models/comment.model'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { deleteProjectMessage } from '@/api/project-messages.service'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import type { TranslatedProject } from '@/models/project.model'
import LpiButton from '~/components/base/button/LpiButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import { deleteComment } from '@/api/comments.service'
import useToasterStore from '@/stores/useToaster'
import useUsersStore from '@/stores/useUsers'
import { formatDate } from '~/functs/date'
import analytics from '@/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    comment: TranslatedComment | TranslatedProjectMessage
    isReply?: boolean
    isPrivate?: boolean
    repliedComment?: TranslatedComment | TranslatedProjectMessage
  }>(),
  {
    isReply: false,
    isPrivate: false,
    repliedComment: null,
  }
)

const { t, locale } = useNuxtI18n()

const emit = defineEmits<{
  'comment-posted': [CommentModel]
  'project-message-posted': [ProjectMessageModel]
  'comment-edited': [CommentModel]
  'project-message-edited': [ProjectMessageModel]
  'comment-deleted': [TranslatedComment | TranslatedProjectMessage]
  'project-message-deleted': [TranslatedComment | TranslatedProjectMessage]
}>()
const toaster = useToasterStore()
const usersStore = useUsersStore()
const { isAdmin } = usePermissions()

const { stateModals, toggleModals, closeModals, openModals } = useModals({
  replying: false,
  delete: false,
  edit: false,
})
const asyncing = ref(false)

const currentUserId = computed(() => usersStore.id || null)

const canEdit = computed(() => {
  return props.comment.author.id === currentUserId.value || isAdmin.value
})

const isConnected = computed(() => usersStore.isConnected)

const showEditDate = computed(() => {
  return (
    new Date(props.comment.updated_at).toLocaleString() !==
    new Date(props.comment.created_at).toLocaleString()
  )
})

const onDeleteComment = async () => {
  asyncing.value = true

  if (props.isPrivate) {
    deleteProjectMessage(props.project.id, props.comment.id)
      .then(() => {
        analytics.projectMessage.deleteProjectMessage({
          project: {
            id: props.project.id,
          },
          projectMessage: props.comment,
        })
        toaster.pushSuccess(t('toasts.project-message-delete.success'))
        emit('project-message-deleted', props.comment)
      })
      .catch(() => toaster.pushError(t('toasts.project-message-delete.error')))
      .finally(() => (asyncing.value = false))
  } else {
    deleteComment(props.project.id, props.comment.id)
      .then(() => {
        analytics.comment.deleteComment({
          project: {
            id: props.project.id,
          },
          comment: props.comment as TranslatedComment,
        })
        toaster.pushSuccess(t('toasts.comment-delete.success'))

        emit('comment-deleted', props.comment)
      })
      .catch(() => toaster.pushError(t('toasts.comment-delete.error')))
      .finally(() => (asyncing.value = false))
  }
}
</script>

<style lang="scss" scoped>
$comment-pic-size: pxToRem(72px);

.comment {
  display: flex;
  align-items: stretch;
  padding: 0;
  padding-top: $space-l;

  .comment-picture {
    flex-shrink: 0;
    padding-right: $space-l;

    .image {
      display: inline-block;
      width: $comment-pic-size;
      height: $comment-pic-size;
      border-radius: 50%;
    }
  }

  .comment-body {
    width: 100%;
    flex-grow: 1;
    padding-bottom: $space-l;
    border-bottom: $border-width-s solid var(--primary);

    .comment-meta {
      display: flex;
      align-items: center;
      padding-bottom: $space-l;

      .authorship {
        flex-grow: 1;
        color: var(--primary-dark);
        font-weight: 700;
        font-size: $font-size-m;

        .separator {
          padding: 0 0.5rem;
        }
      }

      .action {
        flex-shrink: 0;
      }
    }

    .comment-content {
      font-size: $font-size-m;
    }
  }

  .comment-footer {
    padding-top: $space-m;

    .actions {
      display: flex;
      justify-content: space-between;

      .external-btn + .external-btn {
        margin-left: $space-l;
      }
    }
  }

  &.deleted .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      height: 24px;
      width: 24px;
      margin-right: $space-s;
    }
  }
}

.comment-reply-ctn,
.comment-replies-ctn {
  margin: $space-2xs 0 0 #{$comment-pic-size + $space-l};
}
</style>
