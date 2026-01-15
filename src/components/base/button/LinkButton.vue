<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    :class="{ 'icon-only': iconOnly }"
    type="button"
    class="link-button"
  >
    <ButtonContent :label="label" :btn-icon="btnIcon" :no-text-transform="noTextTransform" />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    to?: string | object
    btnIcon?: string
    noTextTransform?: boolean
  }>(),
  {
    label: null,
    to: null,
    btnIcon: null,
    noTextTransform: false,
  }
)

const iconOnly = computed(() => (!props.label || !props.label.length) && props.btnIcon)
</script>

<style lang="scss" scoped>
.link-button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: $font-size-m;
  transition: 0.15s all ease-in-out;
  cursor: pointer;
  will-change: transform;
  border: none;
  background: transparent;
  color: $primary-dark;
  padding: 0;
  gap: $space-s;

  &.icon-only {
    border-radius: 50%;
    width: 42px;
    height: 42px;
    padding: 0;
  }

  &::before {
    content: '';
    inset: 0;
    z-index: 0;
    position: absolute;
    transform-origin: center center;
    transform: translateY(4px) translateZ(0) scale(0, 1);
    transition: 200ms ease-in-out;
    border-bottom: $border-width-m solid $primary-dark;
  }

  &:hover::before {
    transform: translateY(4px) translateZ(0) scale(1, 1);
  }
}

.link-button :deep(svg) {
  transition: 0.15s fill ease-in-out;
  fill: $primary-dark;
}
</style>
