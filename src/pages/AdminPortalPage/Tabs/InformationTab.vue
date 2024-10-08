<template>
    <div class="information-tab">
        <section>
            <div class="block-container">
                <h4 class="title">{{ $t('admin.portal.general.logo') }}</h4>
                <span class="description">
                    {{
                        $t('admin.portal.general.size-min-logo', {
                            minWidth: 250,
                            minHeight: 50,
                        })
                    }}</span
                >
                <img v-if="form.logo_image" :src="form.logo_image.variations.small" />
                <ImageInput id="org_logo" @upload-image="uploadLogo" />
            </div>
        </section>

        <section>
            <div class="block-container form">
                <div>
                    <h4 class="title">{{ $t('form.organization-name') }}</h4>
                    <span class="description">{{ $t('tips.organization-name') }}</span>
                    <TextInput v-model="form.name" class="text-input" @blur="v$.form.name.$touch" />
                    <FieldErrors :errors="v$.form.name.$errors" />
                </div>
                <div>
                    <h4 class="title">{{ $t('form.title') }}</h4>
                    <span class="description">{{ $t('tips.organization-title') }}</span>
                    <TextInput
                        v-model="form.dashboard_title"
                        class="text-input"
                        @blur="v$.form.dashboard_title.$touch"
                    />
                    <FieldErrors :errors="v$.form.dashboard_title.$errors" />
                </div>
                <div>
                    <h4 class="title">{{ $t('form.email') }}</h4>
                    <span class="description">{{ $t('tips.organization-email') }}</span>
                    <TextInput
                        v-model="form.contact_email"
                        class="text-input"
                        @blur="v$.form.contact_email.$touch"
                    />
                    <FieldErrors :errors="v$.form.contact_email.$errors" />
                </div>
                <div>
                    <h4 class="title">{{ $t('form.language') }}</h4>
                    <span class="description">{{ $t('tips.organization-language') }}</span>
                    <LpiSelect
                        v-model="form.language"
                        :options="languageOptions"
                        @blur="v$.form.language.$touch"
                    />
                    <FieldErrors :errors="v$.form.language.$errors" />
                </div>
                <div>
                    <h4 class="title">
                        {{ $filters.capitalize($t('admin.portal.general.portal-referencing')) }}
                    </h4>
                    <span class="description">{{ $t('tips.organization-visibility') }}</span>
                    <GroupButton
                        v-model="form.is_logo_visible_on_parent_dashboard"
                        :options="visibilityOptions"
                        has-icon
                    />
                    <FieldErrors :errors="v$.form.background_color.$errors" />

                    <div v-if="form.is_logo_visible_on_parent_dashboard" class="color-ctn">
                        <span class="description">{{
                            $filters.capitalize($t('tips.organization-logo'))
                        }}</span>

                        <SketchPicker
                            v-model="form.background_color"
                            data-test="input-organization-logo-background"
                            @update:model-value="(value) => (form.background_color = value.hex)"
                        />
                    </div>
                </div>

                <LpiButton
                    :disabled="v$.$errors && v$.$errors.length"
                    :label="$filters.capitalize($t('common.save'))"
                    :btn-icon="isLoading ? 'LoaderSimple' : null"
                    class="save-button"
                    @click="saveData"
                />
            </div>
        </section>
    </div>
</template>

<script>
import { postOrganisationBanner, postOrganisationLogo } from '@/api/organizations.service'

import TextInput from '@/components/base/form/TextInput.vue'
import ImageInput from '@/components/base/form/ImageInput.vue'
import LpiSelect from '@/components/base/form/LpiSelect.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import GroupButton from '@/components/base/button/GroupButton.vue'
import { Sketch } from '@ckpack/vue-color'
import { useVuelidate } from '@vuelidate/core'
import { required, requiredIf, maxLength, email, helpers } from '@vuelidate/validators'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useLanguagesStore from '@/stores/useLanguages'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'InformationTab',

    components: {
        GroupButton,
        TextInput,
        ImageInput,
        LpiSelect,
        LpiButton,
        SketchPicker: Sketch,
        FieldErrors,
    },

    setup() {
        const toaster = useToasterStore()
        const languagesStore = useLanguagesStore()
        const organizationsStore = useOrganizationsStore()
        return {
            toaster,
            v$: useVuelidate(),
            languagesStore,
            organizationsStore,
        }
    },

    computed: {
        languageOptions() {
            return this.languagesStore.all.map((lang) => {
                return {
                    value: lang,
                    label: this.$t(`language.label-${lang}`),
                    selected: this.form.language === lang,
                }
            })
        },

        organization() {
            return this.organizationsStore.current
        },

        visibilityOptions() {
            return [
                {
                    value: true,
                    label: this.$t('admin.portal.general.visible'),
                    iconName: 'Eye',
                },
                {
                    value: false,
                    label: this.$t('admin.portal.general.invisible'),
                    iconName: 'EyeSlash',
                },
            ]
        },
    },

    created() {
        const organizationData = JSON.parse(JSON.stringify(this.organization))
        for (const key in this.form) {
            this.form[key] = organizationData[key]
        }
    },

    data() {
        return {
            isLoading: false,
            organizationLogo: undefined,
            organizationBanner: undefined,
            form: {
                banner_image: {
                    variations: {
                        small: undefined,
                    },
                },
                contact_email: '',
                language: '',
                logo_image: {
                    variations: {
                        small: undefined,
                    },
                },
                name: '',
                dashboard_title: '',
                is_logo_visible_on_parent_dashboard: false,
                background_color: '',
            },
        }
    },
    validations() {
        return {
            form: {
                name: {
                    required: helpers.withMessage(
                        this.$t('admin.form.admin-info.name.required'),
                        required
                    ),
                    maxLength: helpers.withMessage(
                        this.$t('admin.form.admin-info.name.max-length'),
                        maxLength(32)
                    ),
                },
                dashboard_title: {
                    required: helpers.withMessage(
                        this.$t('admin.form.admin-info.dashboard-title.required'),
                        required
                    ),
                    maxLength: helpers.withMessage(
                        this.$t('admin.form.admin-info.dashboard-title.max-length'),
                        maxLength(128)
                    ),
                },
                contact_email: {
                    required: helpers.withMessage(
                        this.$t('admin.form.admin-info.contact-email.required'),
                        required
                    ),
                    email: helpers.withMessage(
                        this.$t('admin.form.admin-info.contact-email.email'),
                        email
                    ),
                },
                language: {
                    required: helpers.withMessage(
                        this.$t('admin.form.admin-info.language.required'),
                        required
                    ),
                },
                background_color: {
                    required: helpers.withMessage(
                        this.$t('admin.form.admin-info.background-color.required-if'),
                        requiredIf(this.form.is_logo_visible_on_parent_dashboard)
                    ),
                },
            },
        }
    },

    methods: {
        async saveData() {
            this.isLoading = true

            const data = { ...this.form }

            if (this.organizationLogo instanceof File) {
                const logoFormData = new FormData()
                logoFormData.append('file', this.organizationLogo, this.organizationLogo.name)
                const apiResponse = await postOrganisationLogo({
                    code: this.organizationsStore.current.code,
                    body: logoFormData,
                })
                data.logo_image_id = apiResponse.id
            }

            if (this.organizationBanner instanceof File) {
                const bannerFormData = new FormData()
                bannerFormData.append('file', this.organizationBanner, this.organizationBanner.name)
                const apiResponse = await postOrganisationBanner({
                    code: this.organizationsStore.current.code,
                    body: bannerFormData,
                })
                data.banner_image_id = apiResponse.id
            }

            try {
                await this.organizationsStore.updateCurrentOrganization(data)
                this.toaster.pushSuccess(this.$t('toasts.organization-general-update.success'))
            } catch (error) {
                this.toaster.pushError(
                    `${this.$t('toasts.organization-general-update.error')} (${error})`
                )
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },

        uploadLogo(image) {
            this.organizationLogo = image

            const fileReader = new FileReader()
            fileReader.readAsDataURL(this.organizationLogo)

            fileReader.onload = (fileReaderEvent) => {
                this.form.logo_image.variations.small = fileReaderEvent.target.result
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.information-tab {
    display: flex;
    flex-direction: column;
    padding: $space-xl 0;

    section:last-of-type {
        margin-top: $space-l;
    }

    .block-container {
        padding: $space-l 0;
        background: $white;
        border-radius: $border-radius-l;

        &:not(:first-of-type) {
            margin-top: $space-l;
        }

        .title {
            font-size: $font-size-l;
            color: $primary-dark;
            font-weight: bold;
            margin: 0 0 $space-l;
        }

        .image-input-ctn {
            margin: $space-m auto 0;
        }

        img {
            max-width: 100%;
        }

        .description {
            display: block;
            margin-bottom: $space-m;
            font-size: $font-size-s;
        }

        button {
            margin: $space-m auto 0;
        }

        .save-button {
            margin-top: $space-2xl;
        }

        .input-container:not(:first-of-type) {
            margin-top: $space-2xl;
        }

        .color-ctn {
            margin-top: $space-m;
        }
    }
}

@media (min-width: $min-desktop) {
    .information-tab {
        align-items: stretch;
        flex-direction: row;

        section {
            width: 50%;

            &:first-of-type {
                .block-container:not(:first-of-type) {
                    margin-top: $space-xl;
                }
            }

            &:last-of-type {
                margin-top: 0;
                margin-left: $space-xl;
            }
        }
    }
}
</style>
