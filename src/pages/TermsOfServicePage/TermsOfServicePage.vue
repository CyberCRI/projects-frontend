<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'
import useOrganizations from '@/stores/useOrganizations'
const { t } = useI18n()
const organizationsStore = useOrganizations()
const termsDateStr = computed(() =>
  organizationsStore.termsUpdatedAt
    ? new Date(organizationsStore.termsUpdatedAt).toLocaleString()
    : ''
)
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
    <section v-if="organizationsStore?.hasTerms">
      <TipTapOutput :content="organizationsStore?.termsContentTranslated" />
    </section>
    <DefaultTermsOfService v-else />
    <p v-if="termsDateStr" class="terms-version">
      {{ $t('admin.terms.version') }} {{ termsDateStr }}
    </p>
  </div>
</template>
<style scoped lang="scss">
.terms-version {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: right;
  color: $mid-gray;
}
</style>
