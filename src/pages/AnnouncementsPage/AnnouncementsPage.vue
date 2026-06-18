<script setup lang="ts">
import { announcementSkeleton } from '~/skeletons/announcement.skeletons'
import { getAnnouncements } from '~/api/v2/announcements.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { fullYearDateFormat, nowDate } from '~/functs/date'

const { t } = useNuxtI18n()

const organizationCode = useOrganizationCode()
const {
  status,
  data: announcements,
  pagination,
} = getAnnouncements(organizationCode, {
  query: {
    organizations: [organizationCode],
    ordering: '-updated_at',
    from_date: fullYearDateFormat(nowDate()),
  },
  default: () => factoryPagination(announcementSkeleton),
})

useLpiHead2({
  title: computed(() => t('home.announcements')),
})
</script>

<template>
  <div class="announcements-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('home.announcements') }}
    </h1>

    <FetchLoader :status="status" only-error skeleton>
      <div class="announcemet-grid">
        <AnnouncementCard
          v-for="(announcement, index) in announcements"
          :key="index"
          :announcement="announcement"
          :to="{
            name: 'projectAnnouncements',
            params: { slugOrId: announcement.project.slug || announcement.project.id },
          }"
        />
      </div>
      <EmptyLabel v-if="announcements.length === 0" :label="$t('announcements.empty')" />
      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
.announcemet-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.page-title {
  margin-bottom: $space-2xl;
}

.announcements-page {
  margin-bottom: $space-2xl;
}
</style>
