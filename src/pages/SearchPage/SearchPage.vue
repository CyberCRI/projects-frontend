<script setup lang="ts">
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

useLpiHead2({
  title: computed(() => t('browse.page-title')),
})
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
