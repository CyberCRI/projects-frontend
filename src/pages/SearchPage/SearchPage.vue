<script setup lang="ts">
import type { QueryFilterSearch } from 'shared-projects-frontend/models'

const { onboardingTrap } = useOnboardingStatus()
const { t } = useNuxtI18n()

const route = useRoute()

onMounted(async () => {
  onboardingTrap('explore_projects', false)
})

useLpiHead2({
  title: computed(() => t('browse.page-title')),
})
const query = ref<QueryFilterSearch>({})
const search = ref('')
const section = computed(() => (query.value?.types || route?.query?.types || 'all').toString())
</script>

<template>
  <div :key="$route.name" class="page-section-extra-wide browse-layout">
    <SearchBlock
      show-section-filter
      :section="section"
      @on-query="query = $event"
      @on-search="search = $event"
    />

    <GlobalSearchTab :search="search" :query="query" :mode="section" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.browse-layout {
  padding-top: variables.pxtorem(74px);
}
</style>
