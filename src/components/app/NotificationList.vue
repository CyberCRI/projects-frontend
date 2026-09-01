<template>
  <BaseDrawer
    :custom-style="{
      maxHeight: 'unset',
      padding: 'unset',
    }"
    no-footer
    :is-opened="isOpened"
    class="small"
    confirm-action-name=""
    title="Notifications"
    @close="$emit('close')"
  >
    <div class="notification-list">
      <FetchLoader :status="status" only-error skeleton>
        <ul>
          <NotificationItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            @navigated="$emit('close')"
          />
        </ul>
        <PaginationButtonsV2 :pagination="pagination" />
        <EmptyLabel v-if="notifications.length === 0" :label="$t('notifications.empty')" />
      </FetchLoader>
    </div>
  </BaseDrawer>
</template>

<script setup lang="ts">
import NotificationItem from '~/components/app/NotificationItem.vue'
import { getNotifications } from '~/api/v2/notifications.service'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { notificationSkeleton } from '~/skeletons/notifications.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import useUsersStore from '~/stores/useUsers'

const props = withDefaults(defineProps<{ isOpened?: boolean }>(), {
  isOpened: false,
})

defineEmits<{ close: [] }>()

const organizationCode = useOrganizationCode()
const userStore = useUsersStore()
const userId = computed(() => userStore.id)

const limitSkeletons = computed(() => maxSkeleton(userStore.user.modules.notifications, 10))

const {
  status,
  data: notifications,
  pagination,
  refresh,
} = getNotifications(organizationCode, userId, {
  query: {
    ordering: '-created',
    is_viewed: false,
  },
  immediate: props.isOpened,
  default: () => factoryPagination(notificationSkeleton, limitSkeletons.value),
})

watchEffect(() => {
  if (props.isOpened) {
    refresh()
  }
})
</script>
