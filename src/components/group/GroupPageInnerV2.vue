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
    <div v-if="groupData" class="page-section-extra-wide">
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
            @navigated="onNavigated"
            @toggle-editing="toggleEditing"
          />
        </template>
        <template v-if="currentTab" #content>
          <SubPageTitle :title-prefix="groupName" :current-tab="currentTab" />
          <NuxtPage v-bind="currentTab.props" />
        </template>
      </NavPanelLayout>
    </div>

    <NavPanelLoader v-else />
  </div>
</template>

<script setup lang="ts">
import { getGroup, getGroupMember, getGroupProject } from '@/api/groups.service'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'
defineOptions({ name: 'GroupPageInnerV2' })
const props = defineProps<{ groupId: number }>()
const uniqueId = 'group-nav-panel'
const peopleGroupsStore = usePeopleGroupsStore()
const { canEditGroup } = usePermissions()
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)
const onNavigated = collapseIfUnderBreakpoint
const { translateGroup } = useAutoTranslate()
const rawGroupData = ref({})
const groupData = translateGroup(rawGroupData)

const membersInitialRequest = ref({})
const projectsInitialRequest = ref({})
const isLoading = ref(true)
const isProjectsLoading = ref(true)
const isMembersLoading = ref(true)
const router = useRouter()
const route = useRoute()
const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()

const groupEmail = computed(() => {
  return groupData.value?.email
})
const groupVisibility = computed(() => {
  return groupData.value?.publication_status
})

const groupDescription = computed(() => {
  return groupData.value?.$t?.description
})
const groupShortDescription = computed(() => {
  return groupData.value?.$t?.short_description
})

const groupHierarchy = computed(() => {
  const root = {
    name: t('common.groups'),
    route: { name: 'Groups' },
  }
  if (!groupData.value) return [root]
  return [
    root,
    ...(groupData.value?.hierarchy || []).map((group) => ({
      name: group.name,
      route: { name: 'Group', params: { groupId: group.slug || group.id } },
    })),
  ]
})
const groupChildren = computed(() => {
  return groupData.value?.children
})

const groupModules = computed(() => groupData.value?.modules || {})

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
        group: groupData.value,
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
        group: groupData.value,
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
        group: groupData.value,
      },
      condition: groupModules.value.projects,
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
        group: groupData.value,
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
        groupData: groupData.value,
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
        groupData: groupData.value,
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

const allGroupsTabs = computed(() => {
  return [...groupTabsDisplay.value, ...groupTabsEdit.value]
})

const currentTab = computed(() => {
  return allGroupsTabs.value.find((tab) => route.fullPath === tab.view)
})

const isEditing = computed(() => {
  return currentTab.value?.isEditing || false
})

watch(
  () => props.groupId,
  (neo, old) => {
    if (neo && neo != old) {
      load()
    }
  },
  { immediate: true }
)

watch(
  canEditGroup,
  (neo) => {
    if (!neo && isEditing.value) {
      if (import.meta.client) router.push(currentTab.value.altView)
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
      if (import.meta.client) router.push(currentTab.value.altView)
    }
  },
  { immediate: true }
)

const toggleEditing = () => router.push(currentTab.value.altView)
const load = async () => {
  if (!import.meta.client) return
  isLoading.value = true
  isProjectsLoading.value = true
  isMembersLoading.value = true

  peopleGroupsStore.currentId = props.groupId
  try {
    await Promise.all([loadGroup(), loadGroupMembers(), loadGroupProjects()])
  } catch {
    console.error("group data couldn't be loaded")
  }

  isLoading.value = false
}

const loadGroup = async () => {
  try {
    isLoading.value = true
    rawGroupData.value = await getGroup(organizationCode, props.groupId, /*no error*/ true)

    // we can't use "props.groupId" because it might be a slug and not an id....
    peopleGroupsStore.currentId = groupData.value.id
  } catch {
    router.replace({
      name: 'page404',
      params: { pathMatch: route.path.substring(1).split('/') },
    })
  } finally {
    isLoading.value = false
  }
}

const loadGroupMembers = async () => {
  try {
    const groupMemberData = await getGroupMember(organizationCode, props.groupId, /*no error*/ true)
    membersInitialRequest.value = groupMemberData
  } finally {
    // no catch / log because it might be a permission denied
    isMembersLoading.value = false
  }
}

const loadGroupProjects = async () => {
  try {
    const groupProjectData = await getGroupProject(
      organizationCode,
      props.groupId,
      /*no error*/ true
    )
    projectsInitialRequest.value = groupProjectData
  } finally {
    // no catch / log because it might be a permission denied
    isProjectsLoading.value = false
  }
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
</style>
