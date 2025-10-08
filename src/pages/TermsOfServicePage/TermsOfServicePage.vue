<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'

const organizationsStore = useOrganizations()

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    'Conditions générales d’utilisation',
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="page-section-narrow legal-page terms-of-service page-top">
    <h1 class="page-title">Conditions générales d’utilisation</h1>
    <TipTapOutput
      v-if="false && organizationsStore?.hasTerms"
      :content="organizationsStore?.termsContent"
    />
    <DefaultTermsOfService v-else />
  </div>
</template>
