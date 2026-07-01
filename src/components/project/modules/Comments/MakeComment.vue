<template>
  <div class="make-comment skeletons-background">
    <div v-if="usersStore.isConnected">
      <TipTapEditor
        v-model="form.content"
        :errors="errors.content"
        :save-image-callback="saveCommentImage"
        class="comment-description"
        mode="full"
        @image="addImage"
      />

      <div class="action">
        <LpiButton :label="$t('common.cancel')" :secondary="true" @click="emit('canceled')" />
        <LpiButton
          :disabled="!canSubmitComment || asyncing || !isValid || isFormEqual"
          :btn-icon="asyncing ? 'LoaderSimple' : null"
          :label="isPrivate ? $t('comment.private-exchange.send') : $t('comment.publish')"
          @click="submit"
        />
      </div>
    </div>
    <div v-else class="no-account">
      <div>{{ $t('comment.need-account') }}</div>
      <div>
        <LpiButton :label="$t('common.login')" @click="goToKeycloakLoginPage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="GenericComment extends ProjectMessageModel | CommentModel">
import {
  patchProjectMessage,
  postProjectMessage,
  postProjectMessageImage,
} from '~/api/project-messages.service'
import { patchComment, postComment, postCommentImage } from '~/api/comments.service'
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'

import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'

import LpiButton from '~/components/base/button/LpiButton.vue'

import useToasterStore from '~/stores/useToaster'
import useUsersStore from '~/stores/useUsers'

import { defaultProjectMessageForm, useProjectMessageForm } from '~/form/messages'
import type { ProjectMessageModel } from '~/models/project-message.model'
import { useBlockNavigation } from '~/composables/useBlockNavigation'
import type { TranslatedProject } from '~/models/project.model'
import type { CommentModel } from '~/models/comment.model'
import type { ImageModel } from '~/models/image.model'
import { getFirstTextNotEmpty } from '~/functs/tiptap'
import { formEqual } from '~/form/base'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    repliedComment?: GenericComment
    originalComment?: GenericComment
    isPrivate?: boolean
  }>(),
  {
    repliedComment: null,
    originalComment: null,
    isPrivate: false,
  }
)

const emit = defineEmits<{
  submited: []
  canceled: []
  'comment-posted': [CommentModel]
  'project-message-posted': [ProjectMessageModel]
  'comment-edited': [CommentModel]
  'project-message-edited': [ProjectMessageModel]
}>()

const toaster = useToasterStore()
const usersStore = useUsersStore()
const { canCreateComments } = usePermissions()

const { t } = useNuxtI18n()

const defaultLocalForm = () => {
  const newForm = defaultProjectMessageForm()

  newForm.project_id = props.project.id

  if (props.repliedComment) {
    newForm.reply_on = newForm.reply_on_id = props.repliedComment.id
  }

  newForm.content =
    getFirstTextNotEmpty([
      props.originalComment?.content,
      props.project.template?.$t?.comment_content,
      props.project.template?.comment_content,
    ]) || newForm.content

  return newForm
}

const asyncing = ref(false)

const { form, isValid, errors, reset } = useProjectMessageForm({ default: defaultLocalForm() })
watch(
  () => [props.project, props.originalComment, props.repliedComment],
  () => reset(defaultLocalForm()),
  {
    immediate: true,
    deep: true,
  }
)
const isFormEqual = useBlockNavigation(() =>
  formEqual(form.value, defaultLocalForm(), {
    html: ['content'],
  })
)
const canSubmitComment = computed(() => !isFormEqual.value && canCreateComments.value)

const scrollToNewComment = (comment) => {
  document.getElementById(comment.id)?.scrollIntoView({
    behavior: 'smooth',
  })
}

const addImage = (image: ImageModel) => form.value.images_ids.push(image.id)

const submit = async () => {
  if (props.originalComment) {
    await updateComment().then(() => emit('submited'))
  } else {
    await createComment().then(() => emit('submited'))
  }
}

const createComment = () => {
  asyncing.value = true

  if (props.isPrivate) {
    return postProjectMessage(props.project.id, form.value)
      .then((message) => {
        analytics.projectMessage.projectMessage({
          project: { id: props.project.id },
          projectMessage: message,
        })
        toaster.pushSuccess(t('toasts.project-message-create.success'))
        emit('project-message-posted', message)
        nextTick(() => scrollToNewComment(message))
      })
      .catch(() => toaster.pushError(t('toasts.project-message-create.error')))
      .finally(() => (asyncing.value = false))
  } else {
    return postComment(props.project.id, form.value)
      .then((comment) => {
        analytics.comment.comment({
          project: { id: props.project.id },
          comment,
        })
        toaster.pushSuccess(t('toasts.comment-create.success'))
        emit('comment-posted', comment)
        nextTick(() => scrollToNewComment(comment))
      })
      .catch(() => toaster.pushError(t('toasts.comment-create.error')))
      .finally(() => (asyncing.value = false))
  }
}

const updateComment = async () => {
  asyncing.value = true

  if (props.isPrivate) {
    return patchProjectMessage(props.project.id, props.originalComment.id, form.value)
      .then((message) => {
        analytics.projectMessage.updateProjectMessage({
          project: { id: props.project.id },
          projectMessage: message,
        })
        toaster.pushSuccess(t('toasts.project-message-update.success'))
        emit('project-message-edited', message)
      })
      .catch(() => toaster.pushError(t('toasts.project-message-update.error')))
      .finally(() => (asyncing.value = false))
  } else {
    return patchComment(props.project.id, props.originalComment.id, form.value)
      .then((message) => {
        analytics.projectMessage.updateProjectMessage({
          project: { id: props.project.id },
          projectMessage: message,
        })
        toaster.pushSuccess(t('toasts.comment-update.success'))
        emit('comment-edited', message)
      })
      .catch(() => toaster.pushError(t('toasts.comment-update.error')))
      .finally(() => (asyncing.value = false))
  }
}

// Methods
const saveCommentImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file, file.name)

  if (props.isPrivate) {
    return postProjectMessageImage(props.project.id, formData)
  } else {
    return postCommentImage(props.project.id, formData)
  }
}
</script>

<style lang="scss" scoped>
.make-comment {
  .action {
    display: flex;
    gap: $space-m;
    justify-content: flex-end;
    margin-top: $space-m;
  }

  .no-account {
    background-color: $almost-white;
    padding: $space-m;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.comment-description :deep(.editor-content) {
  max-height: 60vh;
}
</style>
