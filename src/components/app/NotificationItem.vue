<template>
  <li
    v-if="notification"
    :class="{
      'notification--spacer': !icon,
    }"
    class="notification"
    tabindex="0"
    @click="$emit('navigated', notification)"
  >
    <component
      :is="notificationRoute ? 'NuxtLink' : 'div'"
      :to="notificationRoute"
      class="notification-link"
    >
      <IconImage v-if="icon" :name="icon" class="icon" />
      <CroppedApiImage
        alt="user image"
        class="img-container"
        :picture-data="notification.sender?.profile_picture"
        picture-size="medium"
        default-picture="/placeholders/user_placeholder.svg"
      />
      <div class="container">
        <i18n-t :keypath="`notifications.type.${notification.type}`" tag="p">
          <template #sender>
            <strong v-if="senderName">
              {{ senderName }}
            </strong>
          </template>

          <template #project>
            <strong v-if="notification.project">
              {{ notification.project?.title }}
            </strong>
          </template>

          <template #applicant>
            <strong v-if="applicantName">
              {{ applicantName }}
            </strong>
          </template>

          <template #user>
            <strong v-if="deletedName">
              {{ deletedName }}
            </strong>
            <strong v-if="modifiedName">
              {{ modifiedName }}
            </strong>
          </template>
          <template v-if="notification.type === 'invitation_week_reminder'" #week_group>
            <strong v-if="notification.invitation?.people_group">
              {{ notification.invitation?.people_group?.name }}
            </strong>
            <strong v-else> ??? </strong>
          </template>
          <template v-if="notification.type === 'invitation_today_reminder'" #today_group>
            <NuxtLink
              v-if="notification.invitation?.people_group"
              :to="{
                name: 'groupSnapshot',
                params: {
                  groupId:
                    notification.invitation?.people_group?.slug ||
                    notification.invitation?.people_group?.id,
                },
              }"
            >
              {{ notification.invitation?.people_group?.name }}
            </NuxtLink>
            <strong v-else> ??? </strong>
          </template>

          <template #group>
            <NuxtLink
              v-if="notification?.context?.group"
              :to="{
                name: 'Group',
                params: {
                  groupId: notification.context.group.slug || notification.context.group.id,
                },
              }"
            >
              {{ notification.context.group.name }}
            </NuxtLink>
          </template>

          <template #link>
            <NuxtLink
              v-if="notification.type === 'invitation_today_reminder'"
              :to="{ name: 'linksList' }"
            >
              {{ $t('notifications.type.register-link') }}
            </NuxtLink>
          </template>

          <template #access_request_nb>
            <strong v-if="notification.type === 'access_request'">
              {{ notification?.context?.access_request_nb }}
            </strong>
          </template>

          <template #requests_count>
            <strong v-if="notification.type === 'pending_access_requests'">
              {{ notification?.context?.requests_count }}
            </strong>
          </template>
        </i18n-t>
        <span class="date">{{ timePassed }}</span>
      </div>
    </component>
  </li>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import utils from '@/functs/functions.ts'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { NuxtLink } from '#components'
export default {
  name: 'NotificationItem',

  components: { IconImage, CroppedApiImage, NuxtLink },

  props: {
    notification: {
      type: Object,
      required: true,
    },
  },

  emits: ['navigated'],

  computed: {
    icon() {
      return this.notification?.is_viewed ? null : 'Circle'
    },
    deletedName() {
      const givenName = this.context?.deleted_members?.[0]?.given_name || ''
      const familyName = this.context?.deleted_members?.[0]?.family_name || ''
      return (givenName.toLowerCase() + ' ' + familyName.toLowerCase()).trim()
    },

    modifiedName() {
      const givenName = this.context?.modified_members?.[0]?.given_name || ''
      const familyName = this.context?.modified_members?.[0]?.family_name || ''
      return (givenName.toLowerCase() + ' ' + familyName.toLowerCase()).trim()
    },

    applicantName() {
      const firstName = this.context?.application?.applicant_firstname || ''
      const name = this.context?.application?.applicant_name || ''
      return (firstName.toLowerCase() + ' ' + name.toLowerCase()).trim()
    },
    senderName() {
      const givenName = this.notification.sender?.given_name || ''
      const familyName = this.notification.sender?.family_name || ''
      return (givenName.toLowerCase() + ' ' + familyName.toLowerCase()).trim()
    },
    timePassed() {
      return utils.getTimePassed(new Date(this.notification.created))
    },

    context() {
      if (utils.isEmpty(this.notification.context)) return null
      return this.notification.context
    },

    notificationRoute() {
      if (
        this.notification.type === 'invitation_week_reminder' ||
        this.notification.type === 'invitation_today_reminder'
      ) {
        return null
      } else if (
        this.notification.type === 'access_request' ||
        this.notification.type === 'pending_access_requests'
      ) {
        return { name: 'RequestsAdminTab' }
      } else if (this.notification.type === 'comment') {
        return {
          name: 'projectComments',
          params: { slugOrId: this.notification.project.slug },
        }
      } else if (this.notification.type === 'project_message') {
        return {
          name: 'projectPrivateExchange',
          params: { slugOrId: this.notification.project.slug },
        }
      } else if (this.notification.project) {
        return {
          name: 'projectSummary',
          params: { slugOrId: this.notification.project.slug },
        }
      } else {
        return { name: 'HomeRoot' }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.notification {
  margin: $space-m 0;
  font-size: $font-size-m;
  line-height: 1.2;

  &--spacer {
    padding: $space-s 16px;
  }

  &:hover {
    background: $primary-lighter;
  }
}

.notification-link {
  display: flex;
  align-items: center;
  padding: $space-s;
  cursor: pointer;
}

.img-container {
  border-radius: 50%;
  background-size: cover;
  background-position: top center;
  width: 50px;
  height: 50px;
  flex: none;
  margin-right: $space-s;
}

.icon {
  fill: $primary;
  width: 10px;
  height: 10px;
  margin-right: $space-s;
  flex: none;
}

.date {
  color: $mid-gray;
  font-weight: 400;
  width: 100%;
  display: inline-block;
  font-size: $font-size-xs;
}

.container {
  strong,
  a {
    font-weight: 700;
    color: $primary-dark;
    text-transform: capitalize;
  }
}
</style>
