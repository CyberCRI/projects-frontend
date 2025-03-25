<template>
  <AdminBlock :block-title="$t('admin.portal.general.public-image')" :is-loading="false">
    <ImageEditor
      picture-alt="welcome picture"
      :contain="true"
      :image-sizes="bannerImageSizes"
      :picture="organization.banner_image"
      :picture-ratio="1 / 1"
      dont-resize-on-change
      @update:image-sizes="resizeBanner($event)"
      @update:picture="setBanner($event)"
    />
  </AdminBlock>
</template>
<script>
import { postOrganisationBanner, patchOrganisationBanner } from '@/api/organizations.service'
import AdminBlock from '../AdminBlock.vue'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils.ts'
import isEqual from 'lodash.isequal'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'BannerAdminBlock',

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

        this.toaster.pushSuccess(this.$t('admin.portal.general.banner-edit.success'))

        await this.organizationsStore.getCurrentOrganization(this.organization.code)
      } catch (error) {
        console.error(error)

        this.toaster.pushError(this.$t('admin.portal.general.banner-edit.error'))
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
          this.toaster.pushSuccess(this.$t('admin.portal.general.banner-edit.success'))

          await this.organizationsStore.getCurrentOrganization(this.organization.code)
        } catch (error) {
          console.error(error)

          this.toaster.pushError(this.$t('admin.portal.general.banner-edit.error'))
        }
      }
    },
  },
}
</script>
