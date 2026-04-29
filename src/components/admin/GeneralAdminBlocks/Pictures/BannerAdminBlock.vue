<template>
  <AdminBlock :block-title="$t('admin.portal.general.public-image')" :is-loading="false">
    <ImageEditor
      picture-alt="welcome picture"
      :contain="true"
      :image-sizes="bannerImageSizes"
      :picture="organization.banner_image"
      :picture-ratio="1 / 1"
      :default-picture="DEFAULT_IMAGE_PATATOID"
      dont-resize-on-change
      @update:image-sizes="resizeBanner($event)"
      @update:picture="setBanner($event)"
    />
  </AdminBlock>
</template>

<script setup lang="ts">
import { postOrganisationBanner, patchOrganisationBanner } from '@/api/organizations.service'
import { pictureApiToImageSizes, imageSizesFormData } from '@/functs/imageSizesUtils'
import { DEFAULT_IMAGE_PATATOID } from '@/composables/usePatatoids'
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import useToasterStore from '@/stores/useToaster'
import AdminBlock from '../AdminBlock.vue'
import { isEqual } from 'es-toolkit'

const { t } = useNuxtI18n()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const organizationCode = useOrganizationCode()
const organization = computed(() => organizationsStore.current)
const bannerImageSizes = computed(() => pictureApiToImageSizes(organization.value?.banner_image))

const setBanner = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file, file.name)

    await postOrganisationBanner({ code: organizationCode, body: formData })

    toaster.pushSuccess(t('admin.portal.general.banner-edit.success'))

    await organizationsStore.getCurrentOrganization(organizationCode)
  } catch (error) {
    console.error(error)

    toaster.pushError(t('admin.portal.general.banner-edit.error'))
  }
}

const resizeBanner = async (imageSizes) => {
  if (!imageSizes) return
  if (!isEqual(imageSizes, pictureApiToImageSizes(organization.value.banner_image))) {
    const formData = new FormData()
    imageSizesFormData(formData, imageSizes)
    try {
      if (organization.value.banner_image?.id) {
        await patchOrganisationBanner(
          organizationCode,
          organization.value.banner_image.id,
          formData
        )
      }
      toaster.pushSuccess(t('admin.portal.general.banner-edit.success'))

      await organizationsStore.getCurrentOrganization(organizationCode)
    } catch (error) {
      console.error(error)

      toaster.pushError(t('admin.portal.general.banner-edit.error'))
    }
  }
}
</script>
