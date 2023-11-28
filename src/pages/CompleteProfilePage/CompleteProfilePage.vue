<template>
    <div class="complete-profile-page page-section-wide">
        <header>
            <h1 class="title">{{ $t('complete-profile.title') }}</h1>
            <p class="notice">
                {{ $t('complete-profile.notice.intro') }}<br />
                {{ $t('complete-profile.notice.no-idea') }}
                <RouterLink class="link" :to="{ name: 'Help' }">{{
                    $t('complete-profile.notice.help')
                }}</RouterLink>
            </p>
        </header>
        <main>
            <ProfileEditBlock>
                <h2 class="section-title">{{ $t('complete-profile.personal.title') }}</h2>
                <div class="two-columns">
                    <!-- personal -->
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.personal.firstname') }} *</label
                        >
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.personal.firstname-placeholder')"
                            v-model="form.given_name"
                        />
                        <label class="field-title"
                            >{{ $t('complete-profile.personal.lastname') }} *</label
                        >
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.personal.lastname-placeholder')"
                            v-model="form.family_name"
                        />

                        <label class="field-title"
                            >{{ $t('complete-profile.personal.email') }} *</label
                        >
                        <input
                            type="email"
                            œ
                            :placeholder="$t('complete-profile.personal.email-placeholder')"
                            :value="user?.email"
                            disabled
                        />

                        <label class="field-title"
                            >{{ $t('complete-profile.personal.headline') }} *</label
                        >
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.personal.headline-placeholder')"
                            v-model="form.job"
                        />
                    </div>
                    <div class="column">
                        <!-- picture-->
                        <div class="picture-block">
                            <div class="img-preview">
                                <div class="preview-wrapper-outer">
                                    <CroppedImage
                                        :alt="`Profile picture`"
                                        :contain="true"
                                        :image-sizes="form.imageSizes"
                                        :src="displayedImage"
                                        class="preview-wrapper-inner"
                                    />
                                </div>
                            </div>
                            <div class="text">
                                <label class="field-title">{{
                                    $t('complete-profile.personal.picture')
                                }}</label>
                                <p class="field-notice">
                                    {{ $t('complete-profile.personal.picture-notice') }}
                                </p>
                                <LpiButton
                                    secondary
                                    no-border
                                    left-icon="Pen"
                                    :label="$t('complete-profile.personal.picture-modify')"
                                ></LpiButton>
                            </div>
                        </div>
                    </div>
                </div>
            </ProfileEditBlock>
            <ProfileEditBlock>
                <h2 class="section-title">{{ $t('complete-profile.skills.title') }}</h2>
                <div class="two-columns">
                    <!-- sdg -->
                    <div class="column">
                        <label class="field-title">{{ $t('complete-profile.skills.sdg') }} *</label>
                        <p class="field-notice">{{ $t('complete-profile.skills.sdg-notice') }}</p>

                        <div class="sdg-grid">
                            <label class="sdg" v-for="sdg in sdgs" :key="sdg.id">
                                <input
                                    type="checkbox"
                                    class="sdg-checkbox"
                                    v-model="sdg.selected"
                                />
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
                    <!-- skills -->
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.skills.skills') }} *</label
                        >
                        <p class="field-notice">
                            {{ $t('complete-profile.skills.skills-notice') }}
                        </p>
                        <input
                            type="text"
                            :placeholder="$t('complete-profile.skills.skills-placeholder')"
                        />
                        <div class="no-skill">
                            <span class="capsule grey">No tag yet</span>
                        </div>
                        <div class="skill-list">
                            <span class="capsule" v-for="skill in skills" :key="skill">{{
                                skill
                            }}</span>
                        </div>
                    </div>
                </div>
            </ProfileEditBlock>
            <ProfileEditBlock>
                <h2 class="section-title">{{ $t('complete-profile.bio.title') }}</h2>
                <p class="section-notice">
                    {{ $t('complete-profile.bio.notice') }}
                </p>
                <div class="two-columns">
                    <!-- short bios -->
                    <div class="column">
                        <label class="field-title"
                            >{{ $t('complete-profile.bio.short-bio') }}
                        </label>
                        <p class="field-notice">
                            {{ $t('complete-profile.bio.short-bio-notice') }}
                        </p>
                        <textarea
                            rows="2"
                            :placeholder="$t('complete-profile.bio.short-bio-placeholder')"
                            v-model="form.short_description"
                        ></textarea>
                        <label class="field-title"
                            >{{ $t('complete-profile.bio.personal-bio') }}
                        </label>
                        <p class="field-notice">
                            {{ $t('complete-profile.bio.personal-bio-notice') }}
                        </p>

                        <textarea
                            rows="8"
                            :placeholder="$t('complete-profile.bio.personal-bio-placeholder')"
                            v-model="form.personal_description"
                        ></textarea>
                    </div>
                    <div class="column">
                        <!-- long bio -->
                        <label class="field-title"
                            >{{ $t('complete-profile.bio.long-bio') }}
                        </label>
                        <p class="field-notice">
                            {{ $t('complete-profile.bio.long-bio-notice') }}
                        </p>
                        <textarea
                            rows="15"
                            :placeholder="$t('complete-profile.bio.long-bio-placeholder')"
                            v-model="form.professional_description"
                        ></textarea>
                    </div>
                </div>
            </ProfileEditBlock>
            <ProfileEditBlock>
                <!-- resources -->
                <div class="three-columns">
                    <div class="column">
                        <h2 class="section-title">
                            {{ $t('complete-profile.resources.title') }} (0)
                        </h2>
                    </div>
                    <div class="column">
                        <p class="section-notice">{{ $t('complete-profile.resources.notice') }}</p>
                    </div>
                    <div class="column">
                        <LpiButton
                            secondary
                            no-border
                            left-icon="Plus"
                            :label="$t('complete-profile.resources.add')"
                        ></LpiButton>
                    </div>
                </div>
            </ProfileEditBlock>
        </main>
        <footer>
            <LpiButton
                @click="cancel"
                secondary
                :label="$t('complete-profile.cancel')"
                :disabled="saving"
            ></LpiButton>

            <LpiButton
                @click="save"
                :label="$t('complete-profile.save-and-next')"
                :left-icon="saving ? 'LoaderSimple' : undefined"
                :disabled="saving"
            ></LpiButton>
        </footer>
    </div>
</template>
<script>
import ProfileEditBlock from './ProfileEditBlock.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import IconImage from '@/components/svgs/IconImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import allSdgs from '@/data/sdgs.json'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import { getUser, patchUser, patchUserPicture, postUserPicture } from '@/api/people.service.ts'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'

export default {
    name: 'CompleteProfilePage',

    components: {
        ProfileEditBlock,
        LpiButton,
        IconImage,
        CroppedImage,
    },

    mixins: [imageMixin],

    data() {
        return {
            user: null,
            saving: false,
            sdgs: allSdgs.map((sdg) => ({ ...sdg, selected: false })),
            skills: [
                'Skill 1',
                'Skill 2',
                'Skill 3',
                'Skill 4',
                'Long Skill 5',
                'Skill 6',
                'Skill 7',
                'Skill 8',
                'Skill 9',
                'Long Skill 10',
                'Long Skill 11',
            ],
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
        }
    },

    computed: {
        lang() {
            return this.$store.getters['languages/current']
        },
        displayedImage() {
            return (
                this.form.picture ||
                `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
            )
        },
    },

    async mounted() {
        await this.loadUser()
    },

    methods: {
        async loadUser() {
            try {
                this.user = await getUser(this.$store.getters['users/kid'])
                this.form.picture = this.user.profile_picture?.url
                this.form.imageSizes = this.user.profile_picture
                    ? pictureApiToImageSizes(this.user.profile_picture)
                    : null
                ;[
                    'given_name',
                    'family_name',
                    'job',
                    'short_description',
                    'personal_description',
                    'professional_description',
                ].forEach((field) => {
                    this.form[field] = this.user[field]
                })

                this.sdgs.forEach((sdg) => {
                    sdg.selected = this.user.sdgs.includes(sdg.id)
                })
            } catch (error) {
                console.error(error)
            }
        },

        async cancel() {
            // TODO: specify and implement
        },

        async save() {
            this.saving = true
            const isValid = true // await this.v$.$validate() TODO: validation
            try {
                if (isValid) {
                    const data = {
                        given_name: this.form.given_name,
                        family_name: this.form.family_name,
                        email: this.form.email,
                        job: this.form.job,
                        sdgs: this.sdgs.filter((sdg) => sdg.selected).map((sdg) => sdg.id),
                        professional_description: this.form.professional_description,
                        personal_description: this.form.personal_description,
                        short_description: this.form.short_description,
                        // TODO: tags
                        // TODO: reources,
                    }

                    await patchUser(this.user.keycloak_id, data)

                    // patch user picture if changed

                    if (
                        this.form.picture != this.user.profile_picture?.url ||
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
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('profile.edit.general.save-error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.saving = false
                if (isValid) {
                    // TODO: next step + save progression
                    // this.redirectToProfile()
                }
            }
            this.saving = false
        },
    },
}
</script>
<style scoped lang="scss">
.complete-profile-page {
    margin-top: $navbar-height;
}

.title {
    font-size: $font-size-5xl;
    line-height: 1;
    margin-bottom: pxToRem(22px);
}

.notice {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: pxToRem(48px);
}

.link {
    color: $primary-dark;
    text-decoration: underline;
    font-weight: 700;
}

.profile-edit-block + .profile-edit-block {
    margin-top: 2rem;
}

.section-title {
    font-size: $font-size-2xl;
    font-weight: 700;
    margin-bottom: 41px;
}

.section-notice {
    font-size: $font-size-m;
    line-height: 1.5;
    margin-bottom: pxToRem(23px);
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

input,
textarea {
    display: block;
    width: 100%;
    margin-bottom: pxToRem(21px);
    font-size: 1rem;
    padding: 11px;
    border: $border-width-s solid $gray-10;
    box-sizing: border-box;

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

$img-preview-size: pxToRem(120px);

.img-preview {
    width: $img-preview-size;
    height: $img-preview-size;
    border-radius: 100%;
    border: $border-width-s solid $green;
    background-color: $white;
    overflow: hidden;
    flex-shrink: 0;
}

.preview-wrapper-outer {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
}

.preview-wrapper-inner {
    position: absolute;
    inset: 0;
}

footer {
    border-top: $border-width-m solid $gray-10;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: pxToRem(28px) 0;
    margin-top: pxToRem(74px);
}
</style>
