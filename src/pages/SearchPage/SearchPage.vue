<script setup lang="ts">
const { query, search } = useSearch(null)

const { onboardingTrap } = useOnboardingStatus()
const { t } = useNuxtI18n()

onMounted(async () => {
  onboardingTrap('explore_projects', false)
})

useLpiHead2({
  title: computed(() => t('browse.page-title')),
})
</script>

<template>
  <div :key="$route.name" class="page-section-extra-wide browse-layout">
    <SearchBlock :limit="30" show-section-filter />

    <GlobalSearchTab :search="search" :query="query" mode="global" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.browse-layout {
  padding-top: variables.pxtorem(74px);
}
</style>
