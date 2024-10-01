<template>
    <BaseDrawer
        :is-opened="isOpened"
        :title="type ? $t(`report.${type}`) : ''"
        class="report-form medium"
        :confirm-action-name="$filters.capitalize($t('common.save'))"
        :confirm-action-disabled="v$.$invalid"
        @close="$emit('close')"
        @confirm="submit"
        :asyncing="isLoading"
    >
        <div class="form">
            <div>
                <h4 class="title">{{ $filters.capitalize($t('form.email-contact')) }}</h4>
                <TextInput
                    v-model="form.reported_by"
                    class="text-input"
                    data-test="report-email"
                    @blur="v$.form.reported_by.$validate"
                />
                <FieldErrors :errors="v$.form.reported_by.$errors" />
            </div>

            <div>
                <h4 class="title">{{ $filters.capitalize($t('form.url')) }}</h4>
                <span class="description">{{
                    type === 'abuse' ? $t('report.abuse-url') : $t('report.bug-url')
                }}</span>
                <TextInput
                    v-model="form.url"
                    class="text-input"
                    data-test="report-url"
                    @blur="v$.form.url.$validate"
                />
                <FieldErrors :errors="v$.form.url.$errors" />
            </div>

            <div>
                <h4 class="title">{{ $t('form.title') }}</h4>
                <span class="description">{{
                    type === 'abuse' ? $t('report.abuse-title') : $t('report.bug-title')
                }}</span>
                <TextInput
                    v-model="form.title"
                    class="text-input"
                    data-test="report-title"
                    @blur="v$.form.title.$validate"
                />
                <FieldErrors :errors="v$.form.title.$errors" />
            </div>

            <div>
                <h4 class="title">{{ $t('form.description') }}</h4>
                <span class="description">{{
                    type === 'abuse' ? $t('report.abuse-text') : $t('report.bug-text')
                }}</span>
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

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { reportBug, reportAbuse } from '@/api/report.service'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { helpers, url, required, email } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useToasterStore from '@/stores/useToaster.ts'

function defaultForm() {
    return {
        title: '',
        message: '',
        url: '',
        reported_by: '',
    }
}

export default {
    name: 'ReportDrawer',

    emits: ['close'],

    components: { TextInput, BaseDrawer, FieldErrors },
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    data() {
        return {
            v$: useValidate(),
            isLoading: false,
            form: defaultForm(),
        }
    },

    validations() {
        return {
            form: {
                message: {
                    required: helpers.withMessage(this.$t('form.report.message'), required),
                },
                url: {
                    required: helpers.withMessage(this.$t('form.report.url.required'), required),
                    url: helpers.withMessage(this.$t('form.report.url.format'), url),
                },
                reported_by: {
                    required: helpers.withMessage(this.$t('form.report.email.required'), required),
                    email: helpers.withMessage(this.$t('form.report.email.format'), email),
                },
                title: {
                    required: helpers.withMessage(this.$t('form.report.title'), required),
                },
            },
        }
    },

    props: {
        type: {
            type: String,
            default: '',
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
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

                if (this.type === 'abuse') {
                    try {
                        await reportAbuse(this.form)
                        this.toaster.pushSuccess(this.$t('toasts.abuse-report.success'))
                    } catch (error) {
                        this.toaster.pushError(`${this.$t('toasts.abuse-report.error')} (${error})`)
                        console.error(error)
                    } finally {
                        this.isLoading = false
                        this.$emit('close')
                    }
                } else if (this.type === 'bug') {
                    try {
                        await reportBug(this.form)
                        this.toaster.pushSuccess(this.$t('toasts.bug-report.success'))
                    } catch (error) {
                        this.toaster.pushError(`${this.$t('toasts.bug-report.error')} (${error})`)
                        console.error(error)
                    } finally {
                        this.isLoading = false
                        this.$emit('close')
                    }
                }
            }
        },
    },
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
