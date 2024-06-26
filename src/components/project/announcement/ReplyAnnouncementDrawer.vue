<template>
    <BaseDrawer
        class="medium"
        :is-opened="isOpened"
        :title="$t('project.announcements')"
        @close="close"
        :confirm-action-name="$t('recruit.apply')"
        @confirm="sendApplication"
        :confirm-action-disabled="v$.$invalid || !captchatoken"
    >
        <div class="announcement-reply">
            <h4 class="reply-to" v-if="announcement">{{ announcement.title }}</h4>

            <div class="form-section">
                <TextInput
                    :label="$filters.capitalize($t('recruit.firstname'))"
                    v-model="form.applicant_firstname"
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
                    input-type="email"
                    v-model="form.applicant_email"
                    :label="$filters.capitalize($t('form.email'))"
                    @blur="v$.form.applicant_email.$touch"
                />

                <FieldErrors :errors="v$.form.applicant_email.$errors" />
            </div>

            <div class="form-section">
                <label for="motivation" class="label">
                    {{ $filters.capitalize($t('recruit.about-you')) }}
                </label>

                <TipTapEditor
                    :key="editorKey"
                    mode="simple"
                    :socket="false"
                    :ws-data="wsData"
                    @update="updateContent"
                    :save-icon-visible="false"
                    name="motivation"
                    @blur="v$.wsData.savedContent.$validate"
                />

                <FieldErrors :errors="v$.wsData.savedContent.$errors" />
            </div>

            <div class="form-section captcha_cont has-text-centered">
                <div id="RECAPTCHA"></div>
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

export default {
    name: 'ReplyAnnouncementDrawer',

    emits: ['close'],

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

    data() {
        return {
            v$: useVuelidate(),

            editorKey: 0,
            form: {
                applicant_firstname: '',
                applicant_name: '',
                applicant_email: '',
                applicant_message: '',
                project_id: '',
            },
            wsData: { content: '', originalContent: '', savedContent: '' },
            recaptcha: false,
            captchatoken: false,
        }
    },

    validations() {
        return {
            form: {
                applicant_firstname: {
                    required: helpers.withMessage(
                        this.$t('form.reply-announcement.first-name'),
                        required
                    ),
                },
                applicant_name: {
                    required: helpers.withMessage(
                        this.$t('form.reply-announcement.last-name'),
                        required
                    ),
                },
                applicant_email: {
                    required: helpers.withMessage(
                        this.$t('form.reply-announcement.email.required'),

                        required
                    ),
                    email: helpers.withMessage(
                        this.$t('form.reply-announcement.email.format'),
                        email
                    ),
                },
            },
            wsData: {
                savedContent: {
                    required: helpers.withMessage(
                        this.$t('form.reply-announcement.description'),
                        required
                    ),
                },
            },
        }
    },

    methods: {
        close() {
            this.v$.$reset()
            this.$emit('close')
        },
        updateContent(htmlContent) {
            this.wsData.savedContent = htmlContent
            this.form.applicant_message = htmlContent

            if (htmlContent === '<p></p>') {
                this.wsData.savedContent = null
                this.form.applicant_message = null
            }
        },
        async sendApplication() {
            const isValid = await this.v$.$validate()

            if (isValid)
                try {
                    const payload = {
                        ...this.form,
                        project_id: this.announcement.project.id,
                        announcement_id: this.announcement.id,
                        recaptcha: this.captchatoken,
                    }

                    await applyAnnouncement(payload)

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('project.apply-succes'),
                        type: 'succes',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: error.toString(),
                        type: 'error',
                    })
                    console.error(error)
                } finally {
                    this.close()
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
                        sitekey: import.meta.env.VITE_APP_CAPTCHA_KEY,
                        callback: captchaCB,
                    })
                })
            }
            if (!document.getElementById('recaptchaScript')) {
                script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
                document.getElementsByTagName('head')[0].appendChild(script)
            } else {
                this.recaptcha = grecaptcha.render('RECAPTCHA', {
                    sitekey: import.meta.env.VITE_APP_CAPTCHA_KEY,
                    callback: captchaCB,
                })
            }
        },
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
                this.wsData = { content: '', originalContent: '', savedContent: '' }
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
}
</script>
<style lang="scss" scoped>
.reply-to {
    margin-bottom: $space-m;
    text-align: center;
    font-size: $font-size-l;
}

.form-section {
    margin-bottom: $space-m;

    .label {
        font-size: $font-size-s;
        font-weight: bold;
        margin-bottom: $space-l;
        color: $black;
    }
}
</style>
