<template>
  <BaseDrawer
    :custom-style="customNotificationStyle"
    :is-opened="isOpened"
    class="medium"
    :confirm-action-name="$t('common.send')"
    :confirm-action-disabled="v$.$invalid"
    :title="$t('footer.contact')"
    :asyncing="isLoading"
    @close="$emit('close')"
    @confirm="submit"
  >
    <form class="form">
      <h3 class="sub-title">
        {{ $t('form.contact.subtitle') }}
      </h3>
      <div class="form-input">
        <h4 class="title">
          {{ $t('form.contact.subject') }}
        </h4>
        <TextInput
          v-model="form.subject"
          class="text-input"
          data-test="contact-subject"
          :placeholder="$t('form.contact.subject-placeholder')"
          @blur="v$.form.subject.$validate"
        />

        <FieldErrors :errors="v$.form.subject.$errors" />
      </div>

      <div class="form-input">
        <h4 class="title">
          {{ $t('form.contact.email') }}
        </h4>
        <TextInput
          v-model="form.email"
          class="text-input"
          data-test="contact-email"
          :placeholder="$t('form.contact.email-placeholder')"
          @blur="v$.form.email.$validate"
        />
        <FieldErrors :errors="v$.form.email.$errors" />
      </div>

      <div class="form-input">
        <h4 class="title">
          {{ $t('form.contact.content') }}
        </h4>
        <TextInput
          v-model="form.content"
          rows="10"
          input-type="textarea"
          class="text-input"
          data-test="contact-content"
          :placeholder="$t('form.contact.content-placeholder')"
          @blur="v$.form.content.$validate"
        />
        <FieldErrors :errors="v$.form.content.$errors" />
      </div>
    </form>
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { contactUs } from '@/api/report.service'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'

const defaultForm = () => {
  return {
    subject: '',
    email: '',
    content: '',
  }
}

const props = defineProps<{ isOpened: boolean }>()
const emit = defineEmits<{ close: [] }>()

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const { t } = useNuxtI18n()
const rules = computed(() => ({
  subject: {
    required: helpers.withMessage(t('form.report.message'), required),
  },
  email: {
    required: helpers.withMessage(t('form.report.email.required'), required),
    email: helpers.withMessage(t('form.report.email.format'), email),
  },
  content: {
    required: helpers.withMessage(t('form.report.content'), required),
  },
}))
const form = ref(defaultForm())
const v$ = useValidate(rules, form)
const isLoading = ref(false)
const customNotificationStyle = {
  maxHeight: 'unset',
  padding: 'unset',
}
const orgCode = computed(() => organizationsStore?.current?.code)

watch(
  () => props.isOpened,
  () => {
    v$.value.$reset()
    form.value = defaultForm()
  }
)

const submit = async () => {
  const isValid = await v$.value.$validate()

  if (isValid) {
    isLoading.value = true

    try {
      await contactUs(orgCode.value, form.value)
      toaster.pushSuccess(t('toasts.contact.success'))
    } catch (error) {
      toaster.pushError(`${t('toasts.contact.error')} (${error})`)
      console.error(error)
    } finally {
      isLoading.value = false
      emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  padding: 0 1.5rem;

  .title {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: bold;
    margin: $space-m 0;
  }

  .sub-title {
    font-size: $font-size-s;
    margin: $space-l 0;
  }

  .save-button {
    margin: $space-l 0;
  }

  .form-input {
    margin-bottom: $space-l;
  }
}
</style>
