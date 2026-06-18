<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    icon?: IconImageChoice
    title: string
    label?: string
    action: () => void
    isActive?: () => void
    isDisabled?: boolean
  }>(),
  {
    isActive: null,
    isDisabled: false,
    label: '',
    icon: null,
  }
)
</script>

<template>
  <button
    type="button"
    class="menu-item pointer"
    :class="{ 'is-active': isActive ? isActive() : null, 'with-icon': !!icon }"
    :title="title"
    :disabled="isDisabled || null"
    :data-test="`button-tiptap-${title}`"
    @click="action"
  >
    <slot>
      <IconImage v-if="icon" class="icon" :name="icon" />
      <span v-else class="label">{{ label }}</span>
    </slot>
  </button>
</template>

<style lang="scss" scoped>
.menu-item {
  color: var(--primary-dark);
  border: none;
  background-color: transparent;
  border-radius: $border-radius-s;
  padding: pxToRem(4px);
  margin-right: $space-2xs;
  height: 1.75rem;
  width: auto;

  &.with-icon {
    width: 1.75rem;
  }

  .icon,
  .label {
    width: 100%;
    height: 100%;
    fill: var(--primary-dark);
    color: var(--primary-dark);
  }

  &.is-active,
  &:hover {
    background-color: var(--primary-dark);

    .icon,
    .label {
      fill: var(--white);
      color: var(--white);
    }
  }
}

button:disabled,
button[disabled] {
  opacity: 0.33;
  pointer-events: none;
  user-select: none;
}
</style>
