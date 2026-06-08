<script setup lang="ts">
import { patchAnnouncement, postAnnouncement } from '~/api/announcements.service'

import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import GroupButton from '~/components/base/button/GroupButton.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import DateField from '~/components/base/form/DateField.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useToasterStore from '~/stores/useToaster'

import type { AnnouncementModel, TranslatedAnnouncement } from '~/models/announcement.model'
import { defaultAnnouncementForm, useAnnouncementForm } from '~/form/annoucement'
import FieldErrors from '~/components/base/form/FieldErrors.vue'
import type { TranslatedProject } from '~/models/project.model'
import { getFirstTextNotEmpty } from '~/functs/string'
import Field from '~/components/base/form/Field.vue'
import { fullYearDateFormat } from '~/functs/date'
import { isEqual } from 'es-toolkit'
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

const defaultLocalForm = () => {
  const newForm = { ...defaultAnnouncementForm() }

  if (props.announcement) {
    newForm.id = props.announcement.id
    newForm.title =
      getFirstTextNotEmpty([props.announcement?.$t.title, props.announcement?.title]) ||
      newForm.title

    newForm.description =
      getFirstTextNotEmpty([props.announcement?.$t.description, props.announcement?.description]) ||
      newForm.description

    newForm.deadline = props.announcement.deadline || props.announcement.deadline
    newForm.type = props.announcement.type || newForm.type
    newForm.is_remunerated = props.announcement.is_remunerated || newForm.is_remunerated
    newForm.status = props.announcement.status || newForm.status
  }

  return newForm
}

const { isValid, errors, form, reset } = useAnnouncementForm({ lazy: true })
const { stateModals, closeModals, openModals } = useModals({ saveChange: false })

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
    label: t('recruit.type.participant.label'),
  },
  {
    value: 'traineeship',
    label: t('recruit.type.traineeship.label'),
  },
  {
    value: 'job',
    label: t('recruit.type.job.label'),
  },
])

const selectedTypeDescription = computed(() => {
  if (form.value.type === 'na') {
    return ''
  }
  return t(`recruit.type.${form.value.type}.description`)
})

const isFormEqual = computed(() => isEqual(form.value, defaultLocalForm()))

watch(
  () => [props.announcement, props.isOpened, props.project],
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)

const close = () => {
  closeModals('saveChange')
  emit('close')
}

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

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
    patchAnnouncement(props.project.id, body.id, body)
      .then((announcement) => {
        analytics.announcement.updateAnnouncement({
          project: {
            id: props.project.id,
          },
          announcement,
        })

        toaster.pushSuccess(t('toasts.announcement-update.success'))
        emit('reload')
        close()
      })
      .catch((error) => {
        toaster.pushError(t('toasts.announcement-update.error'))
        console.error(error)
      })
      .finally(() => (asyncing.value = false))
  } else {
    postAnnouncement(props.project.id, body)
      .then((announcement) => {
        analytics.announcement.addAnnouncement({
          project: {
            id: props.project.id,
          },
          announcement,
        })

        toaster.pushSuccess(t('toasts.announcement-create.success'))
        emit('reload')
        close()
      })
      .catch((error) => {
        toaster.pushError(t('toasts.announcement-create.error'))
        console.error(error)
      })
      .finally(() => (asyncing.value = false))
  }
}
</script>

<template>
  <div>
    <BaseDrawer
      :confirm-action-name="$t('common.save')"
      :confirm-action-disabled="!isValid || isFormEqual"
      :is-opened="isOpened"
      :title="form.id ? $t('recruit.edit-announcement') : $t('recruit.add-announcement')"
      class="medium"
      :asyncing="asyncing"
      @close="checkClose"
      @confirm="submit"
    >
      <div class="list-container">
        <Field :label="$t('recruit.type.title')" required>
          <GroupButton v-model="form.type" :options="typeOptions" />
          <FieldErrors :errors="errors.type" />
          <p v-if="selectedTypeDescription" class="announcement-type">
            <IconImage name="HelpCircle" class="icon" />
            {{ selectedTypeDescription }}
          </p>
        </Field>

        <TextInput
          v-model="form.title"
          required
          :label="$t('recruit.title')"
          :placeholder="$t('recruit.title')"
          :errors="errors.title"
        />
        <Field :label="$t('common.description')" required>
          <TipTapEditor v-model="form.description" :errors="errors.description" class="w-full" />
        </Field>

        <DateField v-model="form.deadline" :label="$t('common.deadline')" />
      </div>
    </BaseDrawer>

    <ConfirmModal
      v-if="stateModals.saveChange"
      :content="$t('common.confirm-close')"
      :title="$t('form.quit-without-saving-title')"
      @cancel="closeModals('saveChange')"
      @confirm="close"
    />
  </div>
</template>

<style lang="scss" scoped>
.announcement-type {
  opacity: 0.7;
  padding: 1rem 0;
}
</style>
