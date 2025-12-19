<template>
  <div
    :key="groupName"
    class="group-layout"
    :class="{
      'can-edit-group': canEditGroup,
      'group-edit-layout': isEditing,
      'group-display-layout': !isEditing,
    }"
  >
    <div class="page-section-extra-wide">
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
            :email="groupEmail"
            :can-edit-group="canEditGroup"
            :is-editing="isEditing"
            class="slide-panel"
            @navigated="collapseIfUnderBreakpoint"
            @toggle-editing="toggleEditing"
          />
        </template>
        <template v-if="currentTab" #content>
          <SubPageTitle :title-prefix="group.$t?.name" :current-tab="currentTab" />
          <NuxtPage v-bind="currentTab.props" />
        </template>
      </NavPanelLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getGroup } from '@/api/v2/group.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const uniqueId = 'group-nav-panel'
const { canEditGroup } = usePermissions()
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)
const organizationCode = useOrganizationCode()

const router = useRouter()
const route = useRoute()
const { t } = useNuxtI18n()
const groupName = computed(() => route.params.groupId.toString())

const { data: group, isLoading } = getGroup(organizationCode, groupName)

watch(
  group,
  () => {
    useLpiHead2({
      title: group.value?.name,
      description: group.value?.description,
      image: group.value?.header_image,
    })
  },
  { immediate: true }
)

const groupEmail = computed(() => {
  return group.value?.email
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
      route: { name: 'Group', params: { groupId: group.slug || group.id } },
    })),
  ]
})

const groupModules = computed<TranslatedPeopleGroupModel['modules']>(
  () =>
    group.value?.modules ?? {
      members: 0,
      featured_projects: 0,
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
      icon: 'Archive',
    },
  ]
})

const groupTabsDisplayFiltered = computed(() => {
  return groupTabsDisplay.value.filter((tab) => tab.condition)
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
  ]
})

const groupTabsEditFiltered = computed(() => {
  return groupTabsEdit.value.filter((tab) => tab.condition)
})

const groupTabs = computed(() => {
  return isEditing.value ? groupTabsEditFiltered.value : groupTabsDisplayFiltered.value
})

const allGroupsTabs = computed(() => [...groupTabsDisplay.value, ...groupTabsEdit.value])

const currentTab = computed(() => {
  return allGroupsTabs.value.find((tab) => route.fullPath === tab.view)
})

const isEditing = computed(() => currentTab.value?.isEditing || false)

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

watch(
  canEditGroup,
  (neo) => {
    if (!neo && isEditing.value) {
      if (import.meta.client) toggleEditing()
    }
  },
  {
    immediate: true,
  }
)

watch(
  isEditing,
  (neo) => {
    if (neo && !canEditGroup.value) {
      if (import.meta.client) toggleEditing()
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.group-layout,
.group-edit-layout {
  margin-top: pxToRem(48px);
}

.recommandations {
  margin-top: $space-2xl;
}
</style>
