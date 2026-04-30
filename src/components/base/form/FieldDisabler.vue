<template>
  <div class="field-disabler" :class="{ disabled }">
    <slot />

    <div class="notice">
      <span>{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    label: string
  }>(),
  {
    disabled: false,
  }
)
</script>
<style lang="scss" scoped>
.field-disabler {
  .notice {
    display: none;
  }

  &.disabled {
    position: relative;
    cursor: not-allowed;

    :deep(*:not(.notice, .notice span)) {
      opacity: 0.3;
      pointer-events: none;
    }

    &:hover :deep(.notice) {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      inset: 0;
      text-align: center;
      padding: $space-m;

      span {
        display: inline-block;
        padding: $space-s;
        background-color: $white;
        border: $border-width-s solid $primary;
        border-radius: $border-radius-m;
      }
    }
  }
}
</style>
