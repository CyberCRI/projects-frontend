<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <div class="section">
    <h3 class="label">
      <slot name="label">
        {{ title }}
      </slot>
    </h3>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.section {
  border: variables.$border-width-s solid var(--primary);
  border-radius: variables.$border-radius-l;
  padding: variables.$space-l;

  .separator {
    border-bottom: variables.$border-width-s solid var(--primary-dark);
    width: variables.pxToRem(50px);
    margin: variables.$space-m 0;
  }

  .label {
    color: var(--black);
    margin-bottom: variables.$space-l;
    font-weight: 700;
    font-size: variables.$font-size-2xl;
    line-height: variables.$line-height-tight;
  }
}
</style>
