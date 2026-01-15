<template>
  <button
    :class="{
      secondary,
      disabled,
      'icon-only': iconOnly,
      'reversed-order': reversedOrder,
    }"
    :disabled="disabled"
    type="button"
    class="lpi-button shadow-box"
  >
    <ButtonContent :label="label" :btn-icon="btnIcon" :no-text-transform="noTextTransform" />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    secondary?: boolean
    btnIcon?: string
    disabled?: boolean
    reversedOrder?: boolean
    noTextTransform?: boolean
  }>(),
  {
    label: null,
    secondary: false,
    btnIcon: null,
    disabled: false,
    reversedOrder: false,
    noTextTransform: false,
  }
)

const iconOnly = computed(() => (!props.label || !props.label.length) && props.btnIcon)
</script>

<style lang="scss" scoped>
.lpi-button {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  border: $border-width-s solid $primary-dark;
  border-radius: $border-radius-50;
  font-weight: 700;
  font-size: $font-size-m;
  line-height: $line-height-tight;
  transition: 0.15s all ease-in-out;
  cursor: pointer;
  will-change: transform;
  overflow: hidden;
  background: $primary-dark;
  color: $white;
  height: 35px;
  padding: $space-s $space-l;
  box-sizing: border-box;
  gap: $space-s;

  &.reversed-order {
    flex-flow: row-reverse nowrap;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  &.secondary {
    background: transparent;
    color: $primary-dark;
    fill: $primary-dark;

    &.white-bg {
      // temp fix class used is ProjectDescriptionTab. TODO: fix cleanly while refactoring this component
      background-color: $white;
    }
  }

  &.icon-only {
    border-radius: 50%;
    width: 35px;
    padding: 0;
  }

  &.borderless {
    border: 0 none;
  }

  &.squarish {
    border-radius: $border-radius-s;
  }

  &.unpad {
    padding-left: 0;
    padding-right: 0;
  }

  &.no-height {
    height: auto;
  }

  &.not-centered {
    text-align: left;
  }
}

.lpi-button :deep(svg) {
  transition: 0.15s fill ease-in-out;
  fill: $white;
}

.lpi-button.secondary :deep(svg) {
  fill: $primary-dark;
}

.lpi-button.small {
  font-size: 0.8rem;
  height: auto;
  padding: 0.3rem 0.9rem;
}
</style>
