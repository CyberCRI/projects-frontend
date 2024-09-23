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
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'LogoAdminBlock',

    components: {
        AdminBlock,
        ImageEditor,
    },
    setup() {
        const toaster = useToasterStore()
        const organizationsStore = useOrganizationsStore()
        return {
            toaster,
            organizationsStore,
        }
    },

    computed: {
        organization() {
            return this.organizationsStore.current
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

                this.toaster.pushSuccess(this.$t('admin.portal.general.logo-edit.success'))

                await this.organizationsStore.getCurrentOrganization(this.organization.code)
            } catch (error) {
                console.error(error)

                this.toaster.pushError(this.$t('admin.portal.general.logo-edit.error'))
            }
        },
    },
}
</script>
