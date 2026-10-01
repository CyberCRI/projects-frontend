<script setup lang="ts">
import type { MenuEntry } from '~/components/base/navigation/NavPanelMenu.vue'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import useOrganizationsStore from '~/stores/useOrganizations'
const organizationsStore = useOrganizationsStore()
const { isSuperAdmin, isAdmin } = usePermissions()

const hasVectorTabs = useRuntimeConfig().public.appHasVectorDb
const hasAgentTabs = useRuntimeConfig().public.appHasChatbotPromptDb

const { t } = useNuxtI18n()
const tabs = computed((): MenuEntry[] => {
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

  // TODO: also check is vector-store is enabled
  let vectorStoreTab = []
  let agentTabs = []

  if (hasVectorTabs && (isSuperAdmin.value || isAdmin.value)) {
    vectorStoreTab = [
      {
        key: 'admin-vector-store',
        label: t('admin.tabs.vector-store'),
        view: { name: 'VectorStoreAdminTab' },
        props: {},
        icon: 'Archive', // TODO: use a bulb or db icon
        condition: true,
      },
    ]
  }
  if (hasAgentTabs && (isSuperAdmin.value || isAdmin.value)) {
    agentTabs = [
      {
        key: 'admin-prompts',
        label: t('admin.tabs.prompts'),
        view: { name: 'PromptsAdminTab' },
        props: {},
        icon: 'Article', // TODO: use a bulb or db icon
        condition: true,
      },
      {
        key: 'admin-agent-skills',
        label: t('admin.tabs.agent-skills'),
        view: { name: 'AgentSkillsAdminTab' },
        props: {},
        icon: 'paletteLine', // TODO: use a bulb or db icon
        condition: true,
      },
      {
        key: 'admin-agents',
        label: t('admin.tabs.agents'),
        view: { name: 'AgentsAdminTab' },
        props: {},
        icon: 'Cog', // TODO: use a bulb or db icon
        condition: true,
      },
      {
        key: 'admin-side-assistant',
        label: t('admin.tabs.side-assistant'),
        view: { name: 'SideAssistantAdminTab' },
        props: {},
        icon: 'SparklingFill', // TODO: use a bulb or db icon
        condition: true,
      },
      {
        key: 'admin-conversations',
        label: t('admin.tabs.conversations'),
        view: { name: 'ConversationsAdminTab' },
        props: {},
        icon: 'ChatBubble', // TODO: use a bulb or db icon
        condition: true,
      },
      // TODO: keeping for now
      // {
      //   key: 'admin-checkpoints',
      //   label: t('admin.tabs.checkpoints'),
      //   view: { name: 'CheckpointsAdminTab' },
      //   props: {},
      //   icon: 'Article', // TODO: use a bulb or db icon
      //   condition: true,
      // },
    ]
  }

  return (
    [
      {
        key: 'admin-organization-ctn',
        label: t('admin.tabs.organization'),
        icon: 'Bank',
        submenu: [
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
            key: 'admin-terms',
            label: t('admin.tabs.terms'),
            view: { name: 'termsAdmin' },
            props: {},
            icon: 'Scales',
            condition: true,
          },
          // {
          //     key: 'admin-help',
          //     label: this.$t('admin.tabs.help'),
          //     view: { name: 'faq' },
          // },
        ],
      },
      {
        key: 'admin-projects-ctn',
        label: t('admin.tabs.projects'),
        icon: 'Atom',
        submenu: [
          {
            key: 'admin-categories',
            label: t('admin.tabs.categories'),
            view: { name: 'categories' },
            props: {},
            icon: 'FileTreeOutline',
            condition: true,
          },
          {
            key: 'admin-templates',
            label: t('admin.tabs.templates'),
            view: { name: 'templates' },
            props: {},
            icon: 'ClipBoard',
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
        ],
      },
      {
        key: 'admin-people-ctn',
        label: t('admin.tabs.people'),
        icon: 'MultiplePerson',
        submenu: [
          {
            key: 'admin-groups',
            label: t('admin.tabs.groups'),
            view: { name: 'groups' },
            props: {},
            icon: 'Users',
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
            key: 'admin-skills',
            label: t('admin.tabs.skills'),
            view: { name: 'skills' },
            props: {},
            icon: 'VipCrownLine',
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
        ],
      },
      {
        key: 'admin-assistants',
        label: t('admin.tabs.assistants'),
        icon: 'Robot',
        submenu: [...vectorStoreTab, ...agentTabs],
        condition: vectorStoreTab.length || agentTabs.length,
      },
    ] as MenuEntry[]
  ).map((entry) => ({ ...entry, dataTest: entry.key }))
})

const uniqueId = 'admin-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)

const onNavigated = collapseIfUnderBreakpoint

const route = useRoute()

const flatTabs = computed(() =>
  (tabs.value || []).reduce((acc, current) => {
    if (current.submenu) acc.push(...current.submenu)
    else acc.push(current)
    return acc
  }, [])
)

const currentTab = computed(() =>
  flatTabs.value.find((tab) => route?.matched?.find((m) => m?.name === tab?.view?.name))
)

const breadcrumbs = computed(() => [
  {
    name: t('admin.portal.management'),
    route: { name: 'Admin' },
  },
])

useLpiHead2({
  title: computed(() => t('admin.portal.management')),
})
</script>

<template>
  <div class="admin-portal-layout page-section-extra-wide page-top">
    <div class="page-section-extra-wide">
      <NavPanelLayout
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="breadcrumbs"
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
