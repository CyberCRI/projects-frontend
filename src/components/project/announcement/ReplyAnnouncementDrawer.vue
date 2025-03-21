<template>
  <BaseDrawer
    class="medium"
    :is-opened="isOpened"
    :title="$t('project.announcements')"
    :confirm-action-name="$t('recruit.apply')"
    :confirm-action-disabled="v$.$invalid || !captchatoken"
    :asyncing="asyncing"
    @close="close"
    @confirm="sendApplication"
  >
    <div class="announcement-reply">
      <h4 v-if="announcement" class="reply-to">
        {{ announcement.title }}
      </h4>

      <div class="form-section">
        <TextInput
          v-model="form.applicant_firstname"
          :label="$filters.capitalize($t('recruit.firstname'))"
          @blur="v$.form.applicant_firstname.$touch"
        />

        <FieldErrors :errors="v$.form.applicant_firstname.$errors" />
      </div>

      <div class="form-section">
        <TextInput
          v-model="form.applicant_name"
          :label="$filters.capitalize($t('recruit.lastname'))"
          @blur="v$.form.applicant_name.$touch"
        />

        <FieldErrors :errors="v$.form.applicant_name.$errors" />
      </div>

      <div class="form-section">
        <TextInput
          v-model="form.applicant_email"
          input-type="email"
          :label="$filters.capitalize($t('form.email'))"
          @blur="v$.form.applicant_email.$touch"
        />

        <FieldErrors :errors="v$.form.applicant_email.$errors" />
      </div>

      <div class="form-section editor-section">
        <label for="motivation" class="label">
          {{ $filters.capitalize($t('recruit.about-you')) }}
        </label>

        <TipTapEditor
          v-model="form.applicant_message"
          name="motivation"
          @blur="v$.form.applicant_message.$validate"
        />

        <FieldErrors :errors="v$.form.applicant_message.$errors" />
      </div>

      <div class="form-section captcha_cont has-text-centered">
        <div id="RECAPTCHA" />
      </div>
    </div>
  </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { applyAnnouncement } from '@/api/announcements.service.ts'
import useVuelidate from '@vuelidate/core'
import { helpers, required, email } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useToasterStore from '@/stores/useToaster.ts'
import { useRuntimeConfig } from '#imports'

export default {
  name: 'ReplyAnnouncementDrawer',

  components: {
    BaseDrawer,
    TipTapEditor,
    TextInput,
    FieldErrors,
  },

  props: {
    isOpened: { type: Boolean, default: false },
    announcement: {
      type: Object,
      default: () => {},
    },
  },

  emits: ['close'],
  setup() {
    const toaster = useToasterStore()
    const runtimeConfig = useRuntimeConfig()

    return {
      toaster,
      runtimeConfig,
    }
  },

  data() {
    return {
      v$: useVuelidate(),
      form: {
        applicant_firstname: '',
        applicant_name: '',
        applicant_email: '',
        applicant_message: '',
        project_id: '',
      },
      recaptcha: false,
      captchatoken: false,
      asyncing: false,
    }
  },

  validations() {
    return {
      form: {
        applicant_firstname: {
          required: helpers.withMessage(this.$t('form.reply-announcement.first-name'), required),
        },
        applicant_name: {
          required: helpers.withMessage(this.$t('form.reply-announcement.last-name'), required),
        },
        applicant_email: {
          required: helpers.withMessage(
            this.$t('form.reply-announcement.email.required'),

            required
          ),
          email: helpers.withMessage(this.$t('form.reply-announcement.email.format'), email),
        },
        applicant_message: helpers.withMessage(
          this.$t('form.reply-announcement.description'),
          required
        ),
      },
    }
  },

  watch: {
    isOpened: {
      handler: function (open) {
        this.form = {
          applicant_firstname: '',
          applicant_name: '',
          applicant_email: '',
          applicant_message: '',
          project_id: '',
        }
        this.recaptcha = false
        this.captchatoken = false
        if (open) {
          this.$nextTick(this.createRecaptcha)
        }
      },
      immediate: true,
    },
  },

  beforeUnmount() {
    if (this.recaptcha) {
      grecaptcha.reset(this.recaptcha)
    }
  },

  methods: {
    close() {
      this.v$.$reset()
      this.$emit('close')
    },

    async sendApplication() {
      const isValid = await this.v$.$validate()

      if (isValid)
        try {
          this.asyncing = true
          const payload = {
            ...this.form,
            project_id: this.announcement.project.id,
            announcement_id: this.announcement.id,
            recaptcha: this.captchatoken,
          }

          await applyAnnouncement(payload)

          this.toaster.pushSuccess(this.$t('project.apply-succes'))
        } catch (error) {
          this.toaster.pushError(error.toString())
          console.error(error)
        } finally {
          this.close()
          this.asyncing = false
        }
    },

    createRecaptcha() {
      const captchaCB = (resp) => {
        this.captchatoken = resp
      }
      let script = document.createElement('script')
      script.setAttribute('async', '')
      script.setAttribute('defer', '')
      script.id = 'recaptchaScript'
      script.onload = () => {
        grecaptcha.ready(() => {
          this.recaptcha = grecaptcha.render('RECAPTCHA', {
            sitekey: this.runtimeConfig.public.appCaptchaKey,
            callback: captchaCB,
          })
        })
      }
      if (!document.getElementById('recaptchaScript')) {
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
        document.getElementsByTagName('head')[0].appendChild(script)
      } else {
        this.recaptcha = grecaptcha.render('RECAPTCHA', {
          sitekey: this.runtimeConfig.public.appCaptchaKey,
          callback: captchaCB,
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.reply-to {
  margin-bottom: $space-m;
  text-align: center;
  font-size: $font-size-l;
}

.announcement-reply {
  display: flex;
  flex-direction: column;
  gap: $space-s;
  flex-grow: 1;
}

.form-section {
  flex-shrink: 0;

  .label {
    font-size: $font-size-s;
    font-weight: bold;
    margin-bottom: $space-m;
    color: $black;
  }
}

.editor-section {
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .editor {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
  }
}
</style>
