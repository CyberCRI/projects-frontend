<script setup>
const props = defineProps({
  titlePrefix: {
    type: String,
    default: '',
  },
  currentTab: {
    type: Object,
    default: () => ({}),
  },
})
</script>
<template>
  <h2 v-if="currentTab && !currentTab.noTitle" class="sub-page-title">
    <span v-if="currentTab.icon" class="icon"><IconImage :name="currentTab.icon" /></span>
    <span v-if="titlePrefix" class="title-prefix">{{ titlePrefix }}</span>
    <span v-if="titlePrefix" class="separator">-</span>
    <span class="specific-title">{{ currentTab.label }}</span>
  </h2>
</template>
<style lang="scss" scoped>
.sub-page-title {
  color: $primary-dark;
  font-size: $font-size-4xl;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  gap: 0.6em;
  .icon svg {
    width: 1.2em;
    height: 1.2em;
    fill: $primary-dark;
  }
}
</style>
