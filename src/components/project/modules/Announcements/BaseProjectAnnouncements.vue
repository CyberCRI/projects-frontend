<script setup lang="ts">
import ApplyAnnouncementDrawer from '~/components/project/modules/Announcements/ApplyAnnouncementDrawer.vue'
import AnnouncementDrawer from '~/components/project/modules/Announcements/AnnouncementDrawer.vue'
import AnnouncementItem from '~/components/project/modules/Announcements/AnnouncementItem.vue'
import AnnouncementCard from '~/components/project/modules/Announcements/AnnouncementCard.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import { announcementSkeleton } from '@/skeletons/announcement.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { getProjectAnnouncements } from '@/api/v2/announcements.service'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import { deleteAnnouncement } from '~/api/announcements.service'
import type { TranslatedProject } from '@/models/project.model'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  {
    preview: false,
    limit: null,
    editable: false,
  }
)
const toaster = useToaster()
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.announcements, props.limit))

const projectId = computed(() => props.project.id)

const {
  status,
  data: announcements,
  pagination,
  refresh,
} = getProjectAnnouncements(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(announcementSkeleton, limitSkeletons.value),
})

const asyncing = ref(false)
const selectedAnnouncement = ref()
const { stateModals, openModals, closeAllModals } = useModals({
  edit: false,
  delete: false,
  apply: false,
})

const onEdit = (announcement) => {
  selectedAnnouncement.value = announcement
  openModals('edit')
}

const onDelete = (announcement) => {
  selectedAnnouncement.value = announcement
  openModals('delete')
}

const onApply = (announcement) => {
  selectedAnnouncement.value = announcement
  openModals('apply')
}

const cancel = () => {
  asyncing.value = true
  selectedAnnouncement.value = null
  closeAllModals()
}

const refreshData = () => {
  refreshProjectData(props.project)
  refresh()
}

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteAnnouncement(props.project.id, selectedAnnouncement.value.id)
    .then(() => {
      toaster.pushSuccess($t('toasts.announcement-delete.success'))
      refreshData()
    })
    .catch(() => toaster.pushSuccess($t('toasts.announcement-delete.error')))
    .finally(() => cancel())
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('edit')"
    />
    <div class="announcement-list">
      <AnnouncementItem
        v-for="announcement in announcements"
        :key="announcement.id"
        :project="project"
        :announcement="announcement"
        :editable="editable"
        :show-apply-action="!preview"
        @delete="onDelete(announcement)"
        @edit="onEdit(announcement)"
        @apply="onApply(announcement)"
      />
    </div>
    <NothingHere v-if="announcements.length === 0" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />

    <!-- drawer/modal -->
    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('recruit.delete-announcement-message')"
      :asyncing="asyncing"
      @cancel="cancel"
      @confirm="onDeleteConfirm"
    >
      <AnnouncementCard :project="project" :announcement="selectedAnnouncement" />
    </ConfirmModal>

    <AnnouncementDrawer
      :is-opened="stateModals.edit"
      :project="project"
      :announcement="selectedAnnouncement"
      @close="cancel"
      @reload="refreshData"
    />

    <ApplyAnnouncementDrawer
      :is-opened="stateModals.apply"
      :announcement="selectedAnnouncement"
      :project="project"
      @close="cancel"
    />
  </FetchLoader>
</template>

<style lang="scss" scoped>
.announcement-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
