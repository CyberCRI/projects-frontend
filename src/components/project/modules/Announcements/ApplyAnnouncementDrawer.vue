<script setup lang="ts">
import { applyAnnouncement } from '~/api/announcements.service'

import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import useToasterStore from '~/stores/useToaster'

import { defaultAnnouncementReplyForm, useAnnouncementReplyForm } from '~/form/annoucement'
import type { TranslatedAnnouncement } from '~/models/announcement.model'
import type { TranslatedProject } from '~/models/project.model'
import Recaptcha from '~/components/base/form/Recaptcha.vue'
import Field from '~/components/base/form/Field.vue'
import useUsersStore from '~/stores/useUsers'
import { isEqual, omit } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    project: TranslatedProject
    announcement?: TranslatedAnnouncement
  }>(),
  {
    isOpened: false,
    announcement: null,
  }
)

const emit = defineEmits<{
  close: []
}>()

const { t } = useNuxtI18n()

const { stateModals, openModals, closeModals, closeAllModals } = useModals({
  saveChange: false,
})

const userStore = useUsersStore()

const recapchaKey = ref(useUniqueId())
const asyncing = ref(false)
const toaster = useToasterStore()

const defaultLocalForm = () => {
  const newForm = defaultAnnouncementReplyForm()
  if (props.project) {
    newForm.project_id = props.project.id
  }

  if (props.announcement) {
    newForm.project_id = props.announcement.project?.id || newForm.project_id
    newForm.announcement_id = props.announcement.id
  }

  // pre add info user
  if (userStore.user) {
    newForm.applicant_firstname = userStore.user.family_name
    newForm.applicant_name = userStore.user.given_name
    newForm.applicant_email = userStore.user.email
  }

  return newForm
}

const { form, errors, isValid, cleanedData, reset } = useAnnouncementReplyForm({ lazy: true })

watch(
  () => [props.isOpened, props.announcement, props.project],
  () => {
    reset(defaultLocalForm())
    recapchaKey.value = useUniqueId()
  },
  { immediate: true, deep: true }
)

const close = () => {
  closeAllModals()
  emit('close')
}

const isFormEqual = computed(() =>
  isEqual(omit(form.value, ['recaptcha']), omit(defaultLocalForm(), ['recaptcha']))
)

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

const onApplyAnnouncement = () => {
  if (!isValid.value) {
    return
  }

  asyncing.value = true
  const body = { ...cleanedData.value }

  return applyAnnouncement(props.project.id, props.announcement.id, body)
    .then(() => {
      toaster.pushSuccess(t('project.apply-succes'))
      close()
    })
    .catch(() => toaster.pushSuccess(t('project.apply-error')))
    .finally(() => (asyncing.value = false))
}
</script>

<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="$t('project.announcements')"
    :confirm-action-name="$t('recruit.apply')"
    :confirm-action-disabled="!isValid || isFormEqual"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="onApplyAnnouncement"
  >
    <div class="list-container">
      <TextInput
        v-model="form.applicant_firstname"
        :label="$t('recruit.firstname')"
        required
        :errors="errors.applicant_firstname"
      />

      <TextInput
        v-model="form.applicant_name"
        :label="$t('recruit.lastname')"
        required
        :errors="errors.applicant_name"
      />

      <TextInput
        v-model="form.applicant_email"
        input-type="email"
        :label="$t('form.email')"
        required
        :errors="errors.applicant_email"
      />

      <Field :label="$t('recruit.about-you')">
        <TipTapEditor
          v-model="form.applicant_message"
          class="w-full"
          name="motivation"
          :errors="errors.applicant_message"
        />
      </Field>

      <Recaptcha v-model="form.recaptcha" :recapcha-key="recapchaKey" />
    </div>

    <!-- drawer/modal -->
    <ConfirmModal
      v-if="stateModals.saveChange"
      :title="$t('form.quit-without-saving-title')"
      :content="$t('common.confirm-close')"
      @cancel="closeModals('saveChange')"
      @confirm="close"
    />
  </BaseDrawer>
</template>

<style lang="scss" scoped>
.reply-to {
  margin-bottom: $space-m;
  text-align: center;
  font-size: $font-size-l;
}
</style>
