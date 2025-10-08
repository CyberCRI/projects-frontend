<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'
const { t } = useI18n()
const organizationsStore = useOrganizations()

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('tos.title')),
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
    <h1 class="page-title">{{ $t('tos.title') }}</h1>
    <TipTapOutput v-if="organizationsStore?.hasTerms" :content="organizationsStore?.termsContent" />
    <DefaultTermsOfService v-else />
  </div>
</template>
