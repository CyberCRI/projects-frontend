<template>
    <div class="mentroship-respond-page page-section-narrow page-top" v-if="!isLoading">
        <h1 class="page-title">
            {{
                $t(
                    isOffer
                        ? 'mentorship.respond.title-mentoree'
                        : 'mentorship.respond.title-mentor'
                )
            }}
        </h1>

        <p>
            <a href="#" @click.prevent="profileIsOpened = true">{{ mentoreeName }}</a>
            {{ $t(isOffer ? 'mentorship.respond.offered-you' : 'mentorship.respond.asked-you') }}
            <strong>{{ skillLabel }}</strong>
        </p>

        <p v-if="responseWasSent" class="response-sent">
            {{ $t('mentorship.respond.response-was-sent') }}
        </p>
        <template v-else>
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
                <p class="notice">
                    {{
                        $t(
                            isOffer
                                ? 'mentorship.respond.comment-notice-mentoree'
                                : 'mentorship.respond.comment-notice-mentor'
                        )
                    }}
                </p>
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
        </template>
        <BaseDrawer
            no-footer
            :is-opened="profileIsOpened"
            :title="$t('profile.drawer_title')"
            @close="profileIsOpened = false"
        >
            <UserProfile
                v-if="profileIsOpened"
                ref="profile-user"
                :can-edit="false"
                :user-id="mentorship?.mentoree?.id"
            />
        </BaseDrawer>
    </div>
</template>
<script>
import TextInput from '@/components/base/form/TextInput.vue'
import RadioButton from '@/components/base/form/RadioButton.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useUsersStore from '@/stores/useUsers.ts'
import { getMentorshipDetails, respondMentorship } from '@/api/mentorship.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import useSkillTexts from '@/composables/useSkillTexts.js'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserProfile from '@/components/people/UserProfile.vue'
export default {
    name: 'MentorshipRespondPage',

    components: { TextInput, RadioButton, LpiButton, BaseDrawer, UserProfile },

    setup() {
        const usersStore = useUsersStore()
        const organizationsStore = useOrganizationsStore()
        const skillTexts = useSkillTexts()
        return { usersStore, organizationsStore, skillTexts }
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
            mentorship: null,
            profileIsOpened: false,
            responseWasSent: false,
        }
    },

    computed: {
        answerOptions() {
            return [
                { label: this.$t('mentorship.respond.options.accept'), value: 'accepted' },
                { label: this.$t('mentorship.respond.options.decline'), value: 'rejected' },
                { label: this.$t('mentorship.respond.options.need-infos'), value: 'pending' },
            ]
        },
        isConnected() {
            return this.usersStore.isConnected
        },
        skillLabel() {
            return this.mentorship?.skill ? this.skillTexts.title(this.mentorship.skill) : ''
        },

        mentoreeName() {
            if (this.mentorship?.mentoree) {
                return (
                    this.mentorship.mentoree.given_name + ' ' + this.mentorship.mentoree.family_name
                )
            }
            return ''
        },

        isOffer() {
            return this.mentorship?.mentor?.id === this.mentorship?.created_by
        },
    },

    async mounted() {
        this.isLoading = true
        if (!this.isConnected || !this.token) {
            this.display404()
        }

        try {
            // TODO: Call API to get the mentorship request
            this.mentorship = await getMentorshipDetails(
                this.organizationsStore.current?.code,
                this.token
            )
            this.responseWasSent = !!this.mentorship.status
            this.isLoading = false
        } catch (error) {
            console.error(error)
            this.display404()
        }
    },

    methods: {
        async submit() {
            this.isSaving = true
            const payload = {
                status: this.form.answer,
                content: this.form.comment,
                reply_to: this.mentorship?.mentoree?.email,
            }
            try {
                // TODO: Call API to save the response
                await respondMentorship(
                    this.organizationsStore.current?.code,
                    this.mentorship.id,
                    payload
                )
                this.responseWasSent = true
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

a,
strong {
    font-weight: bold;
    color: $primary-dark;
}

a:hover {
    text-decoration: underline;
}

.response-sent {
    margin-top: $space-xl;
    background-color: $primary-lighter;
    text-align: center;
    border-radius: $space-m;
    padding: $space-xl $space-m;
}
</style>
