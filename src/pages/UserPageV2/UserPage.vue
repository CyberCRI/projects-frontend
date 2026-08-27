<script setup lang="ts">
import { usePermissionUser } from '~/composables/usePermissions/useUserPermissions'
import ProfileNavPanel from '~/components/people/ProfileNavPanel.vue'
import { useUserFullName } from '~/composables/user/useUserFullName'
import type { UserSlugOrId } from 'shared-projects-frontend/models'
import { useUserTabs } from '~/composables/user/useUserTabs'
import { userSkeleton } from '~/skeletons/user.skeletons'
import { getUser } from '~/api/v2/user.service'

const props = withDefaults(
  defineProps<{
    setHeader?: boolean
  }>(),
  {
    setHeader: false,
  }
)

const route = useRoute()

const uniqueId = 'user-nav-panel'
const { isNavCollapsed, toggleNavPanel, collapseIfUnderBreakpoint } =
  useToggleableNavPanel(uniqueId)

const userIdOrSlug = computed<UserSlugOrId>(() => route.params.userIdOrSlug.toString())
const organizationCode = useOrganizationCode()
const {
  status,
  data: user,
  error,
  isLoading,
} = getUser(organizationCode, userIdOrSlug, {
  default: userSkeleton,
})

const userFullName = useUserFullName(user)

const { canEditUser } = usePermissionUser(userIdOrSlug)

const { tabs, currentTab, isEditing, toggleEditing } = useUserTabs(userIdOrSlug, user)

watchEffect(() => {
  if (!props.setHeader) {
    return
  }
  useLpiHead2({
    title: userFullName.value,
    description: user.value?.$t.short_description,
    image: user.value?.profile_picture,
  })
})

const editable = computed(() => isEditing.value && canEditUser.value)

const propsTab = computed(() => ({
  editable: editable.value,
  user: user.value,
  ...(currentTab.value.props || {}),
  // only add loading when project is not set or is skeleton
  loading: !user.value?.id && isLoading.value,
}))
</script>

<template>
  <div
    class="page-section-extra-wide project-layout"
    :class="{
      'project-edit-layout': isEditing,
      'project-display-layout': !isEditing,
    }"
  >
    <FetchLoader
      :status="status"
      only-error
      :error="error"
      error404
      skeleton
      :with-data="!!user?.id"
    >
      <NavPanelLayout
        :is-nav-collapsed="isNavCollapsed"
        :breadcrumbs="[
          {
            name: $t('common.people'),
            route: { name: 'People' },
          },
        ]"
        @toggle-nav-panel="toggleNavPanel"
        @collapse-nav-panel="isNavCollapsed = true"
      >
        <template #nav-panel>
          <ProfileNavPanel
            v-if="!isNavCollapsed"
            class="slide-panel"
            :class="{ collapsed: isNavCollapsed }"
            :profile-tabs="tabs"
            :current-tab="currentTab"
            :user="user"
            :is-editing="isEditing"
            @toggle-editing="toggleEditing"
            @navigated="collapseIfUnderBreakpoint"
          />
        </template>
        <template #content>
          <SubPageTitle :title-prefix="userFullName" :current-tab="currentTab" />
          <NuxtPage v-if="currentTab" v-bind="propsTab" />
        </template>
      </NavPanelLayout>
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.profile-layout {
  margin-top: variables.pxtorem(48px);
}
</style>
