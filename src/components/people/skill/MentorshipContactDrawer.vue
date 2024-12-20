<template>
    <BaseDrawer
        :confirm-action-disabled="asyncing"
        :confirm-action-name="$t('common.send')"
        :is-opened="isOpen"
        :title="$t(`profile.edit.skills.mentorship.contact.title-${mode}`)"
        class="small"
        @close="$emit('close')"
        @confirm="confirm"
        :asyncing="isLoading"
    >
        <p class="notice">{{ $t(`profile.edit.skills.mentorship.contact.notice-${mode}`) }}</p>
        <div class="form-input">
            <h4 class="title">
                {{ $t('profile.edit.skills.mentorship.contact.fields.title.label') }} *
            </h4>
            <TextInput
                v-model="form.title"
                class="text-input"
                data-test="ask-mentorship-title"
                :placeholder="
                    $t(`profile.edit.skills.mentorship.contact.fields.title.placeholder-${mode}`)
                "
                @blur="v$.form.title.$validate"
            />

            <FieldErrors :errors="v$.form.title.$errors" />
        </div>

        <div class="form-input">
            <h4 class="title">
                {{ $t('profile.edit.skills.mentorship.contact.fields.text.label') }} *
            </h4>
            <p class="notice">
                {{ $t(`profile.edit.skills.mentorship.contact.fields.text.notice-${mode}`) }}
            </p>
            <TextInput
                input-type="textarea"
                v-model="form.content"
                class="text-input"
                data-test="ask-mentorship-text"
                :placeholder="$t('profile.edit.skills.mentorship.contact.fields.text.placeholder')"
                @blur="v$.form.content.$validate"
            />
            <FieldErrors :errors="v$.form.content.$errors" />
        </div>

        <div class="form-input">
            <h4 class="title">
                {{ $t('profile.edit.skills.mentorship.contact.fields.email.label') }} *
            </h4>
            <p class="notice">
                {{ $t('profile.edit.skills.mentorship.contact.fields.email.notice') }}
            </p>
            <TextInput
                v-model="form.reply_to"
                class="text-input"
                data-test="ask-mentorship-email"
                :placeholder="$t('profile.edit.skills.mentorship.contact.fields.email.placeholder')"
                @blur="v$.form.reply_to.$validate"
            />
            <FieldErrors :errors="v$.form.reply_to.$errors" />
        </div>
    </BaseDrawer>
</template>
<script>
import useToasterStore from '@/stores/useToaster.ts'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useValidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { askMentorship, offerMentorship } from '@/api/skill.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useUsersStore from '@/stores/useUsers.ts'
export function defaultForm() {
    return {
        title: '',
        content: '',
        reply_to: '',
    }
}

export default {
    name: 'MentorshipContactDrawer',

    emits: 'close',

    components: { BaseDrawer, TextInput, FieldErrors },

    props: {
        skill: {
            type: Object,
            required: true,
        },
        isOpen: {
            type: Boolean,
            default: false,
        },

        asyncing: {
            type: Boolean,
            default: false,
        },
        isOffer: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        const usersStore = useUsersStore()

        return {
            toaster,
            organizationsStore,
            usersStore,
        }
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
                        this.$t('profile.edit.skills.mentorship.contact.fields.title.required'),
                        required
                    ),
                },
                content: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.skills.mentorship.contact.fields.title.required'),
                        required
                    ),
                },
                reply_to: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.skills.mentorship.contact.fields.title.required'),
                        required
                    ),
                    email: helpers.withMessage(
                        this.$t('profile.edit.skills.mentorship.contact.fields.email.invalid'),
                        email
                    ),
                },
            },
        }
    },

    computed: {
        mode() {
            return this.isOffer ? 'offer' : 'ask'
        },
    },

    watch: {
        isOpen() {
            this.v$.$reset()
            this.form = defaultForm()
            // this.form.reply_to = this.usersStore.user?.email || '' // thhis is keycloak contact mail
            this.form.reply_to = this.usersStore.userFromApi?.email || '' // this the login mail
        },
    },

    methods: {
        async confirm() {
            const isValid = await this.v$.$validate()

            if (isValid) {
                this.isLoading = true
                try {
                    const orgCode = this.organizationsStore.current?.code
                    if (this.isOffer) {
                        await offerMentorship(orgCode, this.skill, this.form)
                    } else {
                        await askMentorship(orgCode, this.skill, this.form)
                    }
                    this.toaster.pushSuccess(
                        this.$t('profile.edit.skills.mentorship.contact.success')
                    )
                } catch (error) {
                    this.toaster.pushError(
                        `${this.$t('profile.edit.skills.mentorship.contact.error')} (${error})`
                    )
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
