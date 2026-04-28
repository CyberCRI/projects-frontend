<template>
  <DynamicGrid :min-gap="20" class="announcements-list">
    <template v-if="!isMoreToggled">
      <AnnouncementCard
        v-for="(announcement, index) in showedAnnouncements"
        :key="index"
        :announcement="announcement"
        @know-more-clicked="linkToAnnouncement(announcement)"
      />
    </template>

    <AnnouncementCard
      v-for="(announcement, index) in announcements"
      v-else
      :key="index"
      :announcement="announcement"
      @know-more-clicked="linkToAnnouncement(announcement)"
    />
  </DynamicGrid>
</template>

<script setup lang="ts">
import type { TranslatedAnnouncement } from '~/models/announcement.model'

import AnnouncementCard from '~/components/project/announcement/AnnouncementCard.vue'
import DynamicGrid from '~/components/base/DynamicGrid.vue'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    announcements: TranslatedAnnouncement[]
    isMoreToggled?: boolean
  }>(),
  {
    isMoreToggled: false,
  }
)

const showedAnnouncements = computed(() => {
  return props.isMoreToggled ? props.announcements : props.announcements.slice(0, 6)
})

const linkToAnnouncement = (announcement) => {
  router.push({
    name: 'projectAnnouncements',
    params: { slugOrId: announcement.project.slug },
    hash: '#tab',
  })
}
</script>

<style lang="scss" scoped>
.announcements-list {
  width: 100%;
  justify-content: center;
}

:deep(.announcement-card) {
  cursor: pointer;
}
</style>
