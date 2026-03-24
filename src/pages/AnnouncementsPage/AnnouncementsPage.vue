<script setup lang="ts">
import { getAnnouncements } from '@/api/announcements.service'
import useOrganizationsStore from '@/stores/useOrganizations'

const organizationsStore = useOrganizationsStore()
const { t } = useNuxtI18n()

const announcements = useState(() => [])
const isLoading = useState(() => false)

const organization = computed(() => {
  return organizationsStore.current
})

const doGetAnnouncements = async () => {
  try {
    isLoading.value = true
    const { results } = await getAnnouncements({
      organizations: [organization.value.code],
      ordering: '-updated_at',
    })
    announcements.value = results.filter((announcement) => {
      if (announcement.project.publication_status === 'private') {
        return false
      }
      if (!announcement.deadline) {
        return true
      }
      const deadline = new Date(announcement.deadline)
      const now = new Date()
      now.setHours(0, 0, 0, 0)

      return deadline >= now
    })
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(doGetAnnouncements)

useLpiHead2({
  title: computed(() => t('home.announcements')),
})
</script>
<template>
  <div class="announcements-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('home.announcements') }}
    </h1>

    <AnnouncementCardListSkeleton v-if="isLoading" />

    <AnnouncementCardList v-else :announcements="announcements" :is-more-toggled="true" />
  </div>
</template>
<style lang="scss" scoped>
.page-title {
  margin-bottom: $space-2xl;
}

.announcements-page {
  margin-bottom: $space-2xl;
}
</style>
