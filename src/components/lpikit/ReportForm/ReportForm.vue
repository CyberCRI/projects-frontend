<template>
    <div class="form">
        <div>
            <h4 class="title">{{ $filters.capitalize($t('form.email-contact')) }}</h4>
            <TextInput v-model="form.reported_by" class="text-input" data-test="report-email" />
            <p
                v-for="error of v$.form.reported_by.$errors"
                :key="error.$uid"
                class="error-description"
            >
                {{ error.$message }}
            </p>
        </div>

        <div>
            <h4 class="title">{{ $filters.capitalize($t('form.url')) }}</h4>
            <span class="description">{{
                type === 'abuse' ? $t('report.abuse-url') : $t('report.bug-url')
            }}</span>
            <TextInput v-model="form.url" class="text-input" data-test="report-url" />
            <p v-for="error of v$.form.url.$errors" :key="error.$uid" class="error-description">
                {{ error.$message }}
            </p>
        </div>

        <div>
            <h4 class="title">{{ $t('form.title') }}</h4>
            <span class="description">{{
                type === 'abuse' ? $t('report.abuse-title') : $t('report.bug-title')
            }}</span>
            <TextInput v-model="form.title" class="text-input" data-test="report-title" />
            <p v-for="error of v$.form.title.$errors" :key="error.$uid" class="error-description">
                {{ error.$message }}
            </p>
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
                data-test="report-description"
            />
            <p v-for="error of v$.form.message.$errors" :key="error.$uid" class="error-description">
                {{ error.$message }}
            </p>
        </div>

        <LpiButton
            :label="$filters.capitalize($t('common.save'))"
            class="save-button"
            @click="submit"
            :btn-icon="isLoading ? 'LoaderSimple' : null"
            data-test="report-button"
        />
    </div>
</template>

<script>
import { /*EASTER BUG 7bis:  reportBug,*/ reportAbuse } from '@/api/report.service'
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import useValidate from '@vuelidate/core'
import { helpers, url, required, email } from '@vuelidate/validators'

export default {
    name: 'ReportForm',

    emits: ['close'],

    components: { TextInput, LpiButton },

    data() {
        return {
            v$: useValidate(),
            isLoading: false,
            form: {
                title: '',
                message: '',
                url: '',
                reported_by: '',
            },
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
    },

    methods: {
        async submit() {
            const isValid = await this.v$.$validate()

            if (isValid) {
                this.isLoading = true

                if (this.type === 'abuse') {
                    try {
                        await reportAbuse(this.form)
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.abuse-report.success'),
                            type: 'success',
                        })
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.abuse-report.error')} (${error})`,
                            type: 'error',
                        })
                        console.error(error)
                    } finally {
                        this.isLoading = false
                        this.$emit('close')
                    }
                } else if (this.type === 'bug') {
                    try {
                        // EASTER BUG 7 bug report dont send mail
                        // await reportBug(this.form)
                        this.$store.dispatch('notifications/pushToast', {
                            message: this.$t('toasts.bug-report.success'),
                            type: 'success',
                        })
                    } catch (error) {
                        this.$store.dispatch('notifications/pushToast', {
                            message: `${this.$t('toasts.bug-report.error')} (${error})`,
                            type: 'error',
                        })
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
    h1 {
        font-size: $font-size-l;
        margin-bottom: $space-l;
    }
}
</style>
