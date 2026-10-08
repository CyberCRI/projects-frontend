<script setup lang="ts">
const route = useRoute()

const { t } = useNuxtI18n()

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
      <SearchBlock section="user" />

      <GlobalSearchTab :search="route.query?.search?.toString()" :query="route.query" mode="user" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.main-ctn {
  display: flex;
  flex-direction: column;
}
</style>
