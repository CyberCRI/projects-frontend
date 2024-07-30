<template>
    <div class="loader" v-if="loading">
        <LoaderSimple />
    </div>
    <template v-else>
        <ProfileEditBlock :block-title="$t('complete-profile.personal.title')">
            <div class="two-columns">
                <!-- personal -->
                <div class="column">
                    <label class="field-title"
                        >{{ $t('complete-profile.personal.firstname') }} *</label
                    >
                    <div
                        class="field-with-validation"
                        :class="{
                            valid: !v$.form.given_name.$invalid,
                            invalid: v$.form.given_name.$invalid,
                        }"
                    >
                        <div class="field-decorator">
                            <input
                                type="text"
                                :placeholder="$t('complete-profile.personal.firstname-placeholder')"
                                v-model="form.given_name"
                                @blur="v$.form.given_name.$validate"
                            />
                        </div>
                        <FieldErrors :errors="v$.form.given_name.$errors" />
                    </div>

                    <label class="field-title"
                        >{{ $t('complete-profile.personal.lastname') }} *</label
                    >
                    <div
                        class="field-with-validation"
                        :class="{
                            valid: !v$.form.family_name.$invalid,
                            invalid: v$.form.family_name.$invalid,
                        }"
                    >
                        <div class="field-decorator">
                            <input
                                type="text"
                                :placeholder="$t('complete-profile.personal.lastname-placeholder')"
                                v-model="form.family_name"
                                @blur="v$.form.family_name.$validate"
                            />
                        </div>
                        <FieldErrors :errors="v$.form.family_name.$errors" />
                    </div>

                    <label class="field-title">{{ $t('complete-profile.personal.email') }} *</label>
                    <div
                        class="field-with-validation"
                        :class="{
                            valid: !v$.user.email.$invalid,
                            invalid: v$.user.email.$invalid,
                        }"
                    >
                        <div class="field-decorator">
                            <input
                                type="email"
                                :placeholder="$t('complete-profile.personal.email-placeholder')"
                                :value="user?.email"
                                disabled
                                @blur="v$.user.email.$validate"
                            />
                        </div>
                        <FieldErrors :errors="v$.user.email.$errors" />
                    </div>

                    <label class="field-title"
                        >{{ $t('complete-profile.personal.headline') }} *</label
                    >
                    <div
                        class="field-with-validation"
                        :class="{
                            valid: !v$.form.job.$invalid,
                            invalid: v$.form.job.$invalid,
                        }"
                    >
                        <div class="field-decorator">
                            <input
                                type="text"
                                :placeholder="$t('complete-profile.personal.headline-placeholder')"
                                v-model="form.job"
                                @blur="v$.form.job.$validate"
                            />
                        </div>
                        <FieldErrors :errors="v$.form.job.$errors" />
                    </div>
                </div>

                <div class="column">
                    <label class="field-title">{{ $t('complete-profile.personal.picture') }}</label>
                    <p class="field-notice">
                        <!-- {{ $t('complete-profile.personal.picture-notice') }} -->
                    </p>
                    <!-- picture-->
                    <ImageEditor
                        :picture-alt="`${form.given_name} image`"
                        :contain="true"
                        :round-picture="true"
                        v-model:imageSizes="form.imageSizes"
                        v-model:picture="form.picture"
                        :default-picture="`${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`"
                    >
                    </ImageEditor>
                </div>
            </div>
        </ProfileEditBlock>
        <ProfileEditBlock :block-title="$t('complete-profile.sdgs.title')">
            <p class="section-notice">{{ $t('complete-profile.sdgs.sdg-notice') }}</p>
            <div class="one-column">
                <div class="column">
                    <div class="sdg-grid">
                        <label class="sdg" v-for="sdg in sdgs" :key="sdg.id">
                            <input type="checkbox" class="sdg-checkbox" v-model="sdg.selected" />
                            <span
                                class="sdg-pic"
                                :style="{
                                    'background-image': `url(${PUBLIC_BINARIES_PREFIX}/sdgs/${lang}/${sdg.id}.svg)`,
                                }"
                                @click="toggle"
                            >
                            </span>
                            <IconImage class="sdg-checkmark" name="Check" />
                        </label>
                    </div>
                </div>
            </div>
        </ProfileEditBlock>
        <ProfileEditBlock :block-title="$t('complete-profile.bio.title')">
            <p class="section-notice">
                <span>{{ $t('complete-profile.bio.notice') }}</span
                >&nbsp;<i18n-t
                    v-if="hasBioExemple"
                    tag="span"
                    keypath="complete-profile.bio.notice-exemples"
                    class="section-notice"
                >
                    <a
                        class="link bio-exemple-link"
                        href="#"
                        @click="exempleToShow = researcherSlugOrId"
                        >{{ $t('complete-profile.bio.exemples.researcher') }}</a
                    >
                    <a
                        class="link bio-exemple-link"
                        href="#"
                        @click="exempleToShow = professionalSlugOrId"
                        >{{ $t('complete-profile.bio.exemples.professional') }}</a
                    >
                    <a
                        class="link bio-exemple-link"
                        href="#"
                        @click="exempleToShow = studentSlugOrId"
                        >{{ $t('complete-profile.bio.exemples.student') }}</a
                    >
                </i18n-t>
            </p>
            <div class="two-columns">
                <!-- personal bio -->
                <div class="column">
                    <label class="field-title"
                        >{{ $t('complete-profile.bio.personal-bio') }}
                    </label>
                    <p class="field-notice">
                        {{ $t('complete-profile.bio.personal-bio-notice') }}
                    </p>
                    <TipTapEditor
                        :key="personalBioKey"
                        :save-icon-visible="false"
                        :ws-data="personalBio"
                        class="html-input flex-grow"
                        mode="none"
                        @update="updatePersonalBio"
                    />
                </div>
                <div class="column flexed-column">
                    <!-- long bio -->
                    <label class="field-title">{{ $t('complete-profile.bio.long-bio') }} </label>
                    <p class="field-notice">
                        {{ $t('complete-profile.bio.long-bio-notice') }}
                    </p>
                    <TipTapEditor
                        :key="longBioKey"
                        :save-icon-visible="false"
                        :ws-data="longBio"
                        class="html-input flex-grow"
                        mode="none"
                        @update="updateLongBio"
                    />
                </div>
            </div>
        </ProfileEditBlock>
        <BaseDrawer
            :has-footer="false"
            :is-opened="exempleToShow"
            :title="$t('profile.drawer_title')"
            @close="exempleToShow = null"
        >
            <UserProfile
                v-if="exempleToShow"
                ref="profile-user"
                :can-edit="false"
                :user-id="exempleToShow"
            />
        </BaseDrawer>
    </template>
</template>
<script>
import ProfileEditBlock from '@/components/people/CompleteProfileDrawer/ProfileEditBlock.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import allSdgs from '@/data/sdgs.json'
import { getUser, patchUser, patchUserPicture, postUserPicture } from '@/api/people.service.ts'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import UserProfile from '@/components/people/UserProfile.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import onboardingStatusMixin from '@/mixins/onboardingStatusMixin.ts'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { VALID_NAME_REGEX } from '@/functs/constants.ts'
export default {
    name: 'CompleteProfileStep1',

    emits: ['saving', 'loading', 'invalid'],

    components: {
        ProfileEditBlock,
        IconImage,
        ImageEditor,
        TipTapEditor,
        UserProfile,
        BaseDrawer,
        LoaderSimple,
        FieldErrors,
    },

    mixins: [imageMixin, onboardingStatusMixin],

    data() {
        return {
            v$: useVuelidate(),
            user: null,
            sdgs: allSdgs.map((sdg) => ({ ...sdg, selected: false })),

            form: {
                picture: null,
                imageSizes: null,
                given_name: '',
                family_name: '',
                job: '',
                personal_description: '',
                professional_description: '',
            },
            longBioKey: 0,
            longBio: {
                originalContent: '',
                savedContent: '',
            },
            personalBioKey: 0,
            personalBio: {
                originalContent: '',
                savedContent: '',
            },
            exempleToShow: null,
            loading: false,
        }
    },

    validations() {
        return {
            form: {
                given_name: {
                    required: helpers.withMessage(this.$t('complete-profile.required'), required),
                    alphanum: helpers.withMessage(
                        this.$t('profile.edit.general.no-special-characters'),
                        helpers.regex(VALID_NAME_REGEX)
                    ),
                },
                family_name: {
                    required: helpers.withMessage(this.$t('complete-profile.required'), required),
                    alphanum: helpers.withMessage(
                        this.$t('profile.edit.general.no-special-characters'),
                        helpers.regex(VALID_NAME_REGEX)
                    ),
                },

                job: {
                    required: helpers.withMessage(this.$t('complete-profile.required'), required),
                },
            },
            user: {
                email: {
                    required: helpers.withMessage(this.$t('complete-profile.required'), required),
                },
            },
        }
    },

    computed: {
        lang() {
            return this.$store.getters['languages/current']
        },
        hasBioExemple() {
            return this.researcherSlugOrId && this.professionalSlugOrId && this.studentSlugOrId
        },
        researcherSlugOrId() {
            return import.meta.env.VITE_APP_PROFILE_EXEMPLE_RESEARCHER_SLUG_OR_ID
        },
        professionalSlugOrId() {
            return import.meta.env.VITE_APP_PROFILE_EXEMPLE_PROFESSIONAL_SLUG_OR_ID
        },
        studentSlugOrId() {
            return import.meta.env.VITE_APP_PROFILE_EXEMPLE_STUDENT_SLUG_OR_ID
        },
    },

    async mounted() {
        this.loading = true
        this.$emit('loading', true)
        try {
            await this.loadUser()
        } catch (error) {
            console.error(error)
        } finally {
            this.loading = false
            this.$emit('loading', false)
        }
    },

    watch: {
        'v$.$invalid': {
            handler(neo) {
                this.$emit('invalid', neo)
            },
            immediate: true,
        },
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.$store.getters['users/id'])
                this.form.picture = this.user.profile_picture
                this.form.imageSizes = this.user.profile_picture
                    ? pictureApiToImageSizes(this.user.profile_picture)
                    : null
                ;['given_name', 'family_name', 'job'].forEach((field) => {
                    this.form[field] = this.user[field]
                })

                this.personalBio = {
                    originalContent: this.user.personal_description,
                    savedContent: this.user.personal_description,
                }
                this.longBio = {
                    originalContent: this.user.professional_description,
                    savedContent: this.user.professional_description,
                }

                this.sdgs.forEach((sdg) => {
                    sdg.selected = (this.user.sdgs || []).includes(sdg.id)
                })
            } catch (error) {
                console.error(error)
            }
        },

        updateLongBio(content) {
            this.longBio.savedContent = content
        },
        updatePersonalBio(content) {
            this.personalBio.savedContent = content
        },

        /* eslint-disable-next-line vue/no-unused-properties */
        async save() {
            // this called by CompleteProfileDrawer.vue
            let success = true
            this.$emit('saving', true)
            const isValid = await this.v$.$validate()
            try {
                if (isValid) {
                    const data = {
                        given_name: this.form.given_name,
                        family_name: this.form.family_name,
                        email: this.form.email,
                        job: this.form.job,
                        sdgs: this.sdgs.filter((sdg) => sdg.selected).map((sdg) => sdg.id),
                        professional_description: this.longBio.savedContent,
                        personal_description: this.personalBio.savedContent,
                    }

                    await patchUser(this.user.id, data)

                    // patch user picture if changed
                    if (
                        !this.form.picture?.url ||
                        this.form.picture?.url != this.user.profile_picture?.url ||
                        !isEqual(
                            this.form.imageSizes,
                            pictureApiToImageSizes(this.user.profile_picture)
                        )
                    ) {
                        const formData = new FormData()
                        imageSizesFormData(formData, this.form.imageSizes)

                        if (this.form.picture instanceof File) {
                            formData.append('file', this.form.picture, this.form.picture.name)
                            const picture_id = (await postUserPicture(this.user.id, formData)).id

                            // TODO: make this in POST when backend allows it
                            formData.delete('file')
                            await patchUserPicture(this.user.id, picture_id, formData)
                        } else if (this.user.profile_picture && this.user.profile_picture.id) {
                            await patchUserPicture(
                                this.user.id,
                                this.user.profile_picture.id,
                                formData
                            )
                        }
                    }

                    await this.onboardingTrap('complete_profile', false)

                    // reload user
                    this.$store.dispatch('users/getUser', this.user.id)
                    // confirm success
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('profile.edit.general.save-success'),
                        type: 'success',
                    })
                } else {
                    // invalid
                    success = false
                }
            } catch (error) {
                success = false
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('profile.edit.general.save-error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('saving', false)
            }
            return success
        },
    },
}
</script>
<style scoped lang="scss">
.loader {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.profile-edit-block + .profile-edit-block {
    margin-top: 2rem;
}

.section-notice {
    font-size: $font-size-m;
    margin-bottom: pxToRem(23px);
}

.link {
    color: $primary-dark;
    font-weight: 700;
    text-decoration: underline;

    &:hover {
        text-decoration: none;
    }
}

.two-columns {
    display: flex;
    justify-content: stretch;
    align-items: stretch;

    @media (max-width: $med-tablet) {
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0;
    }

    .column {
        flex-grow: 1;
        flex-basis: 50%;

        &.flexed-column {
            display: flex;
            flex-direction: column;
            justify-content: stretch;

            .flex-grow {
                flex-grow: 1;
            }
        }
    }

    @media (min-width: $med-tablet) {
        .column:first-child {
            padding-right: pxToRem(62px);
            border-right: $border-width-s solid $lighter-gray;
        }

        .column + .column {
            padding-left: pxToRem(62px);
            border-left: $border-width-s solid $lighter-gray;
        }
    }

    @media (max-width: $med-tablet) {
        .column + .column {
            padding-top: pxToRem(21px);
        }
    }
}

.three-columns {
    display: flex;
    gap: pxToRem(130px);
    justify-content: stretch;
    align-items: center;

    @media (max-width: $med-tablet) {
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0;
    }

    .column {
        flex-grow: 1;
        flex-basis: 33.33%;
    }
}

.field-title {
    display: block;
    font-size: $font-size-m;
    font-weight: 700;
    margin-bottom: pxToRem(13px);
}

.field-notice {
    font-size: $font-size-s;
    margin-bottom: pxToRem(13px);
}

.html-input,
input,
textarea {
    display: block;
    width: 100%;
    margin-bottom: pxToRem(21px);
    font-size: 1rem;
    padding: 11px;
    border: $border-width-s solid $lighter-gray;
    box-sizing: border-box;
    border-radius: 0;

    &::placeholder {
        color: $lighter-gray;
        opacity: 1;
    }

    &[disabled] {
        color: $mid-gray;
        background-color: $almost-white;
        cursor: not-allowed;
    }
}

.field-with-validation {
    margin-bottom: pxToRem(21px);

    .field-decorator {
        position: relative;

        &::after {
            content: '';
            display: inline-block;
            width: 1.6rem;
            height: 1.6rem;
            position: absolute;
            top: 50%;
            right: 0.2rem;
            transform: translate(0, -50%);
        }
    }

    input {
        margin-bottom: $space-s;
        padding-right: 2rem;
    }

    &.valid {
        .field-decorator::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-circle</title><path fill="%2300dba7" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" /></svg>');
        }
    }

    &.invalid {
        .field-decorator::after {
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-circle</title><path fill="%23ff9473" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" /></svg>');
        }
    }
}

.html-input {
    height: pxToRem(280px);
}

.picture-block {
    display: flex;
    justify-content: stretch;
    align-items: center;
    width: 100%;
    gap: 2rem;

    .preview {
        border: 1px solid red;
        width: 10rem;
        height: 10rem;
        flex-basis: 10rem;
        flex-shrink: 0;
    }

    .text {
        flex-grow: 1;
    }
}

.sdg-grid {
    $sdg-size: pxToRem(150px);

    margin-top: pxToRem(20px);
    display: grid;
    grid-template-columns: repeat(auto-fill, $sdg-size);
    gap: pxToRem(10px);
    justify-content: space-between;

    .sdg {
        flex-shrink: 0;
        display: inline-block;
        position: relative;
        appearance: none;
        cursor: pointer;
        transition: transform 200ms ease-in-out;

        &:hover {
            transform: scale(1.1);
        }
    }

    .sdg-pic {
        display: inline-block;
        width: $sdg-size;
        height: $sdg-size;
        border-radius: $border-radius-xs;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        position: relative;
        transition: box-shadow 200ms cubic-bezier(0, -1.59, 0.6, 0.59);
    }

    .sdg-checkmark {
        display: inline-block;
        background-color: $primary;
        fill: $white;
        widows: 1rem;
        height: 1rem;
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%) scale(0);
        transition: transform 200ms cubic-bezier(0, -1.59, 0.6, 0.59);
    }

    .sdg-checkbox {
        transform: scale(0);
        opacity: 0;
        position: absolute;

        &:checked + .sdg-pic {
            box-shadow: 0 0 0 $border-width-m $primary;
            transition: box-shadow 200ms cubic-bezier(0.65, 1.23, 1, 1.99);
        }

        &:checked ~ .sdg-checkmark {
            transform: translate(50%, -50%) scale(1);
            transition: transform 200ms cubic-bezier(0.65, 1.23, 1, 1.99);
        }
    }
}

.capsule {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 30px;
    background-color: $white;
    font-size: $font-size-s;
    text-transform: uppercase;
    color: $primary-dark;
    border: $border-width-s solid $primary;
    white-space: nowrap;

    &.grey {
        color: $mid-gray;
        border-color: $lighter-gray;
        background-color: $almost-white;
    }
}

.skill-list {
    margin-top: pxToRem(20px);
    display: flex;
    flex-wrap: wrap;
    gap: pxToRem(10px);
    padding: pxToRem(10px);
    background-color: $primary-lighter;
    border-radius: $border-radius-8;
}
</style>
