<template>
  <BaseDrawer
    :confirm-action-disabled="!isValid"
    :confirm-action-name="$t('common.save')"
    :is-opened="isOpened"
    :title="review?.id ? $t('project.add-review') : $t('project.edit-review')"
    class="review-drawer medium"
    :asyncing="asyncing"
    @close="onClose"
    @confirm="submit"
  >
    <div class="review-form">
      <div class="review-entry">
        <label>{{ $t('common.title') }}</label>
        <TextInput v-model="form.title" :errors="errors.title" />
      </div>

      <div class="review-entry editor-entry">
        <label>{{ $t('form.description') }}</label>
        <TipTapEditor v-model="form.description" :errors="errors.description" />
      </div>
      <div class="review-entry review-switch">
        <label>{{ $t('project.publish') }}</label>
        <SwitchInput v-model="form.publish" />
      </div>
      <div class="review-entry review-switch">
        <label>{{ $t('project.lock') }}</label>
        <SwitchInput v-model="form.lock" />
      </div>
    </div>
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="$emit('close')"
  />
</template>

<script setup lang="ts">
import { patchReview, postReview } from '~/api/reviews.service'

import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import SwitchInput from '~/components/base/form/SwitchInput.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useToasterStore from '~/stores/useToaster'
import useUsersStore from '~/stores/useUsers'

import type { ReviewForm, ReviewModel, TranslatedReview } from '~/models/review.model'
import type { ProjectForm, TranslatedProject } from '~/models/project.model'
import { defaultProjectReviewForm, useProjectReview } from '~/form/review'
import { patchProject } from '~/api/projects.service'
import { isEqual } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    review?: TranslatedReview
    isOpened?: boolean
  }>(),
  {
    rdata: null,
    isOpened: false,
    review: null,
  }
)

const emit = defineEmits<{
  close: []
  reload: [ReviewModel]
}>()

const usersStore = useUsersStore()

const defaultLocalForm = () => {
  const defaultForm = defaultProjectReviewForm()
  const newForm = { ...defaultForm }

  newForm.project_id = props.project.id
  newForm.lock = props.project.is_locked
  newForm.publish = props.project.publication_status === 'public'

  if (props.review) {
    newForm.title = props.review.title || newForm.title
    newForm.description = props.review.description || newForm.description
    newForm.reviewer_id = props.review.reviewer.id
  } else {
    newForm.reviewer_id = usersStore.id
  }
  return newForm
}

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const asyncing = ref(false)
const { stateModals, closeModals, openModals } = useModals({ saveChange: false })

const { form, isValid, errors, cleanedData, reset } = useProjectReview({ lazy: true })

const isFormEqual = () => isEqual(form.value, defaultLocalForm())

watch(
  () => [props.review, props.isOpened],
  () => reset(defaultLocalForm()),
  { immediate: true }
)

const onSuccess = (body: ReviewForm, review: ReviewModel) => {
  const projectForm: ProjectForm = {
    life_status: 'running',
    is_locked: false,
  }
  if (body.publish) {
    projectForm.publication_status = 'public'
  }
  if (body.lock) {
    projectForm.is_locked = true
    projectForm.life_status = 'completed'
  }

  patchProject(props.project.id, projectForm).then(() => {
    emit('reload', review)
    emit('close')
  })
}

const saveReview = (body: ReviewForm) => {
  return postReview(props.project.id, body)
    .then((review) => {
      toaster.pushSuccess(t('toasts.review-create.success'))
      onSuccess(body, review)
    })
    .catch(() => toaster.pushError(t('toasts.review-create.error')))
}

const updateReview = (body: ReviewForm) => {
  return patchReview(props.project.id, props.review.id, body)
    .then((review) => {
      toaster.pushSuccess(t('toasts.review-create.success'))
      onSuccess(body, review)
    })
    .catch(() => toaster.pushError(t('toasts.review-create.error')))
}

const submit = () => {
  if (!isValid.value) {
    return
  }
  asyncing.value = true

  const body = { ...cleanedData.value }

  if (props.review?.id) {
    updateReview(body).finally(() => (asyncing.value = false))
  } else {
    saveReview(body).finally(() => (asyncing.value = false))
  }
}

const onClose = () => {
  if (isFormEqual()) {
    emit('close')
  } else {
    openModals('saveChange')
  }
}
</script>

<style lang="scss" scoped>
.review-form {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
}

.review-switch {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.review-entry {
  margin-bottom: $space-l;
  text-align: left;
  flex-shrink: 0;
}

.editor-entry {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .editor {
    flex-grow: 1;
  }
}

.review-entry:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  font-size: $font-size-l;
  color: $primary-dark;
  font-weight: bold;
  margin-bottom: $space-s;
  text-align: left;
}
</style>
