<template>
    <div class="mentroship-respond-page page-section-narrow page-top" v-if="!isLoading">
        <h1 class="page-title">{{ $t('mentorship.respond.title') }}</h1>

        <div class="form-field">
            <h3 class="label">{{ $t('mentorship.respond.your-response') }} *</h3>

            <div class="answer-options">
                <RadioButton
                    v-for="answerOption in answerOptions"
                    :key="answerOption.value"
                    v-model="form.answer"
                    :label="answerOption.label"
                    :value="answerOption.value"
                    radio-group="answer"
                    as-button
                />
            </div>
        </div>

        <div class="form-field">
            <h3 class="label">{{ $t('mentorship.respond.add-comment') }}</h3>
            <p class="notice">{{ $t('mentorship.respond.comment-notice') }}</p>
            <TextInput
                v-model="form.comment"
                label=""
                :placeholder="$t('mentorship.respond.comment-placeholder')"
                input-type="textarea"
                rows="10"
            />
        </div>

        <div class="form-field submit-field">
            <LpiButton
                :disabled="!form.answer || isSaving"
                :label="$t('common.send')"
                :btn-icon="isSaving ? 'LoaderSimple' : null"
                class="submit-btn"
                @click="submit"
                data-test="membership-respond-button"
            />
        </div>
    </div>
</template>
<script>
import TextInput from '@/components/base/form/TextInput.vue'
import RadioButton from '@/components/base/form/RadioButton.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useUsersStore from '@/stores/useUsers.ts'
export default {
    name: 'MentorshipRespondPage',

    components: { TextInput, RadioButton, LpiButton },

    setup() {
        const usersStore = useUsersStore()
        return { usersStore }
    },

    props: {
        token: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            form: {
                answer: null,
                comment: '',
            },
            isSaving: false,
            isLoading: false,
        }
    },

    computed: {
        answerOptions() {
            return [
                { label: this.$t('mentorship.respond.options.accept'), value: 'accept' },
                { label: this.$t('mentorship.respond.options.decline'), value: 'decline' },
                { label: this.$t('mentorship.respond.options.need-infos'), value: 'need-infos' },
            ]
        },
        isConnected() {
            return this.usersStore.isConnected
        },
    },

    async mounted() {
        this.isLoading = true
        if (!this.isConnected || !this.token) {
            this.display404()
        }

        try {
            // TODO: Call API to get the mentorship request
            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (this.token === '404') {
                throw new Error('Not found')
            }
            this.isLoading = false
        } catch (error) {
            console.error(error)
            this.display404()
        }
    },

    methods: {
        async submit() {
            this.isSaving = true
            try {
                // TODO: Call API to save the response
                await new Promise((resolve) => setTimeout(resolve, 1000))
            } catch (error) {
                console.error(error)
            } finally {
                this.isSaving = false
            }
        },

        display404() {
            this.$router.replace({
                name: 'page404',
                params: { pathMatch: this.$route.path.substring(1).split('/') },
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: $space-3xl;
}

.answer-options {
    display: flex;
    gap: $space-unit;
}

.form-field {
    margin-top: $space-unit;

    .label {
        margin-bottom: $space-m;
    }
}

.notice {
    margin-bottom: $space-m;
}

.submit-field {
    display: flex;
    justify-content: center;
    margin-bottom: $space-2xl;
}
</style>
