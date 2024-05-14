<template>
    <div class="project-announcement narrow-content">
        <div class="add-announcement" v-if="canEditProject">
            <LpiButton
                :label="$filters.capitalize($t('project.announcement-create'))"
                class="add-announcement-btn"
                @click="projectLayoutToggleAddModal('announcement')"
            />
        </div>

        <AnnouncementItem
            v-for="announcement in sortedAnnouncements"
            :key="announcement.id"
            :announcement="announcement"
            class="announcement"
            @update-announcement="updateAnnouncement(announcement)"
            @open-confirm-modal="openConfirmDeleteModal(announcement)"
            :show-apply-action="true"
            @apply="appliedAnnouncement = $event"
        />

        <ConfirmModal
            v-if="confirmDeleteModalVisible"
            :content="$t('recruit.delete-announcement-message')"
            :title="$filters.capitalize($t('common.delete'))"
            @cancel="confirmDeleteModalVisible = false"
            @confirm="deleteAnnouncement"
        />

        <ReplyAnnouncementDrawer
            :announcement="appliedAnnouncement"
            :is-opened="!!appliedAnnouncement"
            @close="appliedAnnouncement = null"
            @submit="appliedAnnouncement = null"
        />
    </div>
</template>

<script>
import permissions from '@/mixins/permissions.ts'
import AnnouncementItem from '@/components/project/Announcement/AnnouncementItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ReplyAnnouncementDrawer from '@/components/project/ReplyAnnouncementDrawer/ReplyAnnouncementDrawer.vue'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'
import utils from '@/functs/functions.ts'

export default {
    name: 'ProjectAnnouncementsTab',

    mixins: [permissions, ProjectTab],

    components: {
        AnnouncementItem,
        ConfirmModal,
        ReplyAnnouncementDrawer,
        LpiButton,
    },
    inject: ['projectLayoutToggleAddModal'],

    data() {
        return {
            confirmDeleteModalVisible: false,
            appliedAnnouncement: null,
        }
    },

    computed: {
        announcements() {
            return this.$store.getters['projects/project'].announcements
        },

        sortedAnnouncements() {
            return [...this.announcements].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )
        },
    },

    methods: {
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
            this.projectLayoutToggleAddModal('announcement', announcement)
        },

        openConfirmDeleteModal(announcement) {
            this.announcementToBeDeleted = announcement
            this.confirmDeleteModalVisible = true
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            if (to.hash == '#tab') {
                // remove hash from url so it doen't affect shared url
                history.replaceState('', '', `${location.pathname}${location.search}`)
                vm.$nextTick(() => utils.scrollTo(document.querySelector('.tabs-wrapper')))
            }
        })
    },
    beforeRouteUpdate(to, from, next) {
        next((vm) => {
            if (to.hash == '#tab') {
                // remove hash from url so it doen't affect shared url
                history.replaceState('', '', `${location.pathname}${location.search}`)
                vm.$nextTick(() => utils.scrollTo(document.querySelector('.tabs-wrapper')))
            }
        })
    },
}
</script>

<style lang="scss" scoped>
.project-announcement {
    margin-top: 24px;

    .announcement {
        &:not(.first-of-type) {
            margin-top: $space-l;
        }
    }
}

.add-announcement {
    display: flex;
    justify-content: flex-end;
    padding: $space-l 0;
}
</style>
