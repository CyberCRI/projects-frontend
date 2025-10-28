<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { getOrganizationByCode } from '@/api/organizations.service'
import { sanitizeAnnouncementsList } from '@/api/sanitize/announcements'
import { api } from '@/api/SwaggerProjects'

const organizationsStore = useOrganizationsStore()
const { t } = useNuxtI18n()

const { status, data: announcements } = useAsyncData(
  'AnnouncementsList',
  () =>
    api.v1.announcementList({
      organizations: [organization.value.code],
      ordering: '-updated_at',
    }),
  {
    transform: ({ results }) => sanitizeAnnouncementsList(results),
  }
)

const organization = computed(() => {
  return organizationsStore.current
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('home.announcements')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  // DGAF
  console.log(err)
}
</script>
<template>
  <div class="announcements-page page-section-medium page-top">
    <h1 class="page-title">
      {{ $t('home.announcements') }}
    </h1>

    <AnnouncementCardListSkeleton v-if="status !== 'success'" />

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
