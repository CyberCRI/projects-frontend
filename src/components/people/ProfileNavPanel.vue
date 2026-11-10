<template>
  <NavPanelAside :class="{ 'profile-edit-tabs': isEditing }">
    <div v-if="canEditUser" class="edit-btn-ctn">
      <GroupButton
        :model-value="isEditing"
        :options="[
          { value: false, label: 'Show' },
          { value: true, label: 'Edit' },
        ]"
        :label="$t('profile.edit.edit')"
        btn-icon="Pen"
        :data-test="isEditing ? 'display-profile' : 'edit-profile'"
        class="edit-btn small"
        @update:model-value="switchView"
      />
    </div>

    <NavPanelMenu :menu-entries="profileTabs" :current-tab="currentTab" @navigated="navigated" />

    <div class="user-actions-ctn">
      <BaseModuleButton btn-icon="BookmarkLine" />
      <BaseModuleButton btn-icon="ShareLink" />
    </div>
  </NavPanelAside>
</template>

<script setup lang="ts">
import { usePermissionUser } from '~/composables/usePermissions/useUserPermissions'
import type { MenuEntry } from '~/components/base/navigation/NavPanelMenu.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
const props = withDefaults(
  defineProps<{
    user: TranslatedUserModel
    profileTabs?: MenuEntry[]
    currentTab?: MenuEntry
    isEditing?: boolean
  }>(),
  {
    profileTabs: () => [],
    currentTab: null,
    isEditing: false,
  }
)

const emit = defineEmits<{
  'toggle-editing': [boolean]
  navigated: []
}>()

const { canEditUser } = usePermissionUser(computed(() => props.user.id))

const navigated = () => emit('navigated')
const switchView = () => emit('toggle-editing', !props.isEditing)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.user-actions-ctn {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid variables.$lighter-gray;
  display: flex;
  justify-content: space-between;

  button {
    border: 1px solid variables.$primary;
    border-radius: 100%;
    padding: 0;
  }
}
</style>
