<template>
    <BaseDrawer
        :confirm-action-disabled="asyncing"
        :confirm-action-name="$t('common.send')"
        :is-opened="isOpen"
        :title="$t('profile.edit.mentorship.ask.title')"
        class="small"
        @close="$emit('close')"
        @confirm="confirm"
        :asyncing="isLoading"
    >
        <p class="notice">{{ $t('profile.edit.mentorship.ask.notice') }}</p>
        <div class="form-input">
            <h4 class="title">{{ $t('profile.edit.mentorship.ask.fields.title.label') }} *</h4>
            <TextInput
                v-model="form.title"
                class="text-input"
                data-test="ask-mentorship-title"
                :placeholder="$t('profile.edit.mentorship.ask.fields.title.placeholder')"
                @blur="v$.form.title.$validate"
            />

            <FieldErrors :errors="v$.form.title.$errors" />
        </div>

        <div class="form-input">
            <h4 class="title">{{ $t('profile.edit.mentorship.ask.fields.text.label') }} *</h4>
            <p class="notice">{{ $t('profile.edit.mentorship.ask.fields.text.notice') }}</p>
            <TextInput
                input-type="textarea"
                v-model="form.text"
                class="text-input"
                data-test="ask-mentorship-text"
                :placeholder="$t('profile.edit.mentorship.ask.fields.text.placeholder')"
                @blur="v$.form.text.$validate"
            />
            <FieldErrors :errors="v$.form.text.$errors" />
        </div>

        <div class="form-input">
            <h4 class="title">{{ $t('profile.edit.mentorship.ask.fields.email.label') }} *</h4>
            <p class="notice">{{ $t('profile.edit.mentorship.ask.fields.email.notice') }}</p>
            <TextInput
                v-model="form.email"
                class="text-input"
                data-test="ask-mentorship-email"
                :placeholder="$t('profile.edit.mentorship.ask.fields.email.placeholder')"
                @blur="v$.form.email.$validate"
            />
            <FieldErrors :errors="v$.form.email.$errors" />
        </div>
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
export function defaultForm() {
    return {
        title: '',
        text: '',
        email: '',
    }
}

export default {
    name: 'MentorshipAskDrawer',

    emits: 'close',

    components: { BaseDrawer, TextInput, FieldErrors },

    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },

        asyncing: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            v$: useValidate(),
            form: defaultForm(),
            isLoading: false,
        }
    },
    validations() {
        return {
            form: {
                title: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.mentorship.ask.fields.title.required'),
                        required
                    ),
                },
                text: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.mentorship.ask.fields.title.required'),
                        required
                    ),
                },
                email: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.mentorship.ask.fields.title.required'),
                        required
                    ),
                    email: helpers.withMessage(
                        this.$t('profile.edit.mentorship.ask.fields.email.invalid'),
                        email
                    ),
                },
            },
        }
    },

    watch: {
        isOpen() {
            this.v$.$reset()
            this.form = defaultForm()
        },
    },

    methods: {
        async confirm() {
            const isValid = await this.v$.$validate()

            if (isValid) {
                this.isLoading = true
                try {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('profile.edit.mentorship.ask.success'),
                        type: 'success',
                    })
                } catch (error) {
                    this.$store.dispatch('notifications/pushToast', {
                        message: `${this.$t('profile.edit.mentorship.ask.error')} (${error})`,
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
.title {
    font-size: $font-size-m;
    font-weight: bold;
    margin: $space-m 0;
}

.save-button {
    margin: $space-l 0;
}

.form-input {
    margin-bottom: $space-l;
}

.notice {
    margin: $space-m 0;
}
</style>
