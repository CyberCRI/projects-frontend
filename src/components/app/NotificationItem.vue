<template>
    <li
        v-if="notification"
        :class="{
            'notification--spacer': !notification.icon,
        }"
        class="notification"
        tabindex="0"
        @click="$emit('go-to')"
    >
        <IconImage v-if="notification.icon" :name="notification.icon" class="icon" />
        <CroppedImage
            alt="user image"
            :image-sizes="imageSizes"
            :src="
                imageError
                    ? defaultImage
                    : notification.sender?.profile_picture?.variations?.medium || ''
            "
            @error="placeHolderImg"
            class="img-container"
        />
        <div class="container">
            <i18n-t :keypath="`notifications.type.${notification.type}`" tag="p">
                <template #sender>
                    <span
                        v-if="
                            notification.sender &&
                            notification.sender.given_name &&
                            notification.sender.family_name
                        "
                        class="strong"
                        place="sender"
                        >{{ notification.sender.given_name.toLowerCase() }}
                        {{ notification.sender.family_name.toLowerCase() }}</span
                    >
                    <span
                        v-else-if="notification.sender && notification.sender.given_name"
                        class="strong"
                        place="sender"
                        >{{ notification.sender.given_name.toLowerCase() }}</span
                    >
                    <span
                        v-else-if="notification.sender && notification.sender.family_name"
                        class="strong"
                        place="sender"
                        >{{ notification.sender.family_name.toLowerCase() }}</span
                    >
                </template>

                <template #project>
                    <span v-if="notification.project" class="strong" place="project">{{
                        notification.project.title
                    }}</span>
                </template>

                <template #applicant>
                    <span
                        v-if="
                            context &&
                            context.application &&
                            context.application.applicant_firstname
                        "
                        class="strong"
                        place="applicant"
                    >
                        {{ context.application.applicant_firstname.toLowerCase() }}
                        {{ context.application.applicant_name.toLowerCase() }}
                    </span>
                </template>

                <template #user>
                    <span
                        v-if="
                            context &&
                            context.deleted_members &&
                            context.deleted_members.length > 0 &&
                            context.deleted_members[0].given_name &&
                            context.deleted_members[0].family_name
                        "
                        class="strong"
                        place="user"
                    >
                        {{ context.deleted_members[0].given_name.toLowerCase() }}
                        {{ context.deleted_members[0].family_name.toLowerCase() }}
                    </span>
                    <span
                        v-if="
                            context &&
                            context.modified_members &&
                            context.modified_members.length > 0 &&
                            context.modified_members[0].given_name &&
                            context.modified_members[0].family_name
                        "
                        class="strong"
                        place="user"
                    >
                        {{ context.modified_members[0].given_name.toLowerCase() }}
                        {{ context.modified_members[0].family_name.toLowerCase() }}
                    </span>
                </template>
                <template #week_group>
                    <span
                        v-if="notification.type === 'invitation_week_reminder'"
                        class="strong"
                        place="week_group"
                    >
                        {{ notification.invitation?.people_group.name }}
                    </span>
                </template>
                <template #today_group>
                    <span
                        v-if="notification.type === 'invitation_today_reminder'"
                        class="strong"
                        place="today_group"
                    >
                        <router-link
                            :to="`/group/${notification.invitation?.people_group.id}/snapshot`"
                            >{{ notification.invitation?.people_group.name }}</router-link
                        >
                    </span>
                </template>

                <template #group>
                    <span
                        v-if="notification.context && notification.context.group"
                        class="strong"
                        place="group"
                    >
                        <router-link
                            :to="{
                                name: 'Group',
                                params: {
                                    groupId:
                                        notification.context.group.slug ||
                                        notification.context.group.id,
                                },
                            }"
                            >{{ notification.context.group.name }}</router-link
                        >
                    </span>
                </template>

                <template #link>
                    <span
                        v-if="notification.type === 'invitation_today_reminder'"
                        class="strong"
                        place="today_group"
                    >
                        <router-link to="/admin/links/list">{{
                            $t('notifications.type.register-link')
                        }}</router-link>
                    </span>
                </template>

                <template #access_request_nb>
                    <span
                        v-if="notification.type === 'access_request'"
                        class="strong"
                        place="access_request_nb"
                    >
                        {{ notification.context.access_request_nb }}
                    </span>
                </template>

                <template #requests_count>
                    <span
                        v-if="notification.type === 'pending_access_requests'"
                        class="strong"
                        place="requests_count"
                    >
                        {{ notification.context.requests_count }}
                    </span>
                </template>
            </i18n-t>
            <span class="date">{{ timePassed }}</span>
        </div>
    </li>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import utils from '@/functs/functions.ts'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'NotificationItem',

    emits: ['go-to'],

    mixins: [imageMixin],

    components: { IconImage, CroppedImage },

    props: {
        notification: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            imageError: false,
        }
    },

    computed: {
        timePassed() {
            return utils.getTimePassed(new Date(this.notification.created))
        },

        context() {
            if (utils.isEmpty(this.notification.context)) return null
            return this.notification.context
        },
        imageSizes() {
            return this.imageError
                ? null
                : pictureApiToImageSizes(this.notification?.sender?.profile_picture)
        },
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },
    },

    methods: {
        placeHolderImg() {
            this.imageError = true
        },
    },
}
</script>

<style lang="scss" scoped>
.notification {
    margin: $space-m 0;
    display: flex;
    align-items: center;
    padding: $space-s;
    cursor: pointer;

    &--spacer {
        padding: $space-s 16px;
    }

    &:hover {
        background: $primary-lighter;
    }
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
    color: #4d4d4d;
    font-weight: 400;
    width: 100%;
    display: inline-block;
    font-size: $font-size-xs;
}

.strong {
    font-weight: 700;
    color: $primary-dark;
    text-transform: capitalize;
}
</style>
