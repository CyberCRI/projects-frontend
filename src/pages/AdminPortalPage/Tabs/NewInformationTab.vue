<template>
    <div class="information-tab">
        <section>
            <div class="block-container">
                <h4 class="title">{{ $t('admin.portal.general.logo') }}</h4>

                <ImageEditor
                    picture-alt="logo"
                    :contain="true"
                    :image-sizes="logoImageSizes"
                    :picture="organization.logo_image"
                    @update:picture="setLogo($event)"
                    :picture-ratio="1 / 1"
                    no-resize
                ></ImageEditor>
            </div>

            <div class="block-container">
                <h4 class="title">{{ $t('admin.portal.general.public-image') }}</h4>
                <ImageEditor
                    picture-alt="welcome picture"
                    :contain="true"
                    :image-sizes="bannerImageSizes"
                    :picture="organization.banner_image"
                    @update:image-sizes="resizeBanner($event)"
                    @update:picture="setBanner($event)"
                    :picture-ratio="3 / 1"
                    dont-resize-on-change
                ></ImageEditor>
            </div>

            <div class="block-container">
                <h4 class="title">{{ $t('admin.portal.general.wording.title') }}</h4>
                <p class="notice">{{ $t('admin.portal.general.wording.notice') }}</p>

                <div class="sub-container">
                    <h5 class="sub-title">{{ $t('admin.portal.general.wording.fields.title') }}</h5>
                    <p class="sub-field">
                        {{ $t('admin.portal.general.wording.fields.title-placeholder') }}
                    </p>
                </div>
                <div class="sub-container">
                    <h5 class="sub-title">
                        {{ $t('admin.portal.general.wording.fields.description') }}
                    </h5>
                    <p class="sub-field">
                        {{ $t('admin.portal.general.wording.fields.description-placeholder') }}
                    </p>
                </div>
            </div>
        </section>

        <section>
            <EventAdminBlock />

            <InstructionAdminBlock />

            <ChatAdminBlock />

            <NewsAdminBlock />

            <FeaturedProjectAdminBlock />
        </section>
    </div>
</template>

<script>
import {
    postOrganisationBanner,
    patchOrganisationBanner,
    postOrganisationLogo,
} from '@/api/organizations.service'

import EventAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Events/EventAdminBlock.vue'
import InstructionAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Instructions/InstructionAdminBlock.vue'
import NewsAdminBlock from '@/components/lpikit/GeneralAdminBlocks/News/NewsAdminBlock.vue'
import ChatAdminBlock from '@/components/lpikit/GeneralAdminBlocks/Chat/ChatAdminBlock.vue'
import FeaturedProjectAdminBlock from '@/components/lpikit/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminBlock.vue'

import ImageEditor from '@/components/lpikit/ImageEditor/ImageEditor.vue'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'

export default {
    name: 'NewInformationTab',

    components: {
        EventAdminBlock,
        InstructionAdminBlock,
        NewsAdminBlock,
        ChatAdminBlock,
        FeaturedProjectAdminBlock,
        ImageEditor,
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
        bannerImageSizes() {
            return pictureApiToImageSizes(this.organization.banner_image)
        },
        logoImageSizes() {
            return pictureApiToImageSizes(this.organization.logo_image)
        },
    },

    data() {
        return {
            isLoading: false,
        }
    },

    methods: {
        async setLogo(file) {
            try {
                const formData = new FormData()
                formData.append('file', file, file.name)

                await postOrganisationLogo({ code: this.organization.code, body: formData })

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.portal.general.logo-edit.success'),
                    type: 'success',
                })

                await this.$store.dispatch(
                    'organizations/getCurrentOrganization',
                    this.organization.code
                )
            } catch (error) {
                console.error(error)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.portal.general.logo-edit.error'),
                    type: 'error',
                })
            }
        },

        async setBanner(file) {
            try {
                const formData = new FormData()
                formData.append('file', file, file.name)

                await postOrganisationBanner(this.organization.code, formData)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.portal.general.banner-edit.success'),
                    type: 'success',
                })

                await this.$store.dispatch(
                    'organizations/getCurrentOrganization',
                    this.organization.code
                )
            } catch (error) {
                console.error(error)

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('admin.portal.general.banner-edit.error'),
                    type: 'error',
                })
            }
        },

        async resizeBanner(imageSizes) {
            if (!imageSizes) return
            if (!isEqual(imageSizes, pictureApiToImageSizes(this.organization.banner_image))) {
                const formData = new FormData()
                imageSizesFormData(formData, imageSizes)
                try {
                    if (this.organization.banner_image?.id) {
                        await patchOrganisationBanner(
                            this.organization.code,
                            this.organization.banner_image.id,
                            formData
                        )
                    }
                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('admin.portal.general.banner-edit.success'),
                        type: 'success',
                    })

                    await this.$store.dispatch(
                        'organizations/getCurrentOrganization',
                        this.organization.code
                    )
                } catch (error) {
                    console.error(error)

                    this.$store.dispatch('notifications/pushToast', {
                        message: this.$t('admin.portal.general.banner-edit.error'),
                        type: 'error',
                    })
                }
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

    .block-container {
        padding: $space-l 0 $space-xl 0;
        background: $white;
        border-bottom: $border-width-s solid $gray-10;

        &:first-child {
            padding-top: $space-m;
        }

        .title {
            font-size: $font-size-m;
            color: $black;
            font-weight: bold;
            margin: 0 0 $space-l;
        }
    }
}

.sub-container {
    position: relative;
    padding: $space-m 0;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 6rem;
        height: 1px;
        border-bottom: $border-width-s solid $gray-10;
    }

    .sub-title,
    .sub-field {
        font-size: $font-size-m;
        color: $black;
        font-weight: normal;
        margin: $space-m 0;
    }
}

@media (min-width: $min-desktop) {
    .information-tab {
        align-items: stretch;
        flex-direction: row;

        section {
            width: 50%;

            &:last-of-type {
                margin-top: 0;
                margin-left: $space-xl;
            }
        }
    }
}
</style>
