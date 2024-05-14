<template>
    <div class="settings-layout page-section-extra-wide page-top">
        <h1 class="page-title">{{ $t('notifications.title') }}</h1>

        <TabsLayout :align-left="true" :border="false" :tabs="tabs"></TabsLayout>
    </div>
</template>

<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import NotificationsSettingsTab from './Tabs/NotificationsSettingsTab.vue'

export default {
    name: 'NotificationSettingsPage',
    components: { TabsLayout },

    computed: {
        tabs() {
            return [
                {
                    key: 'notifications-settings',
                    label: this.$t('notifications.tabs.email'),
                    component: NotificationsSettingsTab,
                },
            ]
        },
    },
}
</script>
