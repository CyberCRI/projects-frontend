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

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import { contactUs } from '@/api/report.service'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

function defaultForm() {
  return {
    subject: '',
    email: '',
    content: '',
  }
}

export default {
  name: 'ContactDrawer',

  components: { TextInput, BaseDrawer, FieldErrors },

  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['close'],
  setup() {
    const toaster = useToasterStore()
    const organizationsStore = useOrganizationsStore()
    return {
      toaster,
      organizationsStore,
    }
  },

  data() {
    return {
      v$: useValidate(),
      form: defaultForm(),
      isLoading: false,
      asyncing: false,
      customNotificationStyle: {
        maxHeight: 'unset',
        padding: 'unset',
      },
    }
  },

  computed: {
    orgCode() {
      return this.organizationsStore?.current?.code
    },
  },
  validations() {
    return {
      form: {
        subject: {
          required: helpers.withMessage(this.$t('form.report.message'), required),
        },
        email: {
          required: helpers.withMessage(this.$t('form.report.email.required'), required),
          email: helpers.withMessage(this.$t('form.report.email.format'), email),
        },
        content: {
          required: helpers.withMessage(this.$t('form.report.content'), required),
        },
      },
    }
  },
  watch: {
    isOpened() {
      this.v$.$reset()
      this.form = defaultForm()
    },
  },

  methods: {
    async submit() {
      const isValid = await this.v$.$validate()

      if (isValid) {
        this.isLoading = true

        try {
          await contactUs(this.orgCode, this.form)
          this.toaster.pushSuccess(this.$t('toasts.contact.success'))
        } catch (error) {
          this.toaster.pushError(`${this.$t('toasts.contact.error')} (${error})`)
          console.error(error)
        } finally {
          this.isLoading = false
          this.$emit('close')
        }
      }
    },
  },
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
