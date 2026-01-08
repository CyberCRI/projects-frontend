<script setup>
import { defineAsyncComponent } from 'vue'
import { getOrganizationByCode } from '@/api/organizations.service'

const { t } = useNuxtI18n()
const tabs = computed(() =>
  import.meta.client
    ? [
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
      ]
    : []
)

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('stats.page-title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
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
