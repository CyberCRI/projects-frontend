<script setup lang="ts">
import type { AllSearchSections } from '~/components/search/Filters/useSectionFilters'

const { onboardingTrap } = useOnboardingStatus()
const { t } = useNuxtI18n()

const route = useRoute()

onMounted(async () => {
  onboardingTrap('explore_projects', false)
})

useLpiHead2({
  title: computed(() => t('browse.page-title')),
})
</script>

<template>
  <div :key="$route.name" class="page-section-extra-wide browse-layout">
    <SearchBlock show-section-filter />

    <GlobalSearchTab
      :search="route.query?.search?.toString()"
      :query="route.query"
      :mode="route.query?.types?.toString() as AllSearchSections"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.browse-layout {
  padding-top: variables.pxtorem(74px);
}
</style>
