<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'
const organizationsStore = useOrganizationsStore()
import { getOrganizationByCode } from '@/api/organizations.service'

const { t } = useI18n()
const tabs = computed(() => {
  const requestAdminTab = organizationsStore.current?.access_request_enabled
    ? [
        {
          key: 'admin-requests',
          label: t('admin.tabs.requests'),
          view: { name: 'RequestsAdminTab' },
        },
      ]
    : []

  return [
    {
      key: 'admin-infos',
      label: t('admin.tabs.information'),
      view: { name: 'general' },
    },
    {
      key: 'admin-settings',
      label: t('admin.tabs.settings'),
      view: { name: 'AdminSettings' },
    },
    {
      key: 'admin-categories',
      label: t('admin.tabs.categories'),
      view: { name: 'categories' },
    },
    {
      key: 'admin-tags',
      label: t('admin.tabs.tags'),
      view: { name: 'tags' },
    },
    {
      key: 'admin-skills',
      label: t('admin.tabs.skills'),
      view: { name: 'skills' },
    },
    // {
    //     key: 'admin-help',
    //     label: this.$t('admin.tabs.help'),
    //     view: { name: 'faq' },
    // },
    {
      key: 'admin-templates',
      label: t('admin.tabs.templates'),
      view: { name: 'templates' },
    },
    {
      key: 'admin-roles',
      label: t('admin.tabs.users'),
      view: { name: 'Accounts' },
    },
    {
      key: 'admin-links',
      label: t('admin.tabs.links'),
      view: { name: 'links' },
    },
    ...requestAdminTab,
    {
      key: 'admin-groups',
      label: t('admin.tabs.groups'),
      view: { name: 'groups' },
    },
  ]
})

try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('admin.portal.management')),
    organization?.dashboard_subtitle,
    organization?.banner_image?.variations?.medium
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="admin-portal-layout page-section-extra-wide page-top">
    <h1 class="page-title">
      {{ $t('admin.portal.management') }}
    </h1>
    <TabsLayout :tabs="tabs" :border="false" align-left router-view />
  </div>
</template>
<style lang="scss" scoped>
.admin-portal-layout {
  .page-title {
    margin-bottom: $space-2xl;
  }
}
</style>
