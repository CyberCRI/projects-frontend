<script setup lang="ts">
const { t } = useNuxtI18n()
const tabs = computed(() => [
  {
    key: 'stats-all',
    label: t('home.all-projects'),
    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
    props: { filter: 'all' },
  },
  {
    key: 'stats-public',
    label: t('group.visibility-public'),
    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
    props: { filter: 'public' },
  },
  {
    key: 'stats-private',
    label: t('group.visibility-private'),
    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
    props: { filter: 'private' },
  },
  {
    key: 'stats-community',
    label: t('group.visibility-org'),
    component: defineAsyncComponent(() => import('./Tabs/StatsByTab.vue')),
    props: { filter: 'org' },
  },
])

useLpiHead2({
  title: computed(() => t('stats.page-title')),
})
</script>

<template>
  <div class="page-section-wide page-top">
    <h1 class="page-title">
      {{ $t('stats.page-title') }}
    </h1>
    <LazyTabsLayout :tabs="tabs" :align-left="true" class="stats-tab" />
  </div>
</template>

<style lang="scss" scoped>
.stats-tab {
  margin-top: 70px;
}
</style>
