<script setup lang="ts">
import NotificationsSettingsTab from './Tabs/NotificationsSettingsTab.vue'
import { getOrganizationByCode } from '@/api/organizations.service'

const { t } = useNuxtI18n()

const tabs = computed(() => [
  {
    key: 'notifications-settings',
    label: t('notifications.tabs.email'),
    component: NotificationsSettingsTab,
  },
])

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('notifications.title')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>

<template>
  <div class="settings-layout page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $t('notifications.title') }}
    </h1>

    <TabsLayout :align-left="true" :border="false" :tabs="tabs" />
  </div>
</template>
