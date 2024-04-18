<template>
    <AdminBlock :block-title="$t('admin.portal.general.logo')" :is-loading="false">
        <ImageEditor
            picture-alt="logo"
            :contain="true"
            :image-sizes="logoImageSizes"
            :picture="organization.logo_image"
            @update:picture="setLogo($event)"
            :picture-ratio="1 / 1"
            no-resize
        ></ImageEditor>
    </AdminBlock>
</template>
<script>
import { postOrganisationLogo } from '@/api/organizations.service'
import AdminBlock from '../AdminBlock.vue'
import ImageEditor from '@/components/lpikit/ImageEditor/ImageEditor.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

export default {
    name: 'LogoAdminBlock',

    components: {
        AdminBlock,
        ImageEditor,
    },

    computed: {
        organization() {
            return this.$store.getters['organizations/current']
        },
        logoImageSizes() {
            return pictureApiToImageSizes(this.organization?.logo_image)
        },
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
    },
}
</script>
