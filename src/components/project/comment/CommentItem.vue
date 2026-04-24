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
                {{ $d(new Date(comment.updated_at)) }}
              </span>
              <span v-else>
                {{ $d(new Date(comment.created_at)) }}
              </span>
            </span>
          </div>
        </div>

        <div v-if="editing" class="comment-body skeletons-background">
          <MakeComment
            :project="project"
            :original-comment="comment"
            :replied-comment="repliedComment"
            :is-private="isPrivate"
            @canceled="toggleEdit"
            @submited="toggleEdit"
            @comment-edited="$emit('comment-edited', $event)"
            @project-message-edited="$emit('project-message-posted', $event)"
          />
        </div>
        <TipTapOutput v-else class="comment-content skeletons-text" :content="comment.$t.content" />

        <div class="comment-footer">
          <div v-if="isConnected" class="actions">
            <div class="reply-action skeletons-background">
              <ExternalLabelButton
                v-if="!isReply"
                :label="$t('common.reply')"
                btn-icon="Reply"
                :has-border="true"
                @click="toggleReply"
              />
            </div>

            <div v-if="canEdit" class="author-action skeleton-background">
              <ExternalLabelButton
                v-if="canEdit"
                :label="$t('common.edit')"
                :has-border="true"
                btn-icon="Pen"
                @click="toggleEdit"
              />

              <ExternalLabelButton
                v-if="canEdit"
                :label="$t('common.delete')"
                :has-border="true"
                btn-icon="TrashCanOutline"
                @click="openConfirmModal"
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
            {{ $d(new Date(comment.deleted_at)) }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="replying" class="comment-reply-ctn skeletons-text">
      <MakeComment
        :project="project"
        :replied-comment="comment"
        :is-private="isPrivate"
        @canceled="toggleReply"
        @submited="toggleReply"
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
      v-if="confirmDeleteComment"
      :content="
        isPrivate
          ? $t('comment.private-exchange.delete-description')
          : $t('comment.delete-description')
      "
      :title="isPrivate ? $t('comment.private-exchange.delete-title') : $t('comment.delete-title')"
      :asyncing="isDeleting"
      @cancel="openConfirmModal"
      @confirm="onDeleteComment"
    />
  </div>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import ExternalLabelButton from '@/components/base/button/ExternalLabelButton.vue'
import MakeComment from '@/components/project/comment/MakeComment.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { deleteComment } from '@/api/comments.service'
import { deleteProjectMessage } from '@/api/project-messages.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster'
import useUsersStore from '@/stores/useUsers'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import { TranslatedProject } from '@/models/project.model'
import { TranslatedComment } from '@/models/comment.model'
import { TranslatedProjectMessage } from '@/models/project-message.model'

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

const { t } = useNuxtI18n()

const emit = defineEmits<{
  'comment-posted': [TranslatedComment | TranslatedProjectMessage]
  'project-message-posted': [TranslatedComment | TranslatedProjectMessage]
  'comment-edited': [TranslatedComment | TranslatedProjectMessage]
  'project-message-edited': [TranslatedComment | TranslatedProjectMessage]
  'comment-deleted': [TranslatedComment | TranslatedProjectMessage]
  'project-message-deleted': [TranslatedComment | TranslatedProjectMessage]
}>()
const toaster = useToasterStore()
const usersStore = useUsersStore()
const { isAdmin } = usePermissions()

const replying = ref(false)
const editing = ref(false)
const confirmDeleteComment = ref(false)
const isDeleting = ref(false)

const currentUserId = computed(() => {
  return usersStore.id || null
})

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

const toggleEdit = () => {
  editing.value = !editing.value
}

const toggleReply = () => {
  replying.value = !replying.value
}

const openConfirmModal = () => {
  confirmDeleteComment.value = !confirmDeleteComment.value
}

const onDeleteComment = async () => {
  isDeleting.value = true
  if (props.isPrivate) {
    try {
      await deleteProjectMessage(props.project.id, props.comment.id)

      analytics.projectMessage.deleteProjectMessage({
        project: {
          id: props.project.id,
        },
        projectMessage: props.comment,
      })
      toaster.pushSuccess(t('toasts.project-message-delete.success') /* TODO */)
      emit('project-message-deleted', props.comment)
    } catch (error) {
      toaster.pushError(`${t('toasts.comment-delete.error')} (${error})` /* TODO */)
      console.error(error)
    } finally {
      confirmDeleteComment.value = false
      isDeleting.value = false
    }
  } else {
    try {
      await deleteComment(props.project.id, props.comment.id)
      analytics.comment.deleteComment({
        project: {
          id: props.project.id,
        },
        comment: props.comment,
      })
      toaster.pushSuccess(t('toasts.comment-delete.success'))

      emit('comment-deleted', props.comment)
    } catch (error) {
      toaster.pushError(`${t('toasts.comment-delete.error')} (${error})`)
      console.error(error)
    } finally {
      confirmDeleteComment.value = false
      isDeleting.value = false
    }
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
    border-bottom: $border-width-s solid $primary;

    .comment-meta {
      display: flex;
      align-items: center;
      padding-bottom: $space-l;

      .authorship {
        flex-grow: 1;
        color: $primary-dark;
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
    padding-top: $space-l;

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
