<template>
    <div class="form-ctn">
        <!-- first name -->
        <div class="form-group">
            <TextInput
                v-model="form.first_name"
                :label="$t('profile.edit.general.first-name.label')"
                :placeholder="$t('profile.edit.general.first-name.placeholder')"
                @blur="v$.form.first_name.$validate"
            ></TextInput>
            <p v-for="error of v$.form.first_name.$errors" :key="error.$uid" class="error-message">
                {{ error.$message }}
            </p>
        </div>

        <!-- last name -->
        <div class="form-group">
            <TextInput
                v-model="form.last_name"
                :label="$t('profile.edit.general.last-name.label')"
                :placeholder="$t('profile.edit.general.last-name.placeholder')"
                @blur="v$.form.last_name.$validate"
            ></TextInput>
            <p v-for="error of v$.form.last_name.$errors" :key="error.$uid" class="error-message">
                {{ error.$message }}
            </p>
        </div>

        <!-- pronouns -->
        <div class="form-group">
            <TextInput
                v-model="form.pronouns"
                :placeholder="$t('profile.edit.general.pronouns.placeholder')"
            >
                <label>{{ $t('profile.edit.general.pronouns.label') }}</label>
                <p class="notice">{{ $t('profile.edit.general.pronouns.notice') }}</p>
            </TextInput>
        </div>

        <!-- pro email -->
        <div class="form-group">
            <TextInput
                v-model="form.professional_email"
                :label="$t('profile.edit.general.professional-email.label')"
                :placeholder="$t('profile.edit.general.professional-email.placeholder')"
                :disabled="true"
                input-type="email"
                @blur="v$.form.professional_email.$validate"
            ></TextInput>
            <p
                v-for="error of v$.form.professional_email.$errors"
                :key="error.$uid"
                class="error-message"
            >
                {{ error.$message }}
            </p>
        </div>

        <!-- personal email -->
        <div class="form-group">
            <TextInput
                v-model="form.personal_email"
                :label="$t('profile.edit.general.personal-email.label')"
                :placeholder="$t('profile.edit.general.personal-email.placeholder')"
                @blur="v$.form.personal_email.$validate"
                input-type="email"
            ></TextInput>
            <p
                v-for="error of v$.form.personal_email.$errors"
                :key="error.$uid"
                class="error-message"
            >
                {{ error.$message }}
            </p>
        </div>

        <!-- pro number -->
        <div class="form-group">
            <TextInput
                v-model="form.professional_number"
                :label="$t('profile.edit.general.professional-number.label')"
                :placeholder="$t('profile.edit.general.professional-number.placeholder')"
            ></TextInput>
        </div>

        <!-- personal number -->
        <div class="form-group">
            <TextInput
                v-model="form.personal_number"
                :label="$t('profile.edit.general.personal-number.label')"
                :placeholder="$t('profile.edit.general.personal-number.placeholder')"
            ></TextInput>
        </div>

        <!-- website -->
        <div class="form-group">
            <TextInput
                v-model="form.personal_webpage"
                :label="$t('profile.edit.general.personal-webpage.label')"
                :placeholder="$t('profile.edit.general.personal-webpage.placeholder')"
                @blur="v$.form.personal_webpage.$validate"
            ></TextInput>
            <p
                v-for="error of v$.form.personal_webpage.$errors"
                :key="error.$uid"
                class="error-message"
            >
                {{ error.$message }}
            </p>
        </div>

        <!-- linkedin -->
        <div class="form-group">
            <TextInput
                v-model="form.linkedin"
                :label="$t('profile.edit.general.linkedin.label')"
                :placeholder="$t('profile.edit.general.linkedin.placeholder')"
                @blur="v$.form.linkedin.$validate"
            ></TextInput>
            <p v-for="error of v$.form.linkedin.$errors" :key="error.$uid" class="error-message">
                {{ error.$message }}
            </p>
        </div>

        <!-- twitter -->
        <div class="form-group">
            <TextInput
                v-model="form.twitter"
                :label="$t('profile.edit.general.twitter.label')"
                :placeholder="$t('profile.edit.general.twitter.placeholder')"
                @blur="v$.form.twitter.$validate"
            ></TextInput>
            <p v-for="error of v$.form.twitter.$errors" :key="error.$uid" class="error-message">
                {{ error.$message }}
            </p>
        </div>

        <hr class="form-separator" />

        <!-- Picture -->
        <div class="form-group img-ctn">
            <label>{{ $filters.capitalize($t('profile.edit.general.picture.label')) }}</label>
            <div class="img-inner">
                <div class="img-preview">
                    <div class="preview-wrapper-outer">
                        <CroppedImage
                            :alt="`${form.last_name} image`"
                            :contain="true"
                            :image-sizes="form.imageSizes"
                            :src="displayedImage"
                            class="preview-wrapper-inner"
                        />
                    </div>
                </div>
                <div class="img-actions">
                    <ImageInput
                        id="header_image"
                        :label="$t('profile.edit.general.picture.upload-image')"
                        @upload-image="uploadImage"
                    />

                    <LpiButton
                        :label="$t('profile.edit.general.picture.resize-image')"
                        :secondary="true"
                        class="next-patatoid-btn"
                        left-icon="Pen"
                        @click="openImageResizer"
                    />
                </div>
            </div>
        </div>

        <hr class="form-separator" />

        <!-- job title -->
        <div class="form-group">
            <TextInput
                v-model="form.title"
                :label="$t('profile.edit.general.title.label')"
                :placeholder="$t('profile.edit.general.title.placeholder')"
                @blur="v$.form.title.$validate"
            ></TextInput>
            <p v-for="error of v$.form.title.$errors" :key="error.$uid" class="error-message">
                {{ error.$message }}
            </p>
        </div>

        <!-- org address -->
        <div class="form-group">
            <TextInput
                v-model="form.location"
                :label="$t('profile.edit.general.organization-address.label')"
                :placeholder="$t('profile.edit.general.organization-address.placeholder')"
                input-type="textarea"
            ></TextInput>
        </div>

        <hr class="form-separator" />

        <!-- SDGs -->
        <div class="form-group">
            <div class="label-wrapper">
                <label
                    >{{ $filters.capitalize($t('profile.edit.general.sdgs.label')) }} ({{
                        form.sdgs ? form.sdgs.length : '0'
                    }})</label
                >

                <LpiButton
                    :label="$t('profile.edit.general.sdgs.add')"
                    :secondary="true"
                    :no-border="true"
                    :no-margin="true"
                    left-icon="Plus"
                    @click="openSdgsDrawer"
                />
            </div>
            <p class="notice">
                {{ $t('profile.edit.general.sdgs.notice-start') }}
                <a :href="$t('profile.edit.general.sdgs.link')" target="_blank" class="link"
                    >{{ $t('profile.edit.general.sdgs.notice-link') }}
                </a>
                {{ $t('profile.edit.general.sdgs.notice-end') }}
            </p>
            <div class="sdgs-list" v-if="form.sdgs && form.sdgs.length">
                <img
                    v-for="sdg in form.sdgs"
                    :key="sdg"
                    :alt="sdg"
                    :src="`${PUBLIC_BINARIES_PREFIX}/sdgs/logo/SDG-${sdg}.svg`"
                    class="sdg-picture"
                />
            </div>
        </div>

        <hr class="form-separator" />
        <p class="error-message" v-if="v$.$errors.length">
            {{ $t('profile.edit.general.form-has-error') }}
        </p>
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
                :disabled="v$.$errors.length || asyncing"
                :label="$filters.capitalize($t('common.confirm'))"
                :left-icon="asyncing ? 'LoaderSimple' : null"
                :secondary="false"
                class="footer__right-button"
                @click="save"
                data-test="confirm-button"
            />
        </div>
    </div>
    <!-- image resizer -->
    <DrawerLayout
        :confirm-action-name="$t('common.confirm')"
        :is-opened="showImageResizer"
        :title="$t('project.form.resize-image')"
        class="medium"
        @close="showImageResizer = false"
        @confirm="saveImageSizes"
    >
        <ImageResizer
            v-if="showImageResizer"
            ref="imageResizer"
            :image="displayedImage"
            :image-sizes="form.imageSizes"
        />
    </DrawerLayout>
    <!-- tags selector -->
    <DrawerLayout
        :confirm-action-name="$t('common.confirm')"
        :is-opened="showTagsDrawer"
        :title="$t('profile.edit.general.tags.label')"
        class="medium"
        @close="showTagsDrawer = false"
        @confirm="selectTags"
    >
        <TagsFilterEditor
            v-if="showTagsDrawer"
            :hide-organization-tags="true"
            v-model="tagsSelection"
        />
    </DrawerLayout>
    <!-- sdgss selector -->
    <DrawerLayout
        :confirm-action-name="$t('common.confirm')"
        :is-opened="showSdgsDrawer"
        :title="$t('profile.edit.general.sdgs.label')"
        class="medium"
        @close="showSdgsDrawer = false"
        @confirm="selectSdgs"
    >
        <SdgsFilter v-if="showSdgsDrawer" v-model="sdgsSelection" />
    </DrawerLayout>

    <ConfirmModal
        v-if="showCancelConfirmModal"
        :content="$t('profile.cancel-content')"
        :title="$t('profile.cancel-title')"
        @cancel="showCancelConfirmModal = false"
        @confirm="resetAndLeaveEditPage"
    />
</template>
<script>
import TextInput from '@/components/lpikit/TextInput/TextInput.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ImageResizer from '@/components/lpikit/ImageResizer/ImageResizer.vue'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import ImageInput from '@/components/lpikit/ImageInput/ImageInput.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import TagsFilterEditor from '@/components/peopleKit/Filters/TagsFilterEditor.vue'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import SdgsFilter from '@/components/peopleKit/Filters/SdgsFilter.vue'

import useVuelidate from '@vuelidate/core'
import { helpers, required, email, url } from '@vuelidate/validators'
import { patchUser, patchUserPicture, postUserPicture } from '@/api/people.service.ts'
import isEqual from 'lodash.isequal'

import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'
import utils from '@/functs/functions.ts'

function defaultForm() {
    return {
        pronouns: '',
        first_name: '',
        last_name: '',
        professional_email: '',
        personal_email: '',
        professional_number: '',
        personal_number: '',
        personal_webpage: '',
        linkedin: '',
        twitter: '',
        picture: '',
        imageSizes: null,
        title: '',
        location: '',
        tags: [],
        sdgs: [],
    }
}

export default {
    name: 'ProfileGeneralEditTab',
    components: {
        ConfirmModal,
        TextInput,
        LpiButton,
        ImageResizer,
        CroppedImage,
        ImageInput,
        TagsFilterEditor,
        DrawerLayout,
        SdgsFilter,
    },
    mixins: [imageMixin],
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            form: defaultForm(),
            asyncing: false,
            displayedImage: '',
            showImageResizer: false,
            showTagsDrawer: false,
            tagsSelection: [],
            showSdgsDrawer: false,
            sdgsSelection: [],
            v$: useVuelidate(),
            showCancelConfirmModal: false,
        }
    },

    validations() {
        return {
            form: {
                first_name: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.general.first-name.is-required'),
                        required
                    ),
                },
                last_name: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.general.last-name.is-required'),
                        required
                    ),
                },
                professional_email: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.general.professional-email.is-required'),
                        required
                    ),
                    email: helpers.withMessage(
                        this.$t('profile.edit.general.professional-email.is-email'),
                        email
                    ),
                },
                personal_email: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.general.personal-email.is-required'),
                        required
                    ),
                    email: helpers.withMessage(
                        this.$t('profile.edit.general.personal-email.is-email'),
                        email
                    ),
                },
                title: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.general.title.is-required'),
                        required
                    ),
                },
                personal_webpage: {
                    url: helpers.withMessage(
                        this.$t('profile.edit.general.personal-webpage.is-url'),
                        url
                    ),
                },
                linkedin: {
                    url: helpers.withMessage(this.$t('profile.edit.general.linkedin.is-url'), url),
                },
                twitter: {
                    url: helpers.withMessage(this.$t('profile.edit.general.twitter.is-url'), url),
                },
            },
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

    computed: {
        hasFormChanged() {
            return this.v$.$anyDirty
        },
        isSelf() {
            const connectedUser = this.$store.getters['users/userFromApi']
            return connectedUser && this.user.keycloak_id === connectedUser.keycloak_id
        },
    },

    methods: {
        cancel() {
            if (this.hasFormChanged) {
                this.showCancelConfirmModal = true
            } else {
                this.resetForm()
                this.$router.push('/profile')
            }
        },

        resetAndLeaveEditPage() {
            this.resetForm()
            this.$router.push('/profile')
        },

        async save() {
            this.asyncing = true
            const isValid = await this.v$.$validate()
            try {
                if (isValid) {
                    const data = {
                        pronouns: this.form.pronouns,
                        given_name: this.form.first_name,
                        family_name: this.form.last_name,
                        email: this.form.professional_email,
                        personal_email: this.form.personal_email,
                        landline_phone: this.form.professional_number,
                        mobile_phone: this.form.personal_number,
                        website: this.form.personal_webpage,
                        linkedin: this.form.linkedin,
                        twitter: this.form.twitter,
                        job: this.form.title,
                        location: this.form.location,
                        sdgs: this.form.sdgs,
                        // TODO: tags ???
                        // TODO: "facebook": "string",
                        // TODO: "medium": "string",
                        // TODO: "skype": "string",
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
                this.asyncing = false
                if (isValid) {
                    if (this.isSelf) this.$router.push({ name: 'Profile' })
                    else
                        this.$router.push({
                            name: 'ProfileOtherUser',
                            params: { userKId: this.user.keycloak_id },
                        })
                }
            }
        },
        async resetForm() {
            if (this.user) {
                this.form = {
                    pronouns: this.user.pronouns || '',
                    first_name: this.user.given_name,
                    last_name: this.user.family_name,
                    professional_email: this.user.email,
                    personal_email: this.user.personal_email || '',
                    professional_number: this.user.landline_phone || '',
                    personal_number: this.user.mobile_phone || '',
                    personal_webpage: this.user.website || '',
                    linkedin: this.user.linkedin || '',
                    twitter: this.user.twitter || '',
                    picture: this.user.profile_picture?.url || (await utils.getPatatoidFile(1)),
                    imageSizes: pictureApiToImageSizes(this.user.profile_picture),

                    title: this.user.job || '',
                    location: this.user.location || '',
                    tags: [], // TODO
                    sdgs: this.user.sdgs || [],
                }
                this.displayedImage =
                    this.user.profile_picture?.url ||
                    `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
            } else {
                this.form = defaultForm()
            }
        },
        uploadImage(image) {
            this.displayedImage = ''

            const fileReader = new FileReader()
            fileReader.readAsDataURL(image)

            fileReader.onload = (fileReaderEvent) => {
                this.displayedImage = fileReaderEvent.target.result
            }

            this.form.picture = image
            // reinit image cropping data
            this.form.imageSizes = null
        },

        saveImageSizes() {
            this.form.imageSizes = {
                scaleX: this.$refs.imageResizer.scaleX,
                scaleY: this.$refs.imageResizer.scaleY,
                left: this.$refs.imageResizer.left,
                top: this.$refs.imageResizer.top,
                naturalRatio: this.$refs.imageResizer.naturalRatio,
            }
            this.showImageResizer = false
        },

        openImageResizer() {
            this.showImageResizer = true
        },

        selectTags() {
            this.form.tags = [...this.tagsSelection]
            this.showTagsDrawer = false
        },

        openSdgsDrawer() {
            this.sdgsSelection = [...this.form.sdgs]
            this.showSdgsDrawer = true
        },

        selectSdgs() {
            this.form.sdgs = [...this.sdgsSelection]
            this.showSdgsDrawer = false
        },
    },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.img-ctn {
    margin-bottom: $space-xl;
    display: flex;
    flex-direction: column;
    align-items: center;

    label {
        align-self: flex-start;
    }

    .img-inner {
        width: 100%;
        display: flex;
        gap: $space-m;

        .img-preview,
        .img-actions {
            flex-basis: 50%;
            flex-grow: 1;
        }

        .img-actions {
            display: flex;
            flex-flow: column;
            gap: $space-m;
            justify-content: center;
            align-items: flex-start;
        }

        .img-preview {
            border-radius: 100%;
            border: $border-width-s solid $green;
            background-color: $white;
            overflow: hidden;
        }
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
}

.tags-list,
.sdgs-list {
    display: flex;
    flex-wrap: wrap;
    gap: $space-m;
    margin-top: $space-m;
}

.sdg-picture {
    display: inline-block;
    width: $font-size-4xl;
    height: $font-size-4xl;
}

.form-actions {
    position: sticky;
    bottom: 0;
    background-color: white;
}

.link {
    display: inline-flex;
    font-weight: bold;
    text-decoration: underline;
    color: $primary-dark;
    cursor: pointer;
}
</style>
