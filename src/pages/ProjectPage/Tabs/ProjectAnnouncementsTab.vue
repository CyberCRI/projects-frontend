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
            :asyncing="isDeleting"
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
import AnnouncementItem from '@/components/project/announcement/AnnouncementItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import ReplyAnnouncementDrawer from '@/components/project/announcement/ReplyAnnouncementDrawer.vue'
import ProjectTab from '@/mixins/ProjectTab.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'
import utils from '@/functs/functions.ts'
import { deleteAnnouncement } from '@/api/announcements.service'
import analytics from '@/analytics'
import useToasterStore from '@/stores/useToaster.ts'
export default {
    name: 'ProjectAnnouncementsTab',

    mixins: [permissions, ProjectTab],

    emits: ['reload-announcements'],

    components: {
        AnnouncementItem,
        ConfirmModal,
        ReplyAnnouncementDrawer,
        LpiButton,
    },
    inject: ['projectLayoutToggleAddModal'],
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
        announcements: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            confirmDeleteModalVisible: false,
            appliedAnnouncement: null,
            isDeleting: false,
        }
    },

    computed: {
        sortedAnnouncements() {
            return [...this.announcements].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            )
        },
    },

    methods: {
        async deleteAnnouncement() {
            try {
                this.isDeleting = true
                await deleteAnnouncement(this.announcementToBeDeleted)

                analytics.announcement.removeAnnouncement({
                    project: {
                        id: this.project.id,
                    },
                    announcement: this.announcementToBeDeleted,
                })

                this.toaster.pushSuccess(this.$t('toasts.announcement-delete.success'))

                this.$emit('reload-announcements')
            } catch (error) {
                this.toaster.pushError(`${this.$t('toasts.announcement-delete.error')} (${error})`)
                console.error(error)
            } finally {
                this.isDeleting = false
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
