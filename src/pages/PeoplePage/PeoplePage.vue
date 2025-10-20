<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'
import { capitalize } from 'es-toolkit'

const { searchFromQuery } = useSearch('people')
const { t } = useNuxtI18n()

const fixedSearch = computed(() => {
  return {
    ...searchFromQuery.value,
    section: 'people',
  }
})

const isNavigating = ref(false)
onBeforeRouteLeave((to, from, next) => {
  isNavigating.value = true
  next()
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
      {{ capitalize($t('common.people')) }}
    </h1>
    <div class="main-ctn">
      <SearchBlock :limit="30" section="people" :freeze-search="isNavigating" />

      <GlobalSearchTab :search="fixedSearch" :freeze-search="isNavigating" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-ctn {
  display: flex;
  flex-direction: column;
}
</style>
