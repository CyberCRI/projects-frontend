<script setup>
import { getOrganizationByCode } from '@/api/organizations.service'

const { searchFromQuery } = useSearch(null)

const { onboardingTrap } = useOnboardingStatus()
const { t } = useNuxtI18n()

onMounted(async () => {
  onboardingTrap('explore_projects', false)
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
    computed(() => t('browse.page-title')),
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
  <div :key="$route.name" class="page-section-extra-wide browse-layout">
    <SearchBlock :limit="30" show-section-filter :freeze-search="isNavigating" />

    <GlobalSearchTab :search="searchFromQuery" :freeze-search="isNavigating" />
  </div>
</template>

<style lang="scss" scoped>
.browse-layout {
  padding-top: pxToRem(74px);
}
</style>
