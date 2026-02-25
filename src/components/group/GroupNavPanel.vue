<template>
  <NavPanelAside>
    <div v-if="canEditGroup" class="edit-btn-ctn">
      <GroupButton
        :model-value="isEditing"
        :options="[
          { value: false, label: 'Show' },
          { value: true, label: 'Edit' },
        ]"
        btn-icon="Pen"
        :data-test="isEditing ? 'show-group' : 'edit-group'"
        class="panel-mode-switcher edit-btn small"
        @update:model-value="switchView"
      />
    </div>

    <NavPanelMenu :menu-entries="groupTabs" :current-tab="currentTab" @navigated="navigated" />
  </NavPanelAside>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    groupTabs: any
    currentTab?: object
    canEditGroup?: boolean
    isEditing?: boolean
  }>(),
  {
    currentTab: () => ({}),
    canEditGroup: false,
    isEditing: false,
  }
)

const emit = defineEmits<{
  navigated: []
  'toggle-editing': [boolean]
}>()

const navigated = () => emit('navigated')
const switchView = () => emit('toggle-editing', !props.isEditing)
</script>

<style lang="scss" scoped>
.edit-btn-ctn {
  padding-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.group-contacts-ctn {
  border: 1px solid $lighter-gray;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
}
</style>
