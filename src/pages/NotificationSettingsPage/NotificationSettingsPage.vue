<template>
    <div class="settings-layout narrow-body">
        <h1>{{ $t('notifications.title') }}</h1>

        <TabsLayout :align-left="true" :border="false" :tabs="tabs"></TabsLayout>
    </div>
</template>

<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'
import { defineAsyncComponent } from 'vue'

export default {
    name: 'NotificationSettingsPage',
    components: { TabsLayout },

    computed: {
        tabs() {
            return [
                {
                    key: 'notifications-settings',
                    label: this.$t('notifications.tabs.email'),
                    component: defineAsyncComponent(() =>
                        import('./Tabs/NotificationsSettingsTab.vue')
                    ),
                },
            ]
        },
    },
}
</script>

<style lang="scss" scoped>
.settings-layout {
    max-width: unset;
    margin: auto;

    h1 {
        font-size: $font-size-7xl;
        font-weight: 700;
        text-align: center;
        margin: pxToRem(98px) 0 $space-2xl;
    }

    @media (min-width: $min-tablet) {
        padding: 0 $space-xl;
        max-width: 1200px;
    }
}
</style>
