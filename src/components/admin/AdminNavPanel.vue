<template>
  <NavPanelAside>
    <NavPanelMenu :menu-entries="groupTabs" :current-tab="currentTab" @navigated="navigated" />
  </NavPanelAside>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    groupTabs: any[]
    currentTab?: any
  }>(),
  { currentTab: null }
)

const emit = defineEmits<{ navigated: [] }>()
const navigated = () => emit('navigated')
</script>
