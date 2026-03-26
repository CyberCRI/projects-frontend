<script setup lang="ts">
import NotificationsSettingsTab from './Tabs/NotificationsSettingsTab.vue'

const { t } = useNuxtI18n()

const tabs = computed(() => [
  {
    key: 'notifications-settings',
    label: t('notifications.tabs.email'),
    component: NotificationsSettingsTab,
  },
])

useLpiHead2({
  title: computed(() => t('notifications.title')),
})
</script>

<template>
  <div class="settings-layout page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $t('notifications.title') }}
    </h1>

    <TabsLayout :align-left="true" :border="false" :tabs="tabs" />
  </div>
</template>
