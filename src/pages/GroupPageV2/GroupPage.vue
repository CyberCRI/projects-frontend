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
      <FetchLoader :status="status" :error="error" redirect-404 :with-data="!!group.id">
        <NavPanelLayout
          :is-loading="groupLoading"
          :is-nav-collapsed="isNavCollapsed"
          :breadcrumbs="groupHierarchy || []"
          @toggle-nav-panel="toggleNavPanel"
          @collapse-nav-panel="isNavCollapsed = true"
        >
          <template #nav-panel>
            <LazyGroupNavPanel
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
import { getGroup } from '@/api/v2/group.service'
import { useLpiHead2 } from '@/composables/useLpiHead'
import { GroupModuleIcon, GroupModuleTitle } from '@/models/invitation.model'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import usePeopleGroupsStore from '@/stores/usePeopleGroups'

const uniqueId = 'group-nav-panel'
const peopleGroupsStore = usePeopleGroupsStore()
const { canEditGroup } = usePermissions()
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)
const organizationCode = useOrganizationCode()

const router = useRouter()
const route = useRoute()
const { t } = useNuxtI18n()
const groupIdOrSlug = computed(() => route.params.groupIdOrSlug.toString())
watch(groupIdOrSlug, (newValue) => (peopleGroupsStore.currentId = newValue))

const { data: group, isLoading, status, error } = getGroup(organizationCode, groupIdOrSlug)

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
  return [
    root,
    ...(group.value?.hierarchy || []).map((group) => ({
      name: group.name,
      route: { name: 'Group', params: { groupIdOrSlug: group.slug || group.id } },
    })),
  ]
})

const groupModules = computed(() => group.value?.modules ?? groupSkeleton()['modules'])

const defaultProps = computed(() => {
  return {
    group: group.value,
    isLoading: groupLoading.value,
  }
})

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
      key: 'group-members',
      dataTest: 'group-members',
      label: t(GroupModuleTitle.members),
      view: `/group/${route.params.groupIdOrSlug}/members`,
      altView: `/group/${route.params.groupIdOrSlug}/members/edit`,
      condition: groupModules.value.members,
      icon: GroupModuleIcon.members,
    },
    {
      isEditing: false,
      key: 'group-projects',
      dataTest: 'group-projects',
      label: t(GroupModuleTitle.featured_projects),
      view: `/group/${route.params.groupIdOrSlug}/projects`,
      altView: `/group/${route.params.groupIdOrSlug}/projects/edit`,
      condition: groupModules.value.featured_projects,
      icon: GroupModuleIcon.featured_projects,
    },
    {
      isEditing: false,
      key: 'subgroup',
      dataTest: 'subgroup',
      label: t(GroupModuleTitle.subgroups, groupModules.value.subgroups),
      view: `/group/${route.params.groupIdOrSlug}/subgroups`,
      altView: '',
      condition: groupModules.value.subgroups,
      icon: GroupModuleIcon.subgroups,
    },
    {
      isEditing: false,
      key: 'group-publications',
      dataTest: 'group-publications',
      label: t(GroupModuleTitle.publications),
      view: `/group/${route.params.groupIdOrSlug}/publications`,
      altView: `/group/${route.params.groupIdOrSlug}/publications/edit`,
      props: {
        documentType: 'publications',
      },
      condition: groupModules.value.publications,
      icon: GroupModuleIcon.publications,
    },
    {
      isEditing: false,
      key: 'group-conferences',
      dataTest: 'group-conferences',
      label: t(GroupModuleTitle.conferences),
      view: `/group/${route.params.groupIdOrSlug}/conferences`,
      altView: `/group/${route.params.groupIdOrSlug}/conferences/edit`,
      props: {
        documentType: 'conferences',
      },
      condition: groupModules.value.conferences,
      icon: GroupModuleIcon.conferences,
    },
    {
      isEditing: false,
      key: 'group-news',
      dataTest: 'group-news',
      label: t(GroupModuleTitle.news),
      view: `/group/${route.params.groupIdOrSlug}/news`,
      altView: `/group/${route.params.groupIdOrSlug}/news/edit`,
      condition: groupModules.value.news,
      icon: GroupModuleIcon.news,
    },
    {
      isEditing: false,
      key: 'group-event',
      dataTest: 'group-event',
      label: t(GroupModuleTitle.news),
      view: `/group/${route.params.groupIdOrSlug}/event`,
      altView: `/group/${route.params.groupIdOrSlug}/event/edit`,
      condition: groupModules.value.event,
      icon: GroupModuleIcon.event,
    },
    {
      isEditing: false,
      key: 'group-locations',
      dataTest: 'group-locations',
      label: t(GroupModuleTitle.projects_locations, groupModules.value.projects_locations),
      view: `/group/${route.params.groupIdOrSlug}/locations`,
      altView: `/group/${route.params.groupIdOrSlug}/locations/edit`,
      condition: groupModules.value.projects_locations,
      icon: GroupModuleIcon.projects_locations,
    },
    {
      isEditing: false,
      key: 'group-gallery',
      dataTest: 'group-gallery',
      label: t(GroupModuleTitle.gallery, groupModules.value.gallery),
      view: `/group/${route.params.groupIdOrSlug}/gallery`,
      altView: `/group/${route.params.groupIdOrSlug}/gallery/edit`,
      condition: groupModules.value.gallery,
      icon: GroupModuleIcon.gallery,
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
      view: `/group/${route.params.groupIdOrSlug}/snapshot/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/snapshot`,
      props: {
        isInEditingMode: true,
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
      view: `/group/${route.params.groupIdOrSlug}/members/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/members`,
      props: {
        isInEditingMode: true,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-projects-edit',
      dataTest: 'group-projects-edit',
      label: t('group.projects'),
      view: `/group/${route.params.groupIdOrSlug}/projects/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/projects`,
      props: {
        isInEditingMode: true,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-publications-edit',
      dataTest: 'group-publications-edit',
      label: t('group.publications'),
      view: `/group/${route.params.groupIdOrSlug}/publications/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/publications`,
      props: {
        documentType: 'publications',
        isInEditingMode: true,
      },
      condition: false,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-conferences-edit',
      dataTest: 'group-conferences-edit',
      label: t('group.conferences'),
      view: `/group/${route.params.groupIdOrSlug}/conferences/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/conferences`,
      props: {
        documentType: 'conferences',
        isInEditingMode: true,
      },
      condition: false,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-news-edit',
      dataTest: 'group-news-edit',
      label: t('group.news'),
      view: `/group/${route.params.groupIdOrSlug}/news/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/news`,
      props: {
        isInEditingMode: true,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-event-edit',
      dataTest: 'group-event-edit',
      label: t('group.event'),
      view: `/group/${route.params.groupIdOrSlug}/event/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/event`,
      props: {
        isInEditingMode: true,
      },
      condition: true,
      icon: 'Pen',
    },
    {
      isEditing: true,
      key: 'group-gallery-edit',
      dataTest: 'group-gallery-edit',
      label: t(GroupModuleTitle.gallery),
      view: `/group/${route.params.groupIdOrSlug}/gallery/edit`,
      altView: `/group/${route.params.groupIdOrSlug}/gallery`,
      props: {
        isInEditingMode: true,
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
</style>
