<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'

const { searchFromQuery } = useSearch('people')
const { t } = useI18n()

const fixedSearch = computed(() => {
  return {
    ...searchFromQuery.value,
    section: 'people',
  }
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('common.people')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>

<template>
  <div class="page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $filters.capitalize($t('common.people')) }}
    </h1>
    <div class="main-ctn">
      <SearchBlock :limit="30" section="people" />

      <GlobalSearchTab :search="fixedSearch" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-ctn {
  display: flex;
  flex-direction: column;
}
</style>
