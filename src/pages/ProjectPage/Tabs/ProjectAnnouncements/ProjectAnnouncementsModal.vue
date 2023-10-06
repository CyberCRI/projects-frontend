<template>
    <div>
        <BaseModal @close="$emit('close')">
            <template #header-title>
                <slot name="header"> {{ $filters.capitalize($t('home.announcements')) }}</slot>
            </template>

            <template #content>
                <div class="announcements-ctn">
                    <AnnouncementItem
                        v-for="announcement in sortedAnnouncements"
                        :key="announcement.id"
                        :announcement="announcement"
                        class="announcement"
                        @update-announcement="updateAnnouncement(announcement)"
                        @open-confirm-modal="openConfirmDeleteModal(announcement)"
                    />
                </div>

                <LpiButton
                    :label="$filters.capitalize($t('recruit.new-announcement'))"
                    class="add-announcement-btn"
                    @click="createAnnouncement"
                />
            </template>
        </BaseModal>

        <ConfirmModal
            v-if="confirmDeleteModalVisible"
            :content="$t('recruit.delete-announcement-message')"
            :title="$filters.capitalize($t('common.delete'))"
            @cancel="confirmDeleteModalVisible = false"
            @confirm="deleteAnnouncement"
        />
    </div>
</template>

<script>
import BaseModal from '@/components/lpikit/BaseModal/BaseModal.vue'
import AnnouncementItem from '@/components/lpikit/Announcement/AnnouncementItem.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'
import ConfirmModal from '@/components/lpikit/ConfirmModal/ConfirmModal.vue'

export default {
    name: 'ProjectAnnouncementsModal',

    emits: ['close', 'create-announcement', 'update-announcement'],

    components: {
        BaseModal,
        AnnouncementItem,
        LpiButton,
        ConfirmModal,
    },

    props: {
        announcements: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        sortedAnnouncements() {
            return [...this.announcements].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )
        },
    },

    data() {
        return {
            announcementToBeDeleted: null,
            confirmDeleteModalVisible: false,
        }
    },

    methods: {
        createAnnouncement() {
            this.$emit('close')
            this.$emit('create-announcement')
        },

        openConfirmDeleteModal(announcement) {
            this.announcementToBeDeleted = announcement
            this.confirmDeleteModalVisible = true
        },

        async deleteAnnouncement() {
            try {
                await this.$store.dispatch(
                    'announcements/deleteAnnouncement',
                    this.announcementToBeDeleted
                )
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.announcement-delete.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.announcement-delete.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.confirmDeleteModalVisible = false
                this.announcementToBeDeleted = null
            }
        },

        updateAnnouncement(announcement) {
            this.$emit('update-announcement', announcement)
        },
    },
}
</script>

<style lang="scss" scoped>
.announcements-ctn {
    .announcement {
        &:not(.first-of-type) {
            margin-top: $space-l;
        }
    }
}

.add-announcement-btn {
    margin: $space-m auto 0;
}
</style>
