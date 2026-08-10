<script setup lang="ts">
withDefaults(
  defineProps<{
    titlePrefix?: string
    currentTab?: any
  }>(),
  {
    titlePrefix: '',
    currentTab: () => ({}),
  }
)
</script>
<template>
  <h2 v-if="currentTab && !currentTab.noTitle" class="sub-page-title">
    <!--span v-if="currentTab.icon" class="icon"><IconImage :name="currentTab.icon" /></span-->
    <span v-if="titlePrefix" class="title-prefix">{{ titlePrefix }}</span>
    <template v-if="currentTab.label">
      <span v-if="titlePrefix" class="separator">-</span>
      <span class="specific-title">{{ currentTab.label }}</span>
    </template>
  </h2>
</template>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.sub-page-title {
  color: variables.$primary-dark;
  font-size: variables.$font-size-4xl;
  justify-content: flex-start;
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  gap: 0.6em;
  line-height: 1;
  margin-bottom: 2rem;

  .icon svg {
    width: 1.2em;
    height: 1.2em;
    fill: variables.$primary-dark;
  }
}
</style>
