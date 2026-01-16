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

<script setup lang="ts">
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import NotificationItem from '@/components/app/NotificationItem.vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { getNotifications } from '@/api/notifications.service'
import useUsersStore from '@/stores/useUsers'
import LpiButton from '@/components//base/button/LpiButton.vue'
import useAPI from '@/composables/useAPI'

const props = withDefaults(defineProps<{ isOpened?: boolean }>(), { isOpened: false })

defineEmits<{ close: [] }>()
const usersStore = useUsersStore()
const customNotificationStyle = ref({
  maxHeight: 'unset',
  padding: 'unset',
})
const notifications = ref([])
const isLoading = ref(false)
const isLoadingMore = ref(false)
const nextPage = ref(null)

watchEffect(() => {
  if (props.isOpened) {
    localGetNotifications()
  }
})

const localGetNotifications = async () => {
  isLoading.value = true
  try {
    const result = await getNotifications({ limit: 20 })
    notifications.value = result.results
    nextPage.value = result.next
    usersStore.notificationsCount = 0
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const loadNextPage = async () => {
  if (nextPage.value) {
    isLoadingMore.value = true
    const result = (await useAPI(nextPage.value, {})).data
    notifications.value.push(...result.results)
    nextPage.value = result.next
    isLoadingMore.value = false
  }
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
