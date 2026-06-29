<template>
  <BaseDrawer
    :is-opened="isOpened"
    class="medium"
    :confirm-action-name="$t('common.send')"
    :confirm-action-disabled="!isValid"
    :title="$t('footer.contact')"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="submit"
  >
    <form class="list-container">
      <h3 class="sub-title">
        {{ $t('form.contact.subtitle') }}
      </h3>

      <TextInput
        v-model="form.subject"
        class="text-input"
        data-test="contact-subject"
        :placeholder="$t('form.contact.subject-placeholder')"
        :label="$t('form.contact.subject')"
        required
        :errors="errors.subject"
      />

      <TextInput
        v-model="form.email"
        class="text-input"
        data-test="contact-email"
        :placeholder="$t('form.contact.email-placeholder')"
        :label="$t('form.contact.email')"
        required
        :errors="errors.email"
      />

      <TextInput
        v-model="form.content"
        required
        :rows="10"
        input-type="textarea"
        class="text-input"
        data-test="contact-content"
        :placeholder="$t('form.contact.content-placeholder')"
        :label="$t('form.contact.content')"
        :errors="errors.content"
      />

      <Recaptcha />
    </form>
  </BaseDrawer>
  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close()"
  />
</template>

<script setup lang="ts">
import { defaultContactForm, useContactForm } from '@/form/contact'
import useToasterStore from '@/stores/useToaster'
import { contactUs } from '@/api/report.service'

import TextInput from '~/components/base/form/TextInput.vue'
import Recaptcha from '~/components/base/form/Recaptcha.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import useUsersStore from '~/stores/useUsers'
import { isEqual } from 'es-toolkit'

const props = defineProps<{ isOpened: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { t } = useNuxtI18n()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()
const userStore = useUsersStore()

const defaultLocalForm = () => {
  const newForm = defaultContactForm()

  // add users logged email
  if (userStore.user) {
    newForm.email = userStore.user.email
  }

  return newForm
}

const { form, isValid, reset, errors, cleanedData } = useContactForm({
  default: defaultLocalForm(),
})
watch(
  () => props.isOpened,
  () => reset(defaultLocalForm()),
  { immediate: true }
)

const { stateModals, closeModals, openModals, closeAllModals } = useModals({ saveChange: false })

const isFormEqual = computed(() => isEqual(form.value, defaultLocalForm()))

const close = () => {
  closeAllModals()
  emit('close')
}

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

const asyncing = ref(false)
const submit = () => {
  asyncing.value = true
  return contactUs(organizationCode, cleanedData.value)
    .then(() => {
      toaster.pushSuccess(t('toasts.contact.success'))
      close()
    })
    .catch((error) => {
      toaster.pushError(t('toasts.contact.error'))
      console.error(error)
    })
    .finally(() => (asyncing.value = false))
}
</script>
