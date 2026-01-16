<template>
  <ClientOnly>
    <Popper
      ref="popper-ctn"
      :class="{ secondary }"
      :content="content"
      :disabled="disabled"
      :show="forceShow"
      :placement="placement"
      :offset-distance="offsetDistance"
      :offset-skid="offsetSkid"
      :hover="hover"
      :interactive="interactive"
      :arrow="arrow"
      class="tooltip"
    >
      <template v-if="!content" #content>
        <slot name="custom-content" />
      </template>

      <slot class="trigger" />
    </Popper>
  </ClientOnly>
</template>

<script setup lang="ts">
import Popper from 'vue3-popper'

withDefaults(
  defineProps<{
    interactive?: boolean
    hover?: boolean
    placement?:
      | 'auto'
      | 'top-start'
      | 'top'
      | 'top-end'
      | 'right-start'
      | 'right'
      | 'right-end'
      | 'bottom-start'
      | 'bottom'
      | 'bottom-end'
      | 'left-start'
      | 'left'
      | 'left-end'
    disabled?: boolean
    arrow?: boolean
    forceShow?: boolean
    offsetDistance?: string
    offsetSkid?: string
    secondary?: boolean
    content?: string
  }>(),
  {
    interactive: true,
    hover: false,
    placement: 'auto',
    disabled: false,
    arrow: true,
    forceShow: null,
    offsetDistance: '12',
    offsetSkid: '0',
    secondary: false,
    content: null,
  }
)
</script>

<style lang="scss" scoped>
.tooltip {
  --popper-theme-background-color: #{$primary-lighter};
  --popper-theme-border-width: 2px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: #{$border-radius-m};
  --popper-theme-border-color: #{$primary-dark};
  --popper-theme-text-color: #{$primary-dark};
  --popper-theme-box-shadow: none;
  --popper-theme-background-color-hover: var(--popper-theme-background-color);
  --popper-theme-padding: #{$space-s};

  .popper {
    font-size: $font-size-xs;
    font-weight: 700;
  }

  &.secondary {
    --popper-theme-background-color: #{$primary-dark};
    --popper-theme-border-color: #{$primary-dark};
    --popper-theme-text-color: #{$white};
  }

  &.shadowed {
    --popper-theme-box-shadow: 0 2px 5px rgb(190 190 190 / 50%);
    --popper-theme-border-color: #{$primary};
    --popper-theme-background-color: #{$white};
    --popper-theme-padding: #{$space-m};
  }
}
</style>

<style lang="scss">
.tooltip {
  .popper[x-placement^='top'] .popper__arrow {
    border-color: $primary-dark transparent transparent transparent;
  }

  .popper[x-placement^='right'] .popper__arrow {
    border-color: transparent $primary-dark transparent transparent;
  }

  .popper[x-placement^='bottom'] .popper__arrow {
    border-color: transparent transparent $primary-dark;
  }

  .popper[x-placement^='left'] .popper__arrow {
    border-color: transparent transparent transparent $primary-dark;
  }
}
</style>
