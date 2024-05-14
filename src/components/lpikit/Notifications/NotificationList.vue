<template>
    <div class="notification-list">
        <LpiLoader v-if="isLoading" class="loading" type="simple" />
        <ul v-else-if="notifications.length > 0">
            <NotificationItem
                v-for="(notification, index) in notifications"
                :key="index"
                :notification="notification"
                @go-to="$emit('go-to', notification)"
            />
        </ul>
        <div v-else>
            <p class="empty-notification">{{ $t('notifications.empty') }}</p>
        </div>
    </div>
</template>

<script>
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import NotificationItem from '@/components/lpikit/Notifications/NotificationItem.vue'

export default {
    name: 'NotificationList',

    emits: ['go-to'],

    components: { NotificationItem, LpiLoader },

    props: {
        notifications: {
            type: Array,
            default: () => [],
        },

        isLoading: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50%;
}

.empty-notification {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50%;
    font-weight: 700;
    color: $primary-dark;
    font-size: 20px;
}
</style>
