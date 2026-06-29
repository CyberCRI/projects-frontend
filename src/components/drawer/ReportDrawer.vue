<script setup lang="ts">
import { reportAbuse, reportBug } from '~/api/report.service'

import TextInput from '~/components/base/form/TextInput.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import { defaultReportForm, useReportForm } from '~/form/report'
import useToasterStore from '~/stores/useToaster'
import { cropIfTooLong } from '~/functs/string'
import useUsersStore from '~/stores/useUsers'
import { isEqual } from 'es-toolkit'

const props = withDefaults(defineProps<{ type: 'abuse' | 'bug'; isOpened?: boolean }>(), {
  isOpened: false,
})

const emit = defineEmits<{ close: [] }>()

const toaster = useToasterStore()
const { t } = useNuxtI18n()

const usersStore = useUsersStore()

const { stateModals, closeModals, openModals, closeAllModals } = useModals({ saveChange: false })
const { form, isValid, errors, cleanedData, reset } = useReportForm({ lazy: true })
// auto add title from message content
watchEffect(() => {
  form.value.title = cropIfTooLong(form.value.message, 10)
})
const isLoading = ref(false)

const close = () => {
  closeAllModals()
  emit('close')
}

const organizationCode = useOrganizationCode()

const defaultLocalForm = () => ({
  ...defaultReportForm(),
  // default urls
  url: useRequestURL().toString(),
  // add default url from user if user is connected
  reported_by: usersStore.user?.email || '',
})

const isFormEqual = computed(() => isEqual(form.value, defaultLocalForm()))

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

watch(
  () => props.isOpened,
  () => reset(defaultLocalForm()),
  { immediate: true }
)

const submit = async () => {
  if (!isValid.value) {
    return
  }
  isLoading.value = true

  const body = { ...cleanedData.value }

  if (props.type === 'abuse') {
    reportAbuse(organizationCode, body)
      .then(() => {
        toaster.pushSuccess(t('toasts.abuse-report.success'))
        close()
      })
      .catch(() => toaster.pushError(t('toasts.abuse-report.error')))
      .finally(() => (isLoading.value = false))
  } else if (props.type === 'bug') {
    reportBug(organizationCode, body)
      .then(() => {
        toaster.pushSuccess(t('toasts.bug-report.success'))
        close()
      })
      .catch(() => toaster.pushError(t('toasts.bug-report.error')))
      .finally(() => (isLoading.value = false))
  }
}
</script>

<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="$t(`report.${type}`)"
    class="medium"
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="!isValid || isFormEqual"
    :asyncing="isLoading"
    @close="checkClose"
    @confirm="submit"
  >
    <form class="list-container">
      <TextInput
        v-model="form.reported_by"
        class="text-input"
        data-test="report-email"
        :label="$t('form.email-contact')"
        required
        :errors="errors.reported_by"
      />
      <TextInput
        v-model="form.url"
        class="text-input"
        data-test="report-url"
        :errors="errors.url"
        :label="$t('form.url')"
        :help="$t(`report.${type}-url`)"
        required
      />

      <!-- we hide title (no needed) -->
      <!-- <Field :label="$t('form.title')" :help="$t(`report.${type}-title`)" required>
          <TextInput
            v-model="form.title"
            class="text-input"
            data-test="report-title"
            :errors="errors.title"
          />
        </Field> -->

      <TextInput
        v-model="form.message"
        class="text-input-test"
        input-type="textarea"
        :rows="10"
        data-test="report-description"
        :label="$t('form.description')"
        :help="$t(`report.${type}-text`)"
        required
        :errors="errors.message"
      />
      <Recaptcha />
    </form>

    <ConfirmModal
      v-if="stateModals.saveChange"
      :title="$t('form.quit-without-saving-title')"
      :content="$t('common.confirm-close')"
      @cancel="closeModals('saveChange')"
      @confirm="close"
    />
  </BaseDrawer>
</template>
