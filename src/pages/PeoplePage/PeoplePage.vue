<script setup lang="ts">
import type { QueryFilterSearch } from 'shared-projects-frontend/models'

const { t } = useNuxtI18n()

useLpiHead2({
  title: computed(() => t('common.people')),
})

const query = ref<QueryFilterSearch>({})
const search = ref('')
</script>

<template>
  <div class="page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $t('common.people') }}
    </h1>
    <div class="main-ctn">
      <SearchBlock section="user" @on-query="query = $event" @on-search="search = $event" />

      <GlobalSearchTab :search="search" :query="query" mode="user" />
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
