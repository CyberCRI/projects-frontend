<template>
  <NavPanelAside>
    <NavPanelMenu :menu-entries="groupTabs" :current-tab="currentTab" @navigated="navigated" />
  </NavPanelAside>
</template>

<script>
export default {
  name: 'AdminNavPanel',

  props: {
    groupTabs: { type: Array, required: true },
    currentTab: {
      type: Object,
      default: () => {},
    },
  },

  emits: ['navigated'],
  // data() {
  //   return {
  //     addToProjectMenuVisible: false,
  //   }
  // },
  methods: {
    navigated() {
      this.$emit('navigated')
    },
  },
}
</script>
