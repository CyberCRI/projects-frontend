<template>
  <div class="notification-tab">
    <FetchLoader :status="status" only-error skeleton>
      <div v-for="[name, i18n] in Object.entries(NOTIFCATIONS_MAP_I18N)" :key="name">
        <div class="notification-ctn">
          <div class="labels">
            <h2 class="label skeletons-text">
              {{ i18n.label }}
            </h2>
            <p class="sub-label skeletons-text">
              {{ i18n.subLabel }}
            </p>
          </div>
          <GroupButton
            v-model="form[name]"
            :options="options"
            @update:model-value="updateNotifications()"
          />
        </div>
      </div>
    </FetchLoader>
  </div>
</template>
<script setup lang="ts">
import type { NotificationSettingsForm } from 'shared-projects-frontend/models'
import { getUserNotificationSettings } from '~/api/v2/notifications.service'
import GroupButton from '~/components/base/button/GroupButton.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { throttle } from 'es-toolkit'

import {
  defaultUserNotificationsSettingsForm,
  useUserNotificationsSettingsForm,
} from '~/form/notifications'
import { patchUserNotificationSettings } from 'shared-projects-frontend/apis'
import useUsersStore from '~/stores/useUsers'

const usersStore = useUsersStore()
const toaster = useToaster()
const organizationCode = useOrganizationCode()
const userId = computed(() => usersStore.id)
const { status, data: settings } = getUserNotificationSettings(organizationCode, userId)

const defaultLocalForm = () => {
  const defaultForm = defaultUserNotificationsSettingsForm()
  return {
    ...defaultForm,
    ...(settings.value || {}),
  }
}

const { form, reset } = useUserNotificationsSettingsForm({ default: defaultLocalForm() })

const updateNotifications = throttle(() => {
  return (
    patchUserNotificationSettings(organizationCode, userId.value, form.value)
      // update new form with updated settings
      .then((updatedSettings) => reset(updatedSettings))
      .catch(() => toaster.pushError(t('notifications.error')))
  )
}, 500)

watch(
  settings,
  () => {
    if (settings.value) {
      reset(settings.value)
    }
  },
  { deep: true }
)

const { t } = useNuxtI18n()
const options = computed(() => [
  {
    value: true,
    label: t('notifications.tabs.options.yes'),
  },
  {
    value: false,
    label: t('notifications.tabs.options.no'),
  },
])

type NotificationKeys = keyof Omit<NotificationSettingsForm, 'id'>

// maping notifications key to i18n label/help
const NOTIFCATIONS_MAP_I18N: { [key in NotificationKeys]: { label: string; subLabel: string } } = {
  category_project_created: {
    label: t('notifications.category.project-created'),
    subLabel: t('notifications.category.project-created-sub'),
  },
  category_project_updated: {
    label: t('notifications.category.project-updated'),
    subLabel: t('notifications.category.project-updated-sub'),
  },
  followed_project_has_been_edited: {
    label: t('notifications.projects.follow'),
    subLabel: t('notifications.projects.follow-sub'),
  },
  notify_added_to_project: {
    label: t('notifications.projects.member'),
    subLabel: t('notifications.projects.member-sub'),
  },
  project_has_been_commented: {
    label: t('notifications.projects.comment'),
    subLabel: t('notifications.projects.comment-sub'),
  },
  project_has_new_private_message: {
    label: t('notifications.projects.internal-message'),
    subLabel: t('notifications.projects.internal-message-sub'),
  },
  project_has_been_edited: {
    label: t('notifications.projects.project'),
    subLabel: t('notifications.projects.project-sub'),
  },
  announcement_published: {
    label: t('notifications.projects.announcement'),
    subLabel: t('notifications.projects.announcement-sub'),
  },
  project_ready_for_review: {
    label: t('notifications.projects.review'),
    subLabel: t('notifications.projects.review-sub'),
  },
  project_has_been_reviewed: {
    label: t('notifications.projects.reviewed'),
    subLabel: t('notifications.projects.reviewed-sub'),
  },
  comment_received_a_response: {
    label: t('notifications.projects.reply'),
    subLabel: t('notifications.projects.reply-sub'),
  },
  organization_has_new_access_request: {
    label: t('notifications.organization.access'),
    subLabel: t('notifications.organization.access-sub'),
  },
  invitation_link_will_expire: {
    label: t('notifications.organization.invitation'),
    subLabel: t('notifications.organization.invitation-sub'),
  },
  new_instruction: {
    label: t('notifications.organization.instruction'),
    subLabel: t('notifications.organization.instruction-sub'),
  },
  announcement_has_new_application: {
    label: t('notifications.projects.announcement-has-new-application'),
    subLabel: t('notifications.projects.announcement-has-new-application-sub'),
  },
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.notification-tab {
  padding: variables.$space-l;
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
    margin-bottom: variables.$space-xl;

    .labels {
      display: flex;
      flex-direction: column;
      margin-bottom: variables.$layout-size-m;

      .sub-label {
        font-size: variables.$font-size-s;
      }

      .label {
        font-size: variables.$font-size-m;
        color: variables.$primary-dark;
      }
    }
  }
}

@media (min-width: variables.$min-tablet) {
  .notification-tab {
    padding: variables.$space-l variables.pxtorem(100px);

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
