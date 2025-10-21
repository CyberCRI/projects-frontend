<template>
  <NavPanelAside>
    <NavPanelMenu :menu-entries="groupTabs" :current-tab="currentTab" @navigated="navigated" />
  </NavPanelAside>
</template>

<script setup>
defineOptions({ name: 'AdminNavPanel' })
defineProps({
  groupTabs: { type: Array, required: true },
  currentTab: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['navigated'])
const navigated = () => {
  emits('navigated')
}
</script>
