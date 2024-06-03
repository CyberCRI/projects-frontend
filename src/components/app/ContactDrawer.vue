<template>
    <BaseDrawer
        :custom-style="customNotificationStyle"
        :is-opened="isOpened"
        class="medium"
        :confirm-action-name="$filters.capitalize($t('common.send'))"
        :confirm-action-disabled="v$.$invalid"
        :title="$t('footer.contact')"
        @close="$emit('close')"
        @confirm="submit"
        :asyncing="isLoading"
    >
        <form class="form">
            <h3 class="sub-title">{{ $t('form.contact.subtitle') }}</h3>
            <div class="form-input">
                <h4 class="title">{{ $filters.capitalize($t('form.contact.subject')) }}</h4>
                <TextInput
                    v-model="form.subject"
                    class="text-input"
                    data-test="contact-subject"
                    :placeholder="$t('form.contact.subject-placeholder')"
                    @blur="v$.form.subject.$validate"
                />

                <p
                    v-for="error of v$.form.subject.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
            </div>

            <div class="form-input">
                <h4 class="title">{{ $filters.capitalize($t('form.contact.email')) }}</h4>
                <TextInput
                    v-model="form.email"
                    class="text-input"
                    data-test="contact-email"
                    :placeholder="$t('form.contact.email-placeholder')"
                    @blur="v$.form.email.$validate"
                />
                <p
                    v-for="error of v$.form.email.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
            </div>

            <div class="form-input">
                <h4 class="title">{{ $filters.capitalize($t('form.contact.content')) }}</h4>
                <TextInput
                    input-type="textarea"
                    v-model="form.content"
                    class="text-input"
                    data-test="contact-content"
                    :placeholder="$t('form.contact.content-placeholder')"
                    @blur="v$.form.content.$validate"
                />
                <p
                    v-for="error of v$.form.content.$errors"
                    :key="error.$uid"
                    class="error-description"
                >
                    {{ error.$message }}
                </p>
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

function defaultForm() {
    return {
        subject: '',
        email: '',
        content: '',
    }
}

export default {
    name: 'ContactDrawer',

    emits: ['close'],

    components: { TextInput, BaseDrawer },

    props: {
        isOpened: {
            type: Boolean,
            required: true,
        },
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
                    await contactUs(this.form)
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('toasts.contact.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('toasts.contact.error')} (${error})`,
                        type: 'error',
                    })
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

    .error-description {
        color: $salmon;
        margin-top: $space-s;
        font-size: $font-size-s;
    }
}
</style>
