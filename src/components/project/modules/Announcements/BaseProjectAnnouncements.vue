<script setup lang="ts">
import { getProjectAnnouncements } from '@/api/v2/announcements.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import AnnouncementCard from '@/components/project/announcement/AnnouncementCard.vue'
import { TranslatedProject } from '@/models/project.model'
import { announcementSkeleton } from '@/skeletons/announcement.skeletons'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
  }>(),
  {
    preview: false,
    limit: null,
  }
)

const limitSkeletons = computed(() => maxSkeleton(props.project.modules.announcements, props.limit))

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)

const {
  status,
  data: announcements,
  pagination,
} = getProjectAnnouncements(organizationCode, projectId, {
  query: {
    ordering: '-created_at',
  },
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(announcementSkeleton, limitSkeletons.value),
})
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="announcement-list">
      <AnnouncementCard
        v-for="announcement in announcements"
        :key="announcement.id"
        :project="project"
        :announcement="announcement"
      />
    </div>
    <EmptyLabel v-if="announcements.length === 0" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
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
