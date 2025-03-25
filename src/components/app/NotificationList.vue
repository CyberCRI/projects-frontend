<template>
  <BaseDrawer
    :custom-style="customNotificationStyle"
    no-footer
    :is-opened="isOpened"
    class="small"
    confirm-action-name=""
    title="Notifications"
    @close="$emit('close')"
  >
    <div class="notification-list">
      <LpiLoader v-if="isLoading" class="loading" type="simple" />
      <ul v-else-if="notifications.length">
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @navigated="$emit('close')"
        />
      </ul>
      <div v-else>
        <p class="empty-notification">
          {{ $t('notifications.empty') }}
        </p>
      </div>
      <div v-if="!isLoading && notifications.length && nextPage" class="load-more">
        <LpiButton
          :disabled="isLoadingMore"
          :btn-icon="isLoadingMore ? 'LoaderSimple' : 'Plus'"
          :label="$t('common.more')"
          @click="loadNextPage"
        />
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
import LpiButton from '@/components//base/button/LpiButton.vue'
import useAPI from '@/composables/useAPI.ts'

export default {
  name: 'NotificationList',

  components: { NotificationItem, LpiLoader, BaseDrawer, LpiButton },

  props: {
    isOpened: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],
  setup() {
    const usersStore = useUsersStore()
    return {
      usersStore,
    }
  },

  data() {
    return {
      customNotificationStyle: {
        maxHeight: 'unset',
        padding: 'unset',
      },
      notifications: [],
      isLoading: false,
      isLoadingMore: false,
      nextPage: null,
    }
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
        const result = await getNotifications({ limit: 20 })
        this.notifications = result.results
        this.nextPage = result.next
        this.usersStore.notificationsCount = 0
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async loadNextPage() {
      if (this.nextPage) {
        this.isLoadingMore = true
        const result = (await useAPI(this.nextPage, {})).data
        this.notifications.push(...result.results)
        this.nextPage = result.next
        this.isLoadingMore = false
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

.load-more {
  display: flex;
  justify-content: center;
  padding-bottom: 2rem;
}
</style>
