<script setup lang="ts">
import AnnouncementDrawer from '~/components/project/announcement/AnnouncementDrawer.vue'
import AnnouncementCard from '@/components/project/announcement/AnnouncementCard.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { announcementSkeleton } from '@/skeletons/announcement.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { getProjectAnnouncements } from '@/api/v2/announcements.service'
import ConfirmModal from '~/components/base/modal/ConfirmModal.vue'
import { deleteAnnouncement } from '~/api/announcements.service'
import type { TranslatedProject } from '@/models/project.model'
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
  key,
} = getProjectAnnouncements(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(announcementSkeleton, limitSkeletons.value),
})

const selectedAnnouncement = ref()
const { stateModals, openModals, closeModals } = useModals({
  edit: false,
  delete: false,
})

const onEdit = (announcement) => {
  selectedAnnouncement.value = announcement
  openModals('edit')
}

const onDelete = (announcement) => {
  selectedAnnouncement.value = announcement
  openModals('delete')
}

const cancel = () => {
  selectedAnnouncement.value = null
  closeModals('delete', 'edit')
}

const refreshData = () => {
  refreshNuxtData([
    `${organizationCode}::project::${props.project.id}`,
    `${organizationCode}::project::${props.project.slug}`,
    key.value,
  ])
}

const onDeleteConfirm = () => {
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
    <BaseModuleHeader v-if="editable" :pagination="pagination" @add="openModals('edit')" />
    <div class="announcement-list">
      <AnnouncementCard
        v-for="announcement in announcements"
        :key="announcement.id"
        :project="project"
        :announcement="announcement"
        :editable="editable"
        @delete="onDelete(announcement)"
        @edit="onEdit(announcement)"
      />
    </div>
    <EmptyLabel v-if="announcements.length === 0" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />

    <ConfirmModal
      v-if="stateModals.delete"
      :title="$t('recruit.delete-announcement-message')"
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
  </FetchLoader>
</template>

<style lang="scss" scoped>
.announcement-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
