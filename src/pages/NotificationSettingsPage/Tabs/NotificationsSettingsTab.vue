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
<script>
import GroupButton from '@/components/base/button/GroupButton.vue'
import LpiLoader from '@/components/base/loader/LpiLoader.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'NotificationsSettingsTab',

  components: {
    LpiLoader,
    GroupButton,
  },

  setup() {
    const usersStore = useUsersStore()
    return {
      usersStore,
    }
  },
  data() {
    return {
      form: {
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
      },
      isLoading: true,
    }
  },

  computed: {
    notifications() {
      return this.usersStore.notificationsSettings || {}
    },

    options() {
      return [
        {
          value: true,
          label: this.$t('notifications.tabs.options.yes'),
        },
        {
          value: false,
          label: this.$t('notifications.tabs.options.no'),
        },
      ]
    },

    switches() {
      return [
        {
          label: this.$t('notifications.category.project-created'),
          subLabel: this.$t('notifications.category.project-created-sub'),
          value: this.form.category_project_created,
          settingValue: 'category_project_created',
        },
        {
          label: this.$t('notifications.category.project-updated'),
          subLabel: this.$t('notifications.category.project-updated-sub'),
          value: this.form.category_project_updated,
          settingValue: 'category_project_updated',
        },
        {
          label: this.$t('notifications.projects.follow'),
          subLabel: this.$t('notifications.projects.follow-sub'),
          value: this.form.followed_project_has_been_edited,
          settingValue: 'followed_project_has_been_edited',
        },
        {
          label: this.$t('notifications.projects.member'),
          subLabel: this.$t('notifications.projects.member-sub'),
          value: this.form.notify_added_to_project,
          settingValue: 'notify_added_to_project',
        },
        {
          label: this.$t('notifications.projects.comment'),
          subLabel: this.$t('notifications.projects.comment-sub'),
          value: this.form.project_has_been_commented,
          settingValue: 'project_has_been_commented',
        },
        {
          label: this.$t('notifications.projects.internal-message'),
          subLabel: this.$t('notifications.projects.internal-message-sub'),
          value: this.form.project_has_new_private_message,
          settingValue: 'project_has_new_private_message',
        },
        {
          label: this.$t('notifications.projects.project'),
          subLabel: this.$t('notifications.projects.project-sub'),
          value: this.form.project_has_been_edited,
          settingValue: 'project_has_been_edited',
        },
        {
          label: this.$t('notifications.projects.announcement'),
          subLabel: this.$t('notifications.projects.announcement-sub'),
          value: this.form.announcement_published,
          settingValue: 'announcement_published',
        },
        {
          label: this.$t('notifications.projects.review'),
          subLabel: this.$t('notifications.projects.review-sub'),
          value: this.form.project_ready_for_review,
          settingValue: 'project_ready_for_review',
        },
        {
          label: this.$t('notifications.projects.reviewed'),
          subLabel: this.$t('notifications.projects.reviewed-sub'),
          value: this.form.project_has_been_reviewed,
          settingValue: 'project_has_been_reviewed',
        },
        {
          label: this.$t('notifications.projects.reply'),
          subLabel: this.$t('notifications.projects.reply-sub'),
          value: this.form.comment_received_a_response,
          settingValue: 'comment_received_a_response',
        },
        {
          label: this.$t('notifications.organization.access'),
          subLabel: this.$t('notifications.organization.access-sub'),
          value: this.form.organization_has_new_access_request,
          settingValue: 'organization_has_new_access_request',
        },
        {
          label: this.$t('notifications.organization.invitation'),
          subLabel: this.$t('notifications.organization.invitation-sub'),
          value: this.form.invitation_link_will_expire,
          settingValue: 'invitation_link_will_expire',
        },
        {
          label: this.$t('notifications.organization.instruction'),
          subLabel: this.$t('notifications.organization.instruction-sub'),
          value: this.form.new_instruction,
          settingValue: 'new_instruction',
        },
      ]
    },
  },

  async mounted() {
    await this.usersStore.getNotifications(this.usersStore.id)
    this.initNotificationSettings()
  },

  methods: {
    initNotificationSettings() {
      this.form = { ...this.notifications }

      this.isLoading = false
    },

    async updateNotifications(setting) {
      const payload = {
        ...this.notifications,
      }

      payload[setting] = !this.notifications[setting]

      const body = {
        id: this.usersStore.id,
        payload: payload,
      }

      await this.usersStore.patchNotifications(body)
    },
  },
}
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
