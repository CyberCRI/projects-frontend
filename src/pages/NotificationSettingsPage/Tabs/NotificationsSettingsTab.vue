<template>
    <div class="notification-tab">
        <LpiLoader v-if="isLoading" class="loader" type="simple" />
        <div v-for="(notification, index) in switches" v-else :key="index">
            <div class="notification-ctn">
                <div class="labels">
                    <h2 class="label">{{ notification.label }}</h2>
                    <p class="sub-label">{{ notification.subLabel }}</p>
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
import GroupButton from '@/components/lpikit/GroupButton/GroupButton.vue'
import LpiLoader from '@/components/lpikit/Loader/LpiLoader.vue'

export default {
    name: 'NotificationsSettingsTab',

    components: {
        LpiLoader,
        GroupButton,
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
                comment_received_a_response: false,
            },
            isLoading: true,
        }
    },

    async mounted() {
        await this.$store.dispatch('users/getNotifications', this.$store.getters['users/kid'])
        this.initNotificationSettings()
    },

    computed: {
        notifications() {
            return this.$store.getters['users/getNotificationsSettings'] || {}
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
            ]
        },
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
                kid: this.$store.state.users.keycloak_id,
                payload: payload,
            }

            await this.$store.dispatch('users/patchNotifications', body)
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
            margin-bottom: $font-size-m;

            .sub-label {
                font-size: $font-size-s;
                line-height: 22px;
            }

            .label {
                font-size: $font-size-m;
                line-height: 24px;
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