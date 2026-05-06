<template>
  <div>
    <BaseDrawer
      :confirm-action-name="$t('common.save')"
      :confirm-action-disabled="!isValid"
      :is-opened="isOpened"
      :title="form.id ? $t('recruit.edit-announcement') : $t('recruit.add-announcement')"
      class="medium"
      :asyncing="asyncing"
      @close="close"
      @confirm="submit"
    >
      <div class="announcement-form">
        <div class="form-section">
          <label class="label">{{ $t('recruit.type') }}:</label>
          <GroupButton v-model="form.type" :options="typeOptions" />
        </div>

        <div class="form-section">
          <TextInput
            v-model="form.title"
            :label="`${$t('recruit.title')}:`"
            :placeholder="$t('recruit.title')"
            class="form-section"
          />
          <FieldErrors :errors="errors.title" />
        </div>
        <div class="form-section description-section">
          <label class="label">{{ $t('common.description') }}:</label>
          <TipTapEditor v-model="form.description" class="description-field" />

          <FieldErrors :errors="errors.description" />
        </div>

        <DateField v-model="form.deadline" :label="$t('common.deadline')" />
      </div>
    </BaseDrawer>

    <ConfirmModal
      v-if="confirmModalIsOpen"
      :content="$t('common.confirm-close')"
      :title="$t('description.quit-without-saving-title')"
      @cancel="confirmModalIsOpen = false"
      @confirm="confirmClose"
    />
  </div>
</template>

<script setup lang="ts">
import { patchAnnouncement, postAnnouncement } from '~/api/announcements.service'

import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import FieldErrors from '~/components/base/form/FieldErrors.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import DateField from '~/components/base/form/DateField.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useToasterStore from '~/stores/useToaster'

import type { AnnouncementModel, TranslatedAnnouncement } from '~/models/announcement.model'
import { defaultForm, useAnnouncementForm } from '~/form/annoucement'
import type { TranslatedProject } from '~/models/project.model'
import { fullYearDateFormat } from '~/functs/date'
import { textIsEmpty } from '~/functs/string'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    announcement?: TranslatedAnnouncement
    isOpened?: boolean
  }>(),
  {
    announcement: null,
    isOpened: false,
  }
)

const emit = defineEmits<{
  close: []
  reload: []
}>()

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const { isValid, errors, form, v$ } = useAnnouncementForm({ default: defaultForm(), lazy: true })

const confirmModalIsOpen = ref(false)
const asyncing = ref(false)

const typeOptions = computed<
  {
    value: AnnouncementModel['type']
    label: string
  }[]
>(() => [
  {
    value: 'na',
    label: t('common.none'),
  },
  {
    value: 'participant',
    label: t('recruit.participant'),
  },
  {
    value: 'traineeship',
    label: t('recruit.traineeship'),
  },
  {
    value: 'job',
    label: t('recruit.job'),
  },
])

const titleChanged = computed(() => {
  return props.announcement
    ? props.announcement.title !== form.value.title
    : form.value.title !== ''
})

const descriptionChanged = computed(() => {
  return props.announcement
    ? props.announcement.description !== form.value.description
    : !textIsEmpty(form.value.description)
})

watch(
  () => props.isOpened,
  () => {
    form.value = {
      ...defaultForm(),
      ...(props.announcement || {}),
    }
    nextTick(() => v$.value.$reset())
  },
  { immediate: true }
)

const submit = async () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true
  const body = {
    ...form.value,
    deadline: form.value.deadline ? fullYearDateFormat(form.value.deadline) : null,
    description: form.value.description,
    project_id: props.project.id,
  }

  if (body.id) {
    try {
      const result = await patchAnnouncement(props.project.id, body.id, body)

      analytics.announcement.updateAnnouncement({
        project: {
          id: props.project.id,
        },
        announcement: result,
      })

      toaster.pushSuccess(t('toasts.announcement-update.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.announcement-update.error')} (${error})`)
      console.error(error)
    } finally {
      emit('reload')
      asyncing.value = false
      closeNoConfirm()
    }
  } else {
    try {
      const result = await postAnnouncement(props.project.id, body)
      analytics.announcement.addAnnouncement({
        project: {
          id: props.project.id,
        },
        announcement: result,
      })

      toaster.pushSuccess(t('toasts.announcement-create.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.announcement-create.error')} (${error})`)
      console.error(error)
    } finally {
      emit('reload')
      asyncing.value = false
      closeNoConfirm()
    }
  }
}

const toggleConfirmModal = () => {
  if (asyncing.value) return
  confirmModalIsOpen.value = !confirmModalIsOpen.value
}

const close = () => {
  if (descriptionChanged.value || titleChanged.value) {
    toggleConfirmModal()
  } else {
    closeNoConfirm()
  }
}

const closeNoConfirm = () => {
  if (asyncing.value) return
  v$.value.$reset()
  emit('close')
}

const confirmClose = () => {
  if (asyncing.value) return
  toggleConfirmModal()
  closeNoConfirm()
}
</script>

<style lang="scss" scoped>
.announcement-form,
.description-section {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}

.description-field {
  flex-grow: 1;
}

.form-section:not(:first-child) {
  margin-top: $space-l;
}

.label {
  font-size: $font-size-s;
  font-weight: bold;
  margin-bottom: $space-m;
  color: $black;
  margin-right: 1rem;
}
</style>
