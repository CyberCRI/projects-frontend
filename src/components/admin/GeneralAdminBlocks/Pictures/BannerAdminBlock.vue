<template>
    <AdminBlock :block-title="$t('admin.portal.general.public-image')" :is-loading="false">
        <ImageEditor
            picture-alt="welcome picture"
            :contain="true"
            :image-sizes="bannerImageSizes"
            :picture="organization.banner_image"
            @update:image-sizes="resizeBanner($event)"
            @update:picture="setBanner($event)"
            :picture-ratio="1 / 1"
            dont-resize-on-change
        ></ImageEditor>
    </AdminBlock>
</template>
<script>
import { postOrganisationBanner, patchOrganisationBanner } from '@/api/organizations.service'
import AdminBlock from '../AdminBlock.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'

export default {
    name: 'BannerAdminBlock',

    components: {
        AdminBlock,
        ImageEditor,
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
        bannerImageSizes() {
            return pictureApiToImageSizes(this.organization?.banner_image)
        },
    },

    methods: {
        async setBanner(file) {
            try {
                const formData = new FormData()
                formData.append('file', file, file.name)

                await postOrganisationBanner({ code: this.organization.code, body: formData })

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
