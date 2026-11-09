<template>
  <div
    :key="groupIdOrSlug"
    class="group-layout"
    :class="{
      'can-edit-group': canEditGroup,
      'group-edit-layout': isEditing,
      'group-display-layout': !isEditing,
    }"
  >
    <div class="page-section-extra-wide">
      <FetchLoader :status="status" :error="error" redirect-404 :with-data="!!group">
        <NavPanelLayout
          :is-loading="groupLoading"
          :is-nav-collapsed="isNavCollapsed"
          :breadcrumbs="groupHierarchy || []"
          @toggle-nav-panel="toggleNavPanel"
          @collapse-nav-panel="isNavCollapsed = true"
        >
          <template #nav-panel>
            <GroupNavPanel
              v-if="!groupLoading && !isNavCollapsed"
              :class="{ collapsed: isNavCollapsed }"
              :group-tabs="groupTabs"
              :current-tab="currentTab"
              :email="group?.email"
              :can-edit-group="canEditGroup"
              :is-editing="isEditing"
              class="slide-panel"
              @navigated="collapseIfUnderBreakpoint"
              @toggle-editing="toggleEditing"
            />
          </template>
          <template #content>
            <div class="group-content">
              <SubPageTitle :title-prefix="group.$t?.name" :current-tab="currentTab ?? {}" />
              <NuxtPage
                v-bind="{
                  ...defaultProps,
                  ...(currentTab?.props ?? {}),
                }"
              />
            </div>
          </template>
        </NavPanelLayout>
      </FetchLoader>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuEntry } from '~/components/base/navigation/NavPanelMenu.vue'

import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

import { getGroup } from '~/api/v2/group.service'

import { useLpiHead2 } from '~/composables/useLpiHead'

import { usePermissionGroup } from '~/composables/usePermissions/useGroupPermissions'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { onClient } from '~/composables/onClient'

const uniqueId = 'group-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)
const organizationCode = useOrganizationCode()

const router = useRouter()
const route = useRoute()
const { t } = useNuxtI18n()
const groupIdOrSlug = computed(() => route.params.groupIdOrSlug.toString())

const { data: group, isLoading, status, error } = getGroup(organizationCode, groupIdOrSlug)

const { canEditGroup } = usePermissionGroup(computed(() => group.value?.id))

const groupLoading = computed(() => isLoading.value && !group.value?.id)

watchEffect(() => {
  useLpiHead2({
    title: group.value?.name,
    description: group.value?.description,
    image: group.value?.header_image,
  })
})

const groupHierarchy = computed(() => {
  const root = {
    name: t('common.groups'),
    route: { name: 'Groups' },
  }
  if (!group.value) return [root]
  const res = [
    root,
    ...(group.value?.hierarchy || []).map((group) => ({
      name: group.name,
      route: {
        name: 'Group',
        params: { groupIdOrSlug: group.slug || group.id },
      },
    })),
    {
      name: group.value.name,
      route: {
        name: 'Group',
        params: { groupIdOrSlug: group.value.slug || group.value.id },
      },
    },
  ]
  if (currentTab.value) {
    res.push({
      name: currentTab.value.label,
      route: currentTab.value.view,
    })
  }
  return res
})

const groupModules = computed(() => group.value?.modules ?? groupSkeleton()['modules'])

const defaultProps = computed(() => {
  return {
    group: group.value,
    isLoading: groupLoading.value,
    editable: isEditing.value,
  }
})

// TODO:
const isTeam = computed(() => true)
// TODO:
const isStructure = computed(() => true)

const groupTabsDisplay = computed(() => {
  return [
    {
      isEditing: false,
      key: 'group-snapshot',
      dataTest: 'group-snapshot',
      label: t('group.snapshot'),
      view: `/group/${route.params.groupIdOrSlug}/snapshot`,
      altView: `/group/${route.params.groupIdOrSlug}/snapshot/edit`,
      condition: true,
      noTitle: true,
      icon: 'Home',
    },
    {
      isEditing: false,
      key: 'group-teams',
      label: t(GROUP_MODULE_TITLE.team, groupModules.value.teams),
      tabLabel: t(GROUP_MODULE_TITLE.teamTab),
      label: t('group.teams'),
      view: `/group/${route.params.groupIdOrSlug}/teams`,
      altView: `/group/${route.params.groupIdOrSlug}/teams/edit`,
      condition: isStructure.value,
      noTitle: true,
      icon: GROUP_MODULE_ICON.members,
    },
    {
      isEditing: false,
      key: 'group-members',
      dataTest: 'group-members',
      label: t(GROUP_MODULE_TITLE.members, groupModules.value.members),
      view: `/group/${route.params.groupIdOrSlug}/members`,
      altView: `/group/${route.params.groupIdOrSlug}/members/edit`,
      condition: !!groupModules.value.members,
      icon: GROUP_MODULE_ICON.members,
    },
    {
      isEditing: false,
      key: 'group-projects',
      dataTest: 'group-projects',
      label: t(GROUP_MODULE_TITLE.featured_projects, groupModules.value.featured_projects),
      view: `/group/${route.params.groupIdOrSlug}/projects`,
      altView: `/group/${route.params.groupIdOrSlug}/projects/edit`,
      condition: !!groupModules.value.featured_projects,
      icon: GROUP_MODULE_ICON.featured_projects,
    },
    {
      isEditing: false,
      key: 'subgroup',
      dataTest: 'subgroup',
      label: t(GROUP_MODULE_TITLE.subgroups, groupModules.value.subgroups),
      view: `/group/${route.params.groupIdOrSlug}/subgroups`,
      altView: '',
      condition: !!groupModules.value.subgroups,
      icon: GROUP_MODULE_ICON.subgroups,
    },
    {
      isEditing: false,
      key: 'group-publications',
      dataTest: 'group-publications',
      label: t(GROUP_MODULE_TITLE.publications, GROUP_MODULE_TITLE.publications),
      tabLabel: t(GROUP_MODULE_TITLE.publicationsTab),
      view: `/group/${route.params.groupIdOrSlug}/publications`,
      altView: `/group/${route.params.groupIdOrSlug}/publications/edit`,
      props: {
        documentType: 'publications',
      },
      condition: !!groupModules.value.publications,
      icon: GROUP_MODULE_ICON.publications,
    },
    {
      isEditing: false,
      key: 'group-conferences',
      dataTest: 'group-conferences',
      label: t(GROUP_MODULE_TITLE.conferences, groupModules.value.conferences),
      tabLabel: t(GROUP_MODULE_TITLE.conferencesTab),
      view: `/group/${route.params.groupIdOrSlug}/conferences`,
      altView: `/group/${route.params.groupIdOrSlug}/conferences/edit`,
      props: {
        documentType: 'conferences',
      },
      condition: !!groupModules.value.conferences,
      icon: GROUP_MODULE_ICON.conferences,
    },
    {
      isEditing: false,
      key: 'group-news',
      dataTest: 'group-news',
      label: t(GROUP_MODULE_TITLE.news, groupModules.value.news),
      view: `/group/${route.params.groupIdOrSlug}/news`,
      altView: `/group/${route.params.groupIdOrSlug}/news/edit`,
      condition: !!groupModules.value.news,
      icon: GROUP_MODULE_ICON.news,
    },
    {
      isEditing: false,
      key: 'group-event',
      dataTest: 'group-event',
      label: t(GROUP_MODULE_TITLE.event, groupModules.value.event),
      view: `/group/${route.params.groupIdOrSlug}/event`,
      altView: `/group/${route.params.groupIdOrSlug}/event/edit`,
      condition: !!groupModules.value.event,
      icon: GROUP_MODULE_ICON.event,
    },
    {
      isEditing: false,
      key: 'group-domains',
      dataTest: 'group-domains',
      label: t(GROUP_MODULE_TITLE.domain, groupModules.value.domains),
      tabLabel: t(GROUP_MODULE_TITLE.domainTab),
      view: `/group/${route.params.groupIdOrSlug}/domains`,
      altView: `/group/${route.params.groupIdOrSlug}/domains/edit`,
      condition: isStructure.value,
      noTitle: false,
      icon: GROUP_MODULE_ICON.domain,
    },
    {
      isEditing: false,
      key: 'group-locations',
      dataTest: 'group-locations',
      label: t(GROUP_MODULE_TITLE.network, groupModules.value.locations),
      tabLabel: t(GROUP_MODULE_TITLE.networkTab),
      view: `/group/${route.params.groupIdOrSlug}/locations`,
      altView: `/group/${route.params.groupIdOrSlug}/locations/edit`,
      condition: !!groupModules.value.locations,
      icon: GROUP_MODULE_ICON.network,
    },
    {
      isEditing: false,
      key: 'group-gallery',
      dataTest: 'group-gallery',
      label: t(GROUP_MODULE_TITLE.gallery, groupModules.value.gallery),
      view: `/group/${route.params.groupIdOrSlug}/gallery`,
      altView: `/group/${route.params.groupIdOrSlug}/gallery/edit`,
      condition: !!groupModules.value.gallery,
      icon: GROUP_MODULE_ICON.gallery,
    },
    {
      isEditing: false,
      key: 'group-positions',
      dataTest: 'group-positions',
      label: t(GROUP_MODULE_TITLE.positions, groupModules.value.positions),
      tabLabel: t(GROUP_MODULE_TITLE.positionsTab),
      view: `/group/${route.params.groupIdOrSlug}/positions`,
      altView: `/group/${route.params.groupIdOrSlug}/positions/edit`,
      condition: isStructure.value || isTeam.value,
      noTitle: false,
      icon: GROUP_MODULE_ICON.positions,
    },
    {
      isEditing: false,
      key: 'group-awards',
      dataTest: 'group-awards',
      label: t(GROUP_MODULE_TITLE.awards, groupModules.value.awards),
      tabLabel: t(GROUP_MODULE_TITLE.awardsTab),
      view: `/group/${route.params.groupIdOrSlug}/awards`,
      altView: `/group/${route.params.groupIdOrSlug}/awards/edit`,
      condition: isStructure.value,
      noTitle: false,
      icon: GROUP_MODULE_ICON.awards,
    },
    {
      isEditing: false,
      key: 'group-funding',
      dataTest: 'group-funding',
      label: t(GROUP_MODULE_TITLE.fundings, groupModules.value.funding),
      tabLabel: t(GROUP_MODULE_TITLE.fundingsTab),
      view: `/group/${route.params.groupIdOrSlug}/funding`,
      altView: `/group/${route.params.groupIdOrSlug}/funding/edit`,
      condition: isStructure.value,
      noTitle: false,
      icon: GROUP_MODULE_ICON.fundings,
    },
    {
      isEditing: false,
      key: 'group-teaching',
      dataTest: 'group-teaching',
      label: t(GROUP_MODULE_TITLE.teaching, groupModules.value.teaching),
      tabLabel: t(GROUP_MODULE_TITLE.teachingTab),
      view: `/group/${route.params.groupIdOrSlug}/teaching`,
      altView: `/group/${route.params.groupIdOrSlug}/teaching/edit`,
      condition: isStructure.value,
      noTitle: false,
      icon: GROUP_MODULE_ICON.teachings,
    },
    {
      isEditing: false,
      key: 'group-platform',
      dataTest: 'group-platform',
      label: t(GROUP_MODULE_TITLE.platform, groupModules.value.tools),
      tabLabel: t(GROUP_MODULE_TITLE.platformTab),
      view: `/group/${route.params.groupIdOrSlug}/platform`,
      altView: `/group/${route.params.groupIdOrSlug}/funding/platform`,
      condition: false, // && isStructure.value,
      noTitle: false,
      icon: GROUP_MODULE_ICON.platform,
    },
  ] satisfies MenuEntry[]
})

const groupTabsEdit = computed(() => {
  return [
    {
      isEditing: true,
      key: 'group-snapshot-edit',
      dataTest: 'group-snapshot-edit',
      label: t('group.snapshot'),
      view: `/group/${route.params.groupIdOrSlug}/snapshot/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/snapshot`,
      condition: true,
      noTitle: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'groups-members-edit',
      dataTest: 'groups-members-edit',
      label: t(GROUP_MODULE_TITLE.members, groupModules.value.members),
      view: `/group/${route.params.groupIdOrSlug}/members/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/members`,
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-projects-edit',
      dataTest: 'group-projects-edit',
      label: t(GROUP_MODULE_TITLE.featured_projects, groupModules.value.featured_projects),
      view: `/group/${route.params.groupIdOrSlug}/projects/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/projects`,
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-publications-edit',
      dataTest: 'group-publications-edit',
      label: t(GROUP_MODULE_TITLE.publications, groupModules.value.publications),
      view: `/group/${route.params.groupIdOrSlug}/publications/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/publications`,
      props: {
        documentType: 'publications',
      },
      condition: false,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-conferences-edit',
      dataTest: 'group-conferences-edit',
      label: t(GROUP_MODULE_TITLE.conferences, groupModules.value.conferences),
      view: `/group/${route.params.groupIdOrSlug}/conferences/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/conferences`,
      props: {
        documentType: 'conferences',
      },
      condition: false,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-news-edit',
      dataTest: 'group-news-edit',
      label: t(GROUP_MODULE_TITLE.news, groupModules.value.news),
      view: `/group/${route.params.groupIdOrSlug}/news/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/news`,
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-event-edit',
      dataTest: 'group-event-edit',
      label: t(GROUP_MODULE_TITLE.event, groupModules.value.event),
      view: `/group/${route.params.groupIdOrSlug}/event/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/event`,
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-gallery-edit',
      dataTest: 'group-gallery-edit',
      label: t(GROUP_MODULE_TITLE.gallery, groupModules.value.gallery),
      view: `/group/${route.params.groupIdOrSlug}/gallery/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/gallery`,
      condition: true,
      icon: 'Pen',
    },
  ] satisfies MenuEntry[]
})

const groupTabsDisplayFiltered = computed(() => {
  return groupTabsDisplay.value.filter((tab) => tab.condition)
})

const groupTabsEditFiltered = computed(() => {
  return groupTabsEdit.value.filter((tab) => tab.condition)
})

const currentTab = computed(() => {
  return allGroupsTabs.value.find((tab) => route.path === tab.view)
})

const isEditing = computed(() => currentTab.value?.isEditing || false)

const groupTabs = computed(() => {
  return isEditing.value ? groupTabsEditFiltered.value : groupTabsDisplayFiltered.value
})

const allGroupsTabs = computed(() => [...groupTabsDisplay.value, ...groupTabsEdit.value])

const toggleEditing = () => {
  const nextTab = allGroupsTabs.value.find((tab) => tab.view === currentTab.value.altView)
  // if altview exists and is active, go to the page
  if (nextTab && nextTab.condition) {
    router.push(currentTab.value.altView)
  } else {
    // else we go to "home" page of edit/show tabs directly
    const tabHome = isEditing.value ? groupTabsDisplay.value[0] : groupTabsEdit.value[0]
    router.push(tabHome.view)
  }
}

watchEffect(
  onClient(() => {
    if (isEditing.value && !canEditGroup.value) {
      toggleEditing()
    }
  })
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.group-layout,
.group-edit-layout {
  margin-top: variables.pxtorem(48px);
}
</style>
