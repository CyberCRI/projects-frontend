<script setup>
import { getAnnouncements } from '@/api/announcements.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'

const organizationsStore = useOrganizationsStore()
const { t } = useI18n()

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
    announcements.value = results.filter(
      (announcement) =>
        announcement.project.publication_status !== 'private' &&
        (!announcement.deadline ||
          new Date(announcement.deadline) >= new Date().setHours(0, 0, 0, 0))
    )
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(doGetAnnouncements)

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('home.announcements')),
    organization?.dashboard_subtitle,
    organization?.banner_image?.variations?.medium
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>
<template>
  <div class="announcements-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $filters.capitalize($t('home.announcements')) }}
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
