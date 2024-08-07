<template>
    <div class="profile-edit-bio">
        <!-- short bio -->
        <div class="form-group">
            <TextInput
                v-model="form.shortBio"
                :label="$t('profile.edit.bio.short-bio.label')"
                :placeholder="$t('profile.edit.bio.short-bio.placeholder')"
                :max-length="300"
                data-test="short-bio-input"
            ></TextInput>
        </div>
        <!-- professional bio -->
        <div class="form-group">
            <label>{{ $t('profile.edit.bio.professional-bio.label') }}</label>
            <p class="notice">{{ $t('profile.edit.bio.professional-bio.placeholder') }}</p>
            <TipTapEditor
                :key="editorProfessionalBioKey"
                ref="faq-editor"
                v-model="form.professionalBio"
                data-test="professional-bio-editor"
            />
        </div>
        <!-- personal bio -->
        <div class="form-group">
            <label>{{ $t('profile.edit.bio.personal-bio.label') }}</label>
            <p class="notice">{{ $t('profile.edit.bio.personal-bio.placeholder') }}</p>
            <TipTapEditor
                :key="editorPersonalBioKey"
                ref="faq-editor"
                v-model="form.personalBio"
                data-test="personal-bio-editor"
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
                :btn-icon="asyncing ? 'LoaderSimple' : null"
                :secondary="false"
                class="footer__right-button"
                @click="save"
                data-test="confirm-button"
            />
        </div>
    </div>
</template>
<script>
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { patchUser } from '@/api/people.service.ts'

function defaultForm() {
    return {
        shortBio: '',
        professionalBio: '<p></p>',
        personalBio: '<p></p>',
    }
}

export default {
    name: 'ProfileBioEditTab',
    components: {
        TextInput,
        LpiButton,
        TipTapEditor,
    },

    emits: ['profile-edited'],
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

    computed: {
        isSelf() {
            const connectedUser = this.$store.getters['users/userFromApi']
            return connectedUser && this.user.id === connectedUser.id
        },
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
                    professional_description: this.form.professionalBio,
                    personal_description: this.form.personalBio,
                }

                await patchUser(this.user.id, data)
                this.$emit('profile-edited')

                // update store if self
                if (this.isSelf) this.$store.dispatch('users/getUser', this.user.id)
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
                    personalBio: this.user.personal_description || '<p></p>',
                    professionalBio: this.user.professional_description || '<p></p>',
                }
            } else {
                this.form = defaultForm()
            }
            this.editorProfessionalBioKey++
            this.editorPersonalBioKey++
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
