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
        :default-picture="DEFAULT_USER_PATATOID"
      />
      <div class="container">
        <I18nT :keypath="`notifications.type.${notification.type}`" tag="p">
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
            <strong v-else>???</strong>
          </template>
          <template v-if="notification.type === 'invitation_today_reminder'" #today_group>
            <NuxtLink
              v-if="notification.invitation?.people_group"
              :to="{
                name: 'groupSnapshot',
                params: {
                  groupIdOrSlug:
                    notification.invitation?.people_group?.slug ||
                    notification.invitation?.people_group?.id,
                },
              }"
            >
              {{ notification.invitation?.people_group?.name }}
            </NuxtLink>
            <strong v-else>???</strong>
          </template>

          <template #group>
            <NuxtLink
              v-if="notification?.context?.group"
              :to="{
                name: 'Group',
                params: {
                  groupIdOrSlug: notification.context.group.slug || notification.context.group.id,
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
        </I18nT>
        <span class="date">{{ timePassed }}</span>
      </div>
    </component>
  </li>
</template>

<script setup lang="ts">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'

import type { NotificationModel } from '~/models/notifications.model'
import type { IconImageChoice } from '~/functs/IconImage'
import type { RouteLocationRaw } from 'vue-router'
import { getTimePassed } from '@/functs/date'
import utils from '~/functs/functions'
import { NuxtLink } from '#components'
// import { I18nT } from 'vue-i18n'

const props = defineProps<{
  notification: NotificationModel
}>()

defineEmits<{
  navigated: [NotificationModel]
}>()

const icon = computed<IconImageChoice>(() => (props.notification?.is_viewed ? null : 'Circle'))
const context = computed(() => {
  if (utils.isEmpty(props.notification.context)) return null
  return props.notification.context
})

const formatUser = (firstname: string | null, lastname: string | null): string => {
  return ((firstname ?? '').toLowerCase() + ' ' + (lastname ?? '').toLowerCase()).trim()
}

const deletedName = computed(() =>
  formatUser(
    context.value?.deleted_members?.[0]?.given_name,
    context.value?.deleted_members?.[0]?.family_name
  )
)

const modifiedName = computed(() =>
  formatUser(
    context.value?.modified_members?.[0]?.given_name,
    context.value?.modified_members?.[0]?.family_name
  )
)

const applicantName = computed(() =>
  formatUser(
    context.value?.application?.applicant_firstname,
    context.value?.application?.applicant_name
  )
)

const senderName = computed(() =>
  formatUser(props.notification.sender?.given_name, props.notification.sender?.family_name)
)
const timePassed = computed(() => getTimePassed(new Date(props.notification.created)))

const notificationRoute = computed<RouteLocationRaw>(() => {
  if (
    props.notification.type === 'invitation_week_reminder' ||
    props.notification.type === 'invitation_today_reminder'
  ) {
    return null
  } else if (
    props.notification.type === 'access_request' ||
    props.notification.type === 'pending_access_requests'
  ) {
    return { name: 'RequestsAdminTab' }
  } else if (props.notification.type === 'comment') {
    return {
      name: 'projectComments',
      params: { slugOrId: props.notification.project.slug },
    }
  } else if (props.notification.type === 'project_message') {
    return {
      name: 'projectPrivateExchange',
      params: { slugOrId: props.notification.project.slug },
    }
  } else if (props.notification.type === 'new_instruction') {
    return {
      name: 'InstructionListPage',
      params: {},
    }
  } else if (props.notification.project) {
    return {
      name: 'projectSummary',
      params: { slugOrId: props.notification.project.slug },
    }
  } else {
    return { name: 'HomeRoot' }
  }
})
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
