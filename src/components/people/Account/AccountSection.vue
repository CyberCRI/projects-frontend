<template>
  <div class="sub-section">
    <h2 v-if="sectionTitle" class="title">
      {{ sectionTitle }}
    </h2>
    <p v-if="sectionNotice" class="notice">
      {{ sectionNotice }}
    </p>
    <slot />
  </div>
</template>
<script setup lang="ts">
defineOptions({ name: 'AccountSection' })

withDefaults(
  defineProps<{
    sectionTitle?: string
    sectionNotice?: string
  }>(),
  {
    sectionTitle: '',
    sectionNotice: '',
  }
)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.sub-section {
  padding-top: variables.$space-xl;

  .title {
    font-weight: 700;
    font-size: variables.$font-size-l;
    color: variables.$black;
  }

  .notice {
    margin: variables.pxToRem(16px) 0;
  }
}
</style>
