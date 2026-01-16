<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="type ? $t(`report.${type}`) : ''"
    class="report-form medium"
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="v$.$invalid"
    :asyncing="isLoading"
    @close="$emit('close')"
    @confirm="submit"
  >
    <div class="form">
      <div>
        <h4 class="title">
          {{ $t('form.email-contact') }}
        </h4>
        <TextInput
          v-model="form.reported_by"
          class="text-input"
          data-test="report-email"
          @blur="v$.form.reported_by.$validate"
        />
        <FieldErrors :errors="v$.form.reported_by.$errors" />
      </div>

      <div>
        <h4 class="title">
          {{ $t('form.url') }}
        </h4>
        <span class="description">
          {{ type === 'abuse' ? $t('report.abuse-url') : $t('report.bug-url') }}
        </span>
        <TextInput
          v-model="form.url"
          class="text-input"
          data-test="report-url"
          @blur="v$.form.url.$validate"
        />
        <FieldErrors :errors="v$.form.url.$errors" />
      </div>

      <div>
        <h4 class="title">
          {{ $t('form.title') }}
        </h4>
        <span class="description">
          {{ type === 'abuse' ? $t('report.abuse-title') : $t('report.bug-title') }}
        </span>
        <TextInput
          v-model="form.title"
          class="text-input"
          data-test="report-title"
          @blur="v$.form.title.$validate"
        />
        <FieldErrors :errors="v$.form.title.$errors" />
      </div>

      <div>
        <h4 class="title">
          {{ $t('form.description') }}
        </h4>
        <span class="description">
          {{ type === 'abuse' ? $t('report.abuse-text') : $t('report.bug-text') }}
        </span>
        <TextInput
          v-model="form.message"
          class="text-input-test"
          input-type="textarea"
          rows="10"
          data-test="report-description"
          @blur="v$.form.message.$validate"
        />
        <FieldErrors :errors="v$.form.message.$errors" />
      </div>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { reportBug, reportAbuse } from '@/api/report.service'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { helpers, url, required, email } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useToasterStore from '@/stores/useToaster'

const defaultForm = () => {
  return {
    title: '',
    message: '',
    url: '',
    reported_by: '',
  }
}

const props = withDefaults(defineProps<{ type?: string; isOpened?: boolean }>(), {
  type: '',
  isOpened: false,
})

const emit = defineEmits<{ close: [] }>()

const toaster = useToasterStore()
const { t } = useNuxtI18n()
const rules = computed(() => ({
  message: {
    required: helpers.withMessage(t('form.report.message'), required),
  },
  url: {
    required: helpers.withMessage(t('form.report.url.required'), required),
    url: helpers.withMessage(t('form.report.url.format'), url),
  },
  reported_by: {
    required: helpers.withMessage(t('form.report.email.required'), required),
    email: helpers.withMessage(t('form.report.email.format'), email),
  },
  title: {
    required: helpers.withMessage(t('form.report.title'), required),
  },
}))
const form = ref(defaultForm())
const v$ = useValidate(rules, form)
const isLoading = ref(false)

const orgCode = useOrganizationCode()

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

    if (props.type === 'abuse') {
      try {
        await reportAbuse(orgCode, form.value)
        toaster.pushSuccess(t('toasts.abuse-report.success'))
      } catch (error) {
        toaster.pushError(`${t('toasts.abuse-report.error')} (${error})`)
        console.error(error)
      } finally {
        isLoading.value = false
        emit('close')
      }
    } else if (props.type === 'bug') {
      try {
        await reportBug(orgCode, form.value)
        toaster.pushSuccess(t('toasts.bug-report.success'))
      } catch (error) {
        toaster.pushError(`${t('toasts.bug-report.error')} (${error})`)
        console.error(error)
      } finally {
        isLoading.value = false
        emit('close')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-form {
  padding: 0 1.5rem;

  h1 {
    font-size: $font-size-l;
    margin-bottom: $space-l;
  }
}
</style>
