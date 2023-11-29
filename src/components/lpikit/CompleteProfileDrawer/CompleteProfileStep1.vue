<template>
    <ProfileEditBlock :block-title="$t('complete-profile.personal.title')">
        <div class="two-columns">
            <!-- personal -->
            <div class="column">
                <label class="field-title">{{ $t('complete-profile.personal.firstname') }} *</label>
                <input
                    type="text"
                    :placeholder="$t('complete-profile.personal.firstname-placeholder')"
                    v-model="form.given_name"
                />
                <label class="field-title">{{ $t('complete-profile.personal.lastname') }} *</label>
                <input
                    type="text"
                    :placeholder="$t('complete-profile.personal.lastname-placeholder')"
                    v-model="form.family_name"
                />

                <label class="field-title">{{ $t('complete-profile.personal.email') }} *</label>
                <input
                    type="email"
                    œ
                    :placeholder="$t('complete-profile.personal.email-placeholder')"
                    :value="user?.email"
                    disabled
                />

                <label class="field-title">{{ $t('complete-profile.personal.headline') }} *</label>
                <input
                    type="text"
                    :placeholder="$t('complete-profile.personal.headline-placeholder')"
                    v-model="form.job"
                />
            </div>
            <div class="column">
                <label class="field-title">{{ $t('complete-profile.personal.picture') }}</label>
                <p class="field-notice">
                    {{ $t('complete-profile.personal.picture-notice') }}
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
    <ProfileEditBlock :block-title="$t('complete-profile.skills.title')">
        <div class="one-column">
            <div class="column">
                <label class="field-title">{{ $t('complete-profile.skills.sdg') }} *</label>
                <p class="field-notice">{{ $t('complete-profile.skills.sdg-notice') }}</p>

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
        <i18n-t tag="p" keypath="complete-profile.bio.notice" class="section-notice">
            <a class="link bio-exemple-link" href="#">{{
                $t('complete-profile.bio.exemples.researcher')
            }}</a>
            <a class="link bio-exemple-link" href="#">{{
                $t('complete-profile.bio.exemples.professional')
            }}</a>
            <a class="link bio-exemple-link" href="#">{{
                $t('complete-profile.bio.exemples.student')
            }}</a>
        </i18n-t>
        <div class="two-columns">
            <!-- short bios -->
            <div class="column">
                <label class="field-title">{{ $t('complete-profile.bio.short-bio') }} </label>
                <p class="field-notice">
                    {{ $t('complete-profile.bio.short-bio-notice') }}
                </p>
                <textarea
                    rows="2"
                    :placeholder="$t('complete-profile.bio.short-bio-placeholder')"
                    v-model="form.short_description"
                ></textarea>
                <label class="field-title">{{ $t('complete-profile.bio.personal-bio') }} </label>
                <p class="field-notice">
                    {{ $t('complete-profile.bio.personal-bio-notice') }}
                </p>

                <TipTapEditor
                    :key="personalBioKey"
                    :save-icon-visible="false"
                    :socket="false"
                    :ws-data="personalBio"
                    class="html-input"
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
                    :socket="false"
                    :ws-data="longBio"
                    class="html-input flex-grow"
                    mode="none"
                    @update="updateLongBio"
                />
            </div>
        </div>
    </ProfileEditBlock>
</template>
<script>
import ProfileEditBlock from '@/components/lpikit/CompleteProfileDrawer/ProfileEditBlock.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import allSdgs from '@/data/sdgs.json'
import { getUser, patchUser, patchUserPicture, postUserPicture } from '@/api/people.service.ts'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'
import ImageEditor from '@/components/lpikit/ImageEditor/ImageEditor.vue'

import TipTapEditor from '@/components/lpikit/TextEditor/TipTapEditor.vue'

export default {
    name: 'CompleteProfileStep1',

    emits: ['saving'],

    components: {
        ProfileEditBlock,
        IconImage,
        ImageEditor,
        TipTapEditor,
    },

    mixins: [imageMixin],

    data() {
        return {
            user: null,
            sdgs: allSdgs.map((sdg) => ({ ...sdg, selected: false })),

            form: {
                picture: null,
                imageSizes: null,
                given_name: '',
                family_name: '',
                job: '',
                short_description: '',
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
        }
    },

    computed: {
        lang() {
            return this.$store.getters['languages/current']
        },
    },

    async mounted() {
        await this.loadUser()
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.$store.getters['users/kid'])
                this.form.picture = this.user.profile_picture
                this.form.imageSizes = this.user.profile_picture
                    ? pictureApiToImageSizes(this.user.profile_picture)
                    : null
                ;['given_name', 'family_name', 'job', 'short_description'].forEach((field) => {
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
                    sdg.selected = this.user.sdgs.includes(sdg.id)
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
            const isValid = true // await this.v$.$validate() TODO: validation
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
                        short_description: this.form.short_description,
                    }

                    await patchUser(this.user.keycloak_id, data)

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
                            const picture_id = (
                                await postUserPicture(this.user.keycloak_id, formData)
                            ).id

                            // TODO: make this in POST when backend allows it
                            formData.delete('file')
                            await patchUserPicture(this.user.keycloak_id, picture_id, formData)
                        } else if (this.user.profile_picture && this.user.profile_picture.id) {
                            await patchUserPicture(
                                this.user.keycloak_id,
                                this.user.profile_picture.id,
                                formData
                            )
                        }
                    }
                    // reload user
                    this.$store.dispatch('users/getUser', this.user.keycloak_id)
                    // confirm success
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('profile.edit.general.save-success'),
                        type: 'success',
                    })
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
.profile-edit-block + .profile-edit-block {
    margin-top: 2rem;
}

.section-notice {
    font-size: $font-size-m;
    line-height: 1.5;
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
            border-right: $border-width-s solid $gray-10;
        }

        .column + .column {
            padding-left: pxToRem(62px);
            border-left: $border-width-s solid $gray-10;
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
    border: $border-width-s solid $gray-10;
    box-sizing: border-box;
    border-radius: 0;

    &::placeholder {
        color: $gray-10;
        opacity: 1;
    }

    &[disabled] {
        color: $gray-8;
        background-color: $gray-9;
        cursor: not-allowed;
    }
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
    $sdg-size: pxToRem(50px);

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
        background-color: $green;
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
            box-shadow: 0 0 0 $border-width-m $green;
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
    border: $border-width-s solid $green;
    white-space: nowrap;

    &.grey {
        color: $gray-8;
        border-color: $gray-10;
        background-color: $gray-9;
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
