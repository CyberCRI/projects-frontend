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
.section {
  border: $border-width-s solid var(--primary);
  border-radius: $border-radius-l;
  padding: $space-l;

  .separator {
    border-bottom: $border-width-s solid var(--primary-dark);
    width: pxToRem(50px);
    margin: $space-m 0;
  }

  .label {
    color: var(--black);
    margin-bottom: $space-l;
    font-weight: 700;
    font-size: $font-size-2xl;
    line-height: $line-height-tight;
  }
}
</style>
