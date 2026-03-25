<script setup lang="ts">
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

useLpiHead2({
  title: computed(() => t('common.people')),
})
</script>

<template>
  <div class="page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $t('common.people') }}
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
