<template>
  <div
    :class="[{ 'has-icon': iconName, 'simple-text': simpleText }, size, colors || 'primary-light']"
    class="badge skeletons-background"
  >
    <span v-if="iconName" class="icon-container">
      <IconImage :class="{ 'icon-small': size === 'small' }" :name="iconName" class="icon" />
    </span>

    <span :class="size" class="label">{{ label }}</span>

    <slot name="right" />
  </div>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'

withDefaults(
  defineProps<{
    label: string
    iconName?: IconImageChoice
    size?: string
    simpleText?: boolean
    colors?:
      'primary-light' | 'primary-dark' | 'green' | 'salmon' | 'ok' | 'warning' | 'disabled' | ''
  }>(),
  {
    iconName: null,
    size: 'big',
    simpleText: false,
    colors: 'primary-light',
  }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.badge {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: variables.$border-radius-l;
  box-sizing: content-box;
  white-space: nowrap;

  &.primary-light {
    background-color: var(--primary-light);

    .label {
      color: variables.$primary-dark;
    }
  }

  &.primary-dark {
    background-color: var(--primary-dark);

    .label {
      color: variables.$white;
    }
  }

  &.simple-text {
    background-color: transparent;

    .label {
      color: variables.$primary-dark;
    }
  }

  &.green,
  &.ok {
    background-color: var(--primary);

    .label {
      color: variables.$black;
    }
  }

  &.salmon,
  &.warning {
    background-color: variables.$salmon;

    .label {
      color: variables.$black;
    }
  }

  &.grey,
  &.disabled {
    background-color: variables.$almost-white;

    .label {
      color: variables.$mid-gray;
    }
  }

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.is-open-tab {
    border-radius: variables.$border-radius-m variables.$border-radius-m 0 0;
    background-color: variables.$white;
    border: variables.$border-width-s solid var(--primary);
    border-bottom: variables.$border-width-s solid variables.$white;
    box-sizing: border-box;
  }
}

.small {
  font-size: variables.$font-size-2xs;

  > * {
    height: 11px;
    padding: variables.pxToRem(4px) variables.pxToRem(8px);
  }

  &.has-icon {
    .icon-container {
      padding-right: variables.pxToRem(4px);
    }

    .label {
      padding-left: variables.pxToRem(4px);
    }
  }
}

.big {
  font-size: variables.$font-size-xs;

  > * {
    height: 14px;
    padding: variables.pxToRem(6px) variables.pxToRem(12px);
  }

  &.has-icon {
    .icon-container {
      padding-right: variables.pxToRem(6px);
    }

    .label {
      padding-left: variables.pxToRem(6px);
    }
  }
}

.label {
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

.icon-container {
  .icon {
    fill: var(--primary-dark);
    width: 10px;
    height: 100%;
  }
}
</style>
