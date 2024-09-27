<template>
    <BaseDrawer
        :custom-style="customNotificationStyle"
        :has-footer="false"
        :is-opened="isOpened"
        class="small"
        confirm-action-name=""
        title="Notifications"
        @close="$emit('close')"
    >
        <div class="notification-list">
            <LpiLoader v-if="isLoading" class="loading" type="simple" />
            <ul v-else-if="filteredNotifications.length > 0">
                <NotificationItem
                    v-for="(notification, index) in filteredNotifications"
                    :key="index"
                    :notification="notification"
                    @go-to="$emit('go-to', notification)"
                />
            </ul>
            <div v-else>
                <p class="empty-notification">{{ $t('notifications.empty') }}</p>
            </div>
        </div>
    </BaseDrawer>
</template>

<script>
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import NotificationItem from '@/components/app/NotificationItem.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { getNotifications } from '@/api/notifications.service'
import useUsersStore from '@/stores/useUsers.ts'

export default {
    name: 'NotificationList',

    emits: ['go-to', 'close'],

    components: { NotificationItem, LpiLoader, BaseDrawer },
    setup() {
        const usersStore = useUsersStore()
        return {
            usersStore,
        }
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            customNotificationStyle: {
                maxHeight: 'unset',
                padding: 'unset',
            },
            notifications: [],
            isLoading: false,
        }
    },

    computed: {
        filteredNotifications() {
            return this.notifications.map((notification) => ({
                ...notification,
                icon: !notification.is_viewed ? 'Circle' : null,
                action: () => this.notificationAction(notification),
            }))
        },
    },
    watch: {
        isOpened(isOpened) {
            if (isOpened) {
                this.getNotifications()
            }
        },
    },

    methods: {
        async getNotifications() {
            this.isLoading = true
            try {
                const result = await getNotifications()
                this.notifications = result.results
                this.usersStore.notificationsCount = 0
            } catch (err) {
                console.error(err)
            } finally {
                this.isLoading = false
            }
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
