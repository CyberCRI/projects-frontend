<template>
  <div class="notification-tab">
    <LpiLoader v-if="isLoading" class="loader" type="simple" />
    <div v-for="(notification, index) in switches" v-else :key="index">
      <div class="notification-ctn">
        <div class="labels">
          <h2 class="label">
            {{ notification.label }}
          </h2>
          <p class="sub-label">
            {{ notification.subLabel }}
          </p>
        </div>
        <GroupButton
          v-model="form[notification.settingValue]"
          :options="options"
          @update:model-value="updateNotifications(notification.settingValue)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import GroupButton from '@/components/base/button/GroupButton.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import useUsersStore from '@/stores/useUsers'

const usersStore = useUsersStore()
const form = ref({
  followed_project_has_been_edited: false,
  notify_added_to_project: false,
  project_has_been_commented: false,
  project_has_been_edited: false,
  announcement_published: false,
  project_ready_for_review: false,
  project_has_been_reviewed: false,
  project_has_new_private_message: false,
  comment_received_a_response: false,
  organization_has_new_access_request: false,
  invitation_link_will_expire: false,
  new_instruction: false,
  category_project_created: false,
  category_project_updated: false,
})
const isLoading = ref(true)

const notifications = computed(() => {
  return usersStore.notificationsSettings || {}
})

const { t } = useNuxtI18n()

const options = computed(() => {
  return [
    {
      value: true,
      label: t('notifications.tabs.options.yes'),
    },
    {
      value: false,
      label: t('notifications.tabs.options.no'),
    },
  ]
})

const switches = computed(() => {
  return [
    {
      label: t('notifications.category.project-created'),
      subLabel: t('notifications.category.project-created-sub'),
      value: form.value.category_project_created,
      settingValue: 'category_project_created',
    },
    {
      label: t('notifications.category.project-updated'),
      subLabel: t('notifications.category.project-updated-sub'),
      value: form.value.category_project_updated,
      settingValue: 'category_project_updated',
    },
    {
      label: t('notifications.projects.follow'),
      subLabel: t('notifications.projects.follow-sub'),
      value: form.value.followed_project_has_been_edited,
      settingValue: 'followed_project_has_been_edited',
    },
    {
      label: t('notifications.projects.member'),
      subLabel: t('notifications.projects.member-sub'),
      value: form.value.notify_added_to_project,
      settingValue: 'notify_added_to_project',
    },
    {
      label: t('notifications.projects.comment'),
      subLabel: t('notifications.projects.comment-sub'),
      value: form.value.project_has_been_commented,
      settingValue: 'project_has_been_commented',
    },
    {
      label: t('notifications.projects.internal-message'),
      subLabel: t('notifications.projects.internal-message-sub'),
      value: form.value.project_has_new_private_message,
      settingValue: 'project_has_new_private_message',
    },
    {
      label: t('notifications.projects.project'),
      subLabel: t('notifications.projects.project-sub'),
      value: form.value.project_has_been_edited,
      settingValue: 'project_has_been_edited',
    },
    {
      label: t('notifications.projects.announcement'),
      subLabel: t('notifications.projects.announcement-sub'),
      value: form.value.announcement_published,
      settingValue: 'announcement_published',
    },
    {
      label: t('notifications.projects.review'),
      subLabel: t('notifications.projects.review-sub'),
      value: form.value.project_ready_for_review,
      settingValue: 'project_ready_for_review',
    },
    {
      label: t('notifications.projects.reviewed'),
      subLabel: t('notifications.projects.reviewed-sub'),
      value: form.value.project_has_been_reviewed,
      settingValue: 'project_has_been_reviewed',
    },
    {
      label: t('notifications.projects.reply'),
      subLabel: t('notifications.projects.reply-sub'),
      value: form.value.comment_received_a_response,
      settingValue: 'comment_received_a_response',
    },
    {
      label: t('notifications.organization.access'),
      subLabel: t('notifications.organization.access-sub'),
      value: form.value.organization_has_new_access_request,
      settingValue: 'organization_has_new_access_request',
    },
    {
      label: t('notifications.organization.invitation'),
      subLabel: t('notifications.organization.invitation-sub'),
      value: form.value.invitation_link_will_expire,
      settingValue: 'invitation_link_will_expire',
    },
    {
      label: t('notifications.organization.instruction'),
      subLabel: t('notifications.organization.instruction-sub'),
      value: form.value.new_instruction,
      settingValue: 'new_instruction',
    },
  ]
})

const initNotificationSettings = () => {
  form.value = { ...notifications.value }
  isLoading.value = false
}

const updateNotifications = async (setting) => {
  const payload = {
    ...notifications.value,
  }

  payload[setting] = !notifications.value[setting]

  const body = {
    id: usersStore.id,
    payload: payload,
  }

  await usersStore.patchNotifications(body)
}

onMounted(async () => {
  await usersStore.getNotifications(usersStore.id)
  initNotificationSettings()
})
</script>

<style lang="scss" scoped>
.notification-tab {
  padding: $space-l;
  display: flex;
  flex-direction: column;

  .loader {
    display: flex;
    justify-content: center;
  }

  .notification-ctn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: $space-xl;

    .labels {
      display: flex;
      flex-direction: column;
      margin-bottom: $layout-size-m;

      .sub-label {
        font-size: $font-size-s;
      }

      .label {
        font-size: $font-size-m;
        color: $primary-dark;
      }
    }
  }
}

@media (min-width: $min-tablet) {
  .notification-tab {
    padding: $space-l pxToRem(100px);

    .notification-ctn {
      flex-direction: row;
      justify-content: space-evenly;

      .labels {
        width: 50%;
        margin-bottom: unset;
      }
    }
  }
}
</style>
