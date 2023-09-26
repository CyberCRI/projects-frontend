<template>
    <div class="profile-edit-bio">
        <!-- short bio -->
        <div class="form-group">
            <TextInput
                v-model="form.shortBio"
                :label="$t('profile.edit.bio.short-bio.label')"
                :placeholder="$t('profile.edit.bio.short-bio.placeholder')"
                :max-length="300"
            ></TextInput>
        </div>
        <!-- professional bio -->
        <div class="form-group">
            <label>{{ $t('profile.edit.bio.professional-bio.label') }}</label>
            <p class="notice">{{ $t('profile.edit.bio.professional-bio.placeholder') }}</p>
            <TipTapEditor
                :key="editorProfessionalBioKey"
                ref="faq-editor"
                :ws-data="form.professionalBio"
                mode="simple"
                @update="updateProfessionalBio"
            />
        </div>
        <!-- personal bio -->
        <div class="form-group">
            <label>{{ $t('profile.edit.bio.personal-bio.label') }}</label>
            <p class="notice">{{ $t('profile.edit.bio.personal-bio.placeholder') }}</p>
            <TipTapEditor
                :key="editorPersonalBioKey"
                ref="faq-editor"
                :ws-data="form.personalBio"
                mode="simple"
                @update="updatePersonalBio"
            />
        </div>
        <hr class="form-separator" />
        <!-- actions -->
        <div class="form-actions">
            <LpiButton
                :disabled="asyncing"
                :label="$filters.capitalize($t('common.cancel'))"
                :secondary="true"
                class="footer__left-button"
                @click="cancel"
                data-test="close-button"
            />

            <LpiButton
                :disabled="confirmActionDisabled || asyncing"
                :label="$filters.capitalize($t('common.confirm'))"
                :left-icon="asyncing ? 'LoaderSimple' : null"
                :secondary="false"
                class="footer__right-button"
                @click="save"
                data-test="confirm-button"
            />
        </div>
    </div>
</template>
<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'
import { patchUser } from '@/api/people.service.ts'

function defaultForm() {
    return {
        shortBio: '',
        professionalBio: { originalContent: '', savedContent: '' },
        personalBio: { originalContent: '', savedContent: '' },
    }
}

export default {
    name: 'ProfileBioEditTab',
    components: {
        TextInput,
        LpiButton,
        TipTapEditor,
    },
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            form: defaultForm(),
            editorProfessionalBioKey: 0,
            editorPersonalBioKey: 0,
            asyncing: false,
            confirmActionDisabled: false,
        }
    },
    watch: {
        user: {
            handler(neo) {
                if (neo) this.resetForm()
            },
            immediate: true,
        },
    },

    methods: {
        cancel() {
            this.resetForm()
        },
        async save() {
            this.asyncing = true
            try {
                const data = {
                    short_description: this.form.shortBio,
                    professional_description: this.form.professionalBio.savedContent,
                    personal_description: this.form.personalBio.savedContent,
                }

                await patchUser(this.user.keycloak_id, data)

                this.$store.dispatch('users/getUser', this.user.keycloak_id)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('profile.edit.bio.save-success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('profile.edit.bio.save-error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.asyncing = false
            }
        },
        resetForm() {
            if (this.user) {
                this.form = {
                    shortBio: this.user.short_description || '',
                    personalBio: {
                        originalContent: this.user.personal_description || '',
                        savedContent: this.user.personal_description || '',
                    },
                    professionalBio: {
                        originalContent: this.user.professional_description || '',
                        savedContent: this.user.professional_description || '',
                    },
                }
            } else {
                this.form = defaultForm()
            }
            this.editorProfessionalBioKey++
            this.editorPersonalBioKey++
        },
        updateProfessionalBio(htmlContent) {
            this.form.professionalBio.savedContent = htmlContent
        },

        updatePersonalBio(htmlContent) {
            this.form.personalBio.savedContent = htmlContent
        },
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.form-actions {
    position: sticky;
    bottom: 0;
    background-color: white;
}
</style>
