<template>
  <AdminBlock :block-title="$t('admin.portal.general.logo')" :is-loading="false">
    <ImageEditor
      picture-alt="logo"
      :contain="true"
      :image-sizes="logoImageSizes"
      :picture="organization.logo_image"
      :picture-ratio="1 / 1"
      no-resize
      @update:picture="setLogo($event)"
    />
  </AdminBlock>
</template>

<script setup lang="ts">
import { postOrganisationLogo } from '~/api/organizations.service'

import ImageEditor from '~/components/base/form/ImageEditor.vue'

import useOrganizationsStore from '~/stores/useOrganizations'
import useToasterStore from '~/stores/useToaster'

import { pictureApiToImageSizes } from '~/functs/imageSizesUtils'
import AdminBlock from '../AdminBlock.vue'

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()
const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()

const organization = computed(() => {
  return organizationsStore.current
})
const logoImageSizes = computed(() => {
  return pictureApiToImageSizes(organization.value?.logo_image)
})

const setLogo = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file, file.name)

    await postOrganisationLogo({ code: organizationCode, body: formData })

    toaster.pushSuccess(t('admin.portal.general.logo-edit.success'))

    await organizationsStore.getCurrentOrganization(organizationCode)
  } catch (error) {
    console.error(error)

    toaster.pushError(t('admin.portal.general.logo-edit.error'))
  }
}
</script>
