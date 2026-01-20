<template>
  <div
    :key="groupId"
    class="group-layout"
    :class="{
      'can-edit-group': canEditGroup,
      'group-edit-layout': isEditing,
      'group-display-layout': !isEditing,
    }"
  >
    <div class="page-section-extra-wide">
      <FetchLoader :status="status">
        <NavPanelLayout
          :is-loading="isLoading"
          :is-nav-collapsed="isNavCollapsed"
          :breadcrumbs="groupHierarchy || []"
          @toggle-nav-panel="toggleNavPanel"
          @collapse-nav-panel="isNavCollapsed = true"
        >
          <template #nav-panel>
            <LazyGroupNavPanel
              v-if="!isLoading && !isNavCollapsed"
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
          <template v-if="currentTab" #content>
            <div class="group-content">
              <SubPageTitle :title-prefix="group.$t?.name" :current-tab="currentTab" />
              <NuxtPage v-bind="currentTab.props" />
            </div>
          </template>
        </NavPanelLayout>
      </FetchLoader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getGroup } from '@/api/v2/group.service'
import { useLpiHead2 } from '@/composables/useLpiHead'

const uniqueId = 'group-nav-panel'
const { canEditGroup } = usePermissions()
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)
const organizationCode = useOrganizationCode()

const router = useRouter()
const route = useRoute()
const { t } = useNuxtI18n()
const groupId = computed(() => parseInt(route.params.groupId.toString(), 10))

const { data: group, isLoading, status } = getGroup(organizationCode, groupId)

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
  return [
    root,
    ...(group.value?.hierarchy || []).map((group) => ({
      name: group.name,
      route: { name: 'Group', params: { groupId: group.id } },
    })),
  ]
})

const groupModules = computed(
  () =>
    group.value?.modules ?? {
      members: 0,
      featured_projects: 0,
      publications: 0,
      conferences: 0,
    }
)

const groupTabsDisplay = computed(() => {
  return [
    {
      isEditing: false,
      key: 'group-snapshot',
      dataTest: 'group-snapshot',
      label: t('group.snapshot'),
      view: `/group/${route.params.groupId}/snapshot`,
      altView: `/group/${route.params.groupId}/snapshot/edit`,
      props: {
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: true,
      noTitle: true,
      icon: 'Home',
    },
    {
      isEditing: false,
      key: 'group-members',
      dataTest: 'group-members',
      label: t('group.members'),
      view: `/group/${route.params.groupId}/members`,
      altView: `/group/${route.params.groupId}/members/edit`,
      props: {
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: groupModules.value.members,
      icon: 'Users',
    },
    {
      isEditing: false,
      key: 'group-projects',
      dataTest: 'group-projects',
      label: t('group.projects'),
      view: `/group/${route.params.groupId}/projects`,
      altView: `/group/${route.params.groupId}/projects/edit`,
      props: {
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: groupModules.value.featured_projects,
      icon: 'Briefcase',
    },
    {
      isEditing: false,
      key: 'group-publications',
      dataTest: 'group-publications',
      label: t('group.publications'),
      view: `/group/${route.params.groupId}/publications`,
      altView: `/group/${route.params.groupId}/publications/edit`,
      props: {
        documentType: 'publications',
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: groupModules.value.publications,
      icon: 'Article',
    },
    {
      isEditing: false,
      key: 'group-conferences',
      dataTest: 'group-conferences',
      label: t('group.conferences'),
      view: `/group/${route.params.groupId}/conferences`,
      altView: `/group/${route.params.groupId}/conferences/edit`,
      props: {
        documentType: 'conferences',
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: groupModules.value.conferences,
      icon: 'Article',
    },
  ]
})

const groupTabsEdit = computed(() => {
  return [
    {
      isEditing: true,
      key: 'group-snapshot-edit',
      dataTest: 'group-snapshot-edit',
      label: t('group.snapshot'),
      view: `/group/${route.params.groupId}/snapshot/edit`,
      altView: `/group/${route.params.groupId}/snapshot`,
      props: {
        isInEditingMode: true,
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: true,
      noTitle: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'groups-members-edit',
      dataTest: 'groups-members-edit',
      label: t('group.members'),
      view: `/group/${route.params.groupId}/members/edit`,
      altView: `/group/${route.params.groupId}/members`,
      props: {
        isInEditingMode: true,
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-projects-edit',
      dataTest: 'group-projects-edit',
      label: t('group.projects'),
      view: `/group/${route.params.groupId}/projects/edit`,
      altView: `/group/${route.params.groupId}/projects`,
      props: {
        isInEditingMode: true,
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-publications-edit',
      dataTest: 'group-publications-edit',
      label: t('group.publications'),
      view: `/group/${route.params.groupId}/publications/edit`,
      altView: `/group/${route.params.groupId}/publications`,
      props: {
        documentType: 'publications',
        isInEditingMode: true,
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-conferences-edit',
      dataTest: 'group-conferences-edit',
      label: t('group.conferences'),
      view: `/group/${route.params.groupId}/conferences/edit`,
      altView: `/group/${route.params.groupId}/conferences`,
      props: {
        documentType: 'conferences',
        isInEditingMode: true,
        group: group.value,
        isLoading: isLoading.value,
      },
      condition: true,
      icon: 'Pen',
    },
  ]
})

const groupTabsDisplayFiltered = computed(() => {
  return groupTabsDisplay.value.filter((tab) => tab.condition)
})

const groupTabsEditFiltered = computed(() => {
  return groupTabsEdit.value.filter((tab) => tab.condition)
})

const currentTab = computed(() => {
  return allGroupsTabs.value.find((tab) => route.fullPath === tab.view)
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

if (import.meta.client) {
  watchEffect(() => {
    if (isEditing.value && !canEditGroup.value) {
      toggleEditing()
    }
  })
}
</script>

<style lang="scss" scoped>
.group-layout,
.group-edit-layout {
  margin-top: pxToRem(48px);
}

.recommandations {
  margin-top: $space-2xl;
}

.group-content {
  //   background-color: #f0f3f5;
  //   padding: 1rem;
  //   border-radius: 0.5rem;
}
</style>
