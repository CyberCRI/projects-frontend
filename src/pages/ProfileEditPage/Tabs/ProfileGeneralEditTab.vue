<template>
    <div class="form-ctn">
        <!-- first name -->
        <div class="form-group">
            <TextInput
                v-model="form.first_name"
                :label="$t('profile.edit.general.first-name.label')"
                :placeholder="$t('profile.edit.general.first-name.placeholder')"
                @blur="v$.form.first_name.$validate"
                data-test="first-name-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.first_name.$errors" />
        </div>

        <!-- last name -->
        <div class="form-group">
            <TextInput
                v-model="form.last_name"
                :label="$t('profile.edit.general.last-name.label')"
                :placeholder="$t('profile.edit.general.last-name.placeholder')"
                @blur="v$.form.last_name.$validate"
                data-test="last-name-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.last_name.$errors" />
        </div>

        <!-- pronouns -->
        <div class="form-group">
            <TextInput
                v-model="form.pronouns"
                :placeholder="$t('profile.edit.general.pronouns.placeholder')"
                data-test="pronouns-input"
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
            <FieldErrors :errors="v$.form.professional_email.$errors" />
        </div>

        <!-- pro number -->
        <div class="form-group">
            <TextInput
                v-model="form.professional_number"
                :label="$t('profile.edit.general.professional-number.label')"
                :placeholder="$t('profile.edit.general.professional-number.placeholder')"
                data-test="professional-number-input"
            ></TextInput>
        </div>

        <!-- personal number -->
        <div class="form-group">
            <TextInput
                v-model="form.personal_number"
                :label="$t('profile.edit.general.personal-number.label')"
                :placeholder="$t('profile.edit.general.personal-number.placeholder')"
                data-test="personal-number-input"
            ></TextInput>
        </div>

        <!-- website -->
        <div class="form-group">
            <TextInput
                v-model="form.personal_webpage"
                :label="$t('profile.edit.general.personal-webpage.label')"
                :placeholder="$t('profile.edit.general.personal-webpage.placeholder')"
                @blur="v$.form.personal_webpage.$validate"
                data-test="personal-webpage-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.personal_webpage.$errors" />
        </div>

        <!-- linkedin -->
        <div class="form-group">
            <TextInput
                v-model="form.linkedin"
                :label="$t('profile.edit.general.linkedin.label')"
                :placeholder="$t('profile.edit.general.linkedin.placeholder')"
                @blur="v$.form.linkedin.$validate"
                data-test="linkedin-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.linkedin.$errors" />
        </div>

        <!-- twitter -->
        <div class="form-group">
            <TextInput
                v-model="form.twitter"
                :label="$t('profile.edit.general.twitter.label')"
                :placeholder="$t('profile.edit.general.twitter.placeholder')"
                @blur="v$.form.twitter.$validate"
                data-test="twitter-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.twitter.$errors" />
        </div>

        <hr class="form-separator" />

        <!-- Picture -->
        <div class="form-group img-ctn">
            <label>{{ $filters.capitalize($t('profile.edit.general.picture.label')) }}</label>
            <ImageEditor
                :picture-alt="`${form.last_name} image`"
                :contain="true"
                :round-picture="true"
                v-model:imageSizes="form.imageSizes"
                v-model:picture="form.picture"
                :default-picture="`${PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`"
            ></ImageEditor>
        </div>

        <hr class="form-separator" />

        <!-- job title -->
        <div class="form-group">
            <TextInput
                v-model="form.title"
                :label="$t('profile.edit.general.title.label')"
                :placeholder="$t('profile.edit.general.title.placeholder')"
                @blur="v$.form.title.$validate"
                data-test="title-input"
            ></TextInput>
            <FieldErrors :errors="v$.form.title.$errors" />
        </div>

        <!-- org address -->
        <div class="form-group">
            <TextInput
                v-model="form.location"
                :label="$t('profile.edit.general.organization-address.label')"
                :placeholder="$t('profile.edit.general.organization-address.placeholder')"
                input-type="textarea"
                data-test="location-input"
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

                <LinkButton
                    :label="$t('profile.edit.general.sdgs.add')"
                    btn-icon="Plus"
                    @click="openSdgsDrawer"
                    data-test="sdg-add"
                />
            </div>
            <p class="notice">
                {{ $t('profile.edit.general.sdgs.notice-start') }}
                <a :href="$t('profile.edit.general.sdgs.link')" target="_blank" class="link"
                    >{{ $t('profile.edit.general.sdgs.notice-link') }}
                </a>
                {{ $t('profile.edit.general.sdgs.notice-end') }}
            </p>
            <TransitionGroup
                tag="div"
                name="sdg"
                class="sdgs-list"
                v-if="form.sdgs && form.sdgs.length"
            >
                <img
                    v-for="sdg in form.sdgs"
                    :key="sdg"
                    :alt="sdg"
                    :src="`${PUBLIC_BINARIES_PREFIX}/sdgs/logo/SDG-${sdg}.svg`"
                    class="sdg-picture"
                />
            </TransitionGroup>
        </div>

        <hr class="form-separator" />
        <p class="error-message" v-if="v$.$errors.length">
            {{ $t('profile.edit.general.form-has-error') }}
        </p>
        <!-- actions -->
        <div class="form-actions" data-test="main-form">
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
                :btn-icon="asyncing ? 'LoaderSimple' : null"
                class="footer__right-button"
                @click="save"
                data-test="confirm-button"
            />
        </div>
    </div>
    <BaseDrawer
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
    </BaseDrawer>
    <!-- sdgss selector -->
    <BaseDrawer
        :confirm-action-name="$t('common.confirm')"
        :is-opened="showSdgsDrawer"
        :title="$t('profile.edit.general.sdgs.label')"
        class="small"
        @close="showSdgsDrawer = false"
        @confirm="selectSdgs"
        data-test="sdgs-drawer"
    >
        <SdgsFilter v-if="showSdgsDrawer" v-model="sdgsSelection" />
    </BaseDrawer>

    <ConfirmModal
        v-if="showCancelConfirmModal"
        :content="$t('profile.cancel-content')"
        :title="$t('profile.cancel-title')"
        @cancel="showCancelConfirmModal = false"
        @confirm="resetAndLeaveEditPage"
    />
</template>
<script>
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import TagsFilterEditor from '@/components/search/Filters/TagsFilterEditor.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required, email, url } from '@vuelidate/validators'
import { patchUser, patchUserPicture, postUserPicture } from '@/api/people.service.ts'
import isEqual from 'lodash.isequal'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { VALID_NAME_REGEX } from '@/functs/constants.ts'
import useToasterStore from '@/stores/useToaster.ts'

function defaultForm() {
    return {
        pronouns: '',
        first_name: '',
        last_name: '',
        professional_email: '',
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
        TagsFilterEditor,
        BaseDrawer,
        SdgsFilter,
        LinkButton,
        ImageEditor,
        FieldErrors,
    },

    emits: ['profile-edited'],

    mixins: [imageMixin],
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
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
            asyncing: false,
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
                    alphanum: helpers.withMessage(
                        this.$t('profile.edit.general.no-special-characters'),
                        helpers.regex(VALID_NAME_REGEX)
                    ),
                },
                last_name: {
                    required: helpers.withMessage(
                        this.$t('profile.edit.general.last-name.is-required'),
                        required
                    ),
                    alphanum: helpers.withMessage(
                        this.$t('profile.edit.general.no-special-characters'),
                        helpers.regex(VALID_NAME_REGEX)
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
            return connectedUser && this.user.id === connectedUser.id
        },
    },

    methods: {
        cancel() {
            if (this.hasFormChanged) {
                this.showCancelConfirmModal = true
            } else {
                this.resetAndLeaveEditPage()
            }
        },

        resetAndLeaveEditPage() {
            this.resetForm()
            this.redirectToProfile()
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

                    await patchUser(this.user.id, data)

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
                    this.$emit('profile-edited')
                    // give extra time for profile-edited event to be consumed
                    await new Promise((resolve) => setTimeout(resolve, 50))
                    // reload user if self to update store info
                    if (this.isSelf) this.$store.dispatch('users/getUser', this.user.id)
                    // confirm success
                    this.toaster.pushSuccess(this.$t('profile.edit.general.save-success'))
                }
            } catch (error) {
                this.toaster.pushError(`${this.$t('profile.edit.general.save-error')} (${error})`)
                console.error(error)
            } finally {
                this.asyncing = false
                if (isValid) {
                    this.redirectToProfile()
                }
            }
        },

        redirectToProfile() {
            if (this.isSelf) this.$router.push({ name: 'Profile' })
            else
                this.$router.push({
                    name: 'ProfileOtherUser',
                    params: { userId: this.user.id },
                })
        },

        async resetForm() {
            if (this.user) {
                this.form = {
                    pronouns: this.user.pronouns || '',
                    first_name: this.user.given_name,
                    last_name: this.user.family_name,
                    professional_email: this.user.email,
                    professional_number: this.user.landline_phone || '',
                    personal_number: this.user.mobile_phone || '',
                    personal_webpage: this.user.website || '',
                    linkedin: this.user.linkedin || '',
                    twitter: this.user.twitter || '',
                    imageSizes: pictureApiToImageSizes(this.user.profile_picture),

                    title: this.user.job || '',
                    location: this.user.location || '',
                    tags: [], // TODO
                    sdgs: this.user.sdgs || [],
                    picture: this.user.profile_picture,
                }
            } else {
                this.form = defaultForm()
            }
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
}

$sdg-size: $font-size-4xl;

.tags-list,
.sdgs-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax($sdg-size, 1fr));
    gap: $space-m;
    margin-top: $space-m;
}

.sdg-picture {
    display: inline-block;
    width: $sdg-size;
    height: $sdg-size;
}

.sdg-enter-active,
.sdg-leave-active {
    transition: all 0.4s ease;
}

.sdg-enter-from,
.sdg-leave-to {
    transform: scale(0) translateY(200%);
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
