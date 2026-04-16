<template>
  <button
    type="button"
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive() : null }"
    :title="$t(title)"
    :disabled="isDisabled || null"
    :data-test="`button-tiptap-${title}`"
    @click="action"
  >
    <svg class="remix">
      <use :xlink:href="`${remixiconUrl}#ri-${icon}`" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import remixiconUrl from 'remixicon/fonts/remixicon.symbol.svg?url'

withDefaults(
  defineProps<{
    icon: string
    title: string
    action: () => void
    isActive?: () => void
    isDisabled?: boolean
  }>(),
  {
    isActive: null,
    isDisabled: false,
  }
)
</script>

<style lang="scss" scoped>
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  color: $primary-dark;
  border: none;
  background-color: transparent;
  border-radius: $border-radius-s;
  padding: pxToRem(4px);
  margin-right: $space-2xs;

  svg {
    width: 100%;
    height: 100%;
    fill: currentcolor;
  }

  &.is-active,
  &:hover {
    background-color: $primary-dark;

    svg {
      fill: $white;
    }
  }
}

button:disabled,
button[disabled] {
  opacity: 0.33;
  pointer-events: none;
  user-select: none;

  svg {
    user-select: none;
    pointer-events: none;
  }
}
</style>
