<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'
const organizationsStore = useOrganizationsStore()
import { getOrganizationByCode } from '@/api/organizations.service'

const { t } = useNuxtI18n()
const tabs = computed(() => {
  const requestAdminTab = organizationsStore.current?.access_request_enabled
    ? [
        {
          key: 'admin-requests',
          label: t('admin.tabs.requests'),
          view: { name: 'RequestsAdminTab' },
          props: {},
          icon: 'Article',
          condition: true,
        },
      ]
    : []

  return [
    {
      key: 'admin-infos',
      label: t('admin.tabs.information'),
      view: { name: 'general' },
      props: {},
      icon: 'Globe',
      condition: true,
    },
    {
      key: 'admin-settings',
      label: t('admin.tabs.settings'),
      view: { name: 'AdminSettings' },
      props: {},
      icon: 'Cog',
      condition: true,
    },
    {
      key: 'admin-categories',
      label: t('admin.tabs.categories'),
      view: { name: 'categories' },
      props: {},
      icon: 'FileTreeOutline',
      condition: true,
    },
    {
      key: 'admin-tags',
      label: t('admin.tabs.tags'),
      view: { name: 'tags' },
      props: {},
      icon: 'Flag',
      condition: true,
    },
    {
      key: 'admin-skills',
      label: t('admin.tabs.skills'),
      view: { name: 'skills' },
      props: {},
      icon: 'VipCrownLine',
      condition: true,
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
      props: {},
      icon: 'CheckBoxBlankOutline',
      condition: true,
    },
    {
      key: 'admin-roles',
      label: t('admin.tabs.users'),
      view: { name: 'Accounts' },
      props: {},
      icon: 'Account',
      condition: true,
    },
    {
      key: 'admin-links',
      label: t('admin.tabs.links'),
      view: { name: 'links' },
      props: {},
      icon: 'LinkRotated',
      condition: true,
    },
    ...requestAdminTab,
    {
      key: 'admin-groups',
      label: t('admin.tabs.groups'),
      view: { name: 'groups' },
      props: {},
      icon: 'Users',
      condition: true,
    },
    {
      key: 'admin-terms',
      label: t('admin.tabs.terms'),
      view: { name: 'termsAdmin' },
      props: {},
      icon: 'Scales',
      condition: true,
    },
  ].map((entry) => ({ ...entry, dataTest: entry.key }))
})

const uniqueId = 'admin-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)

const onNavigated = collapseIfUnderBreakpoint

const route = useRoute()

const currentTab = computed(() =>
  tabs.value.find((tab) => route?.matched?.find((m) => m?.name === tab?.view?.name))
)

const breadcrumbs = computed(() => [
  {
    name: t('admin.portal.management'),
    route: { name: 'Admin' },
  },
])
try {
  const runtimeConfig = useRuntimeConfig()
  const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
  const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')

  useLpiHead(
    useRequestURL().toString(),
    computed(() => t('admin.portal.management')),
    organization?.dashboard_subtitle,
    image,
    dimensions
  )
} catch (err) {
  console.log(err)
}
</script>
<template>
  <div class="admin-portal-layout page-section-extra-wide page-top">
    <div class="page-section-extra-wide">
      <NavPanelLayout
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="breadcrumbs || []"
        @toggle-nav-panel="toggleNavPanel"
        @collapse-nav-panel="isNavCollapsed = true"
      >
        <template #nav-panel>
          <LazyAdminNavPanel
            v-if="!isNavCollapsed"
            :class="{ collapsed: isNavCollapsed }"
            :group-tabs="tabs"
            :current-tab="currentTab"
            class="slide-panel"
            @navigated="onNavigated"
          />
        </template>
        <template v-if="currentTab" #content>
          <SubPageTitle :title-prefix="$t('admin.portal.management')" :current-tab="currentTab" />
          <NuxtPage v-bind="currentTab.props" />
        </template>
      </NavPanelLayout>
    </div>
  </div>
</template>
