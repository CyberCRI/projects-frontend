<template>
  <div
    :class="[{ 'has-icon': iconName, 'simple-text': simpleText }, size, colors || 'primary-light']"
    class="badge"
  >
    <span v-if="iconName" class="icon-container">
      <IconImage :class="{ 'icon-small': size === 'small' }" :name="iconName" class="icon" />
    </span>

    <span :class="size" class="label">{{ label }}</span>

    <slot name="right" />
  </div>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'

withDefaults(
  defineProps<{
    label: string
    iconName?: string
    size?: string
    simpleText?: boolean
    colors?:
      | 'primary-light'
      | 'primary-dark'
      | 'green'
      | 'orange'
      | 'ok'
      | 'warning'
      | 'disabled'
      | ''
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
.badge {
  display: inline-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: $border-radius-l;
  box-sizing: content-box;
  white-space: nowrap;

  &.primary-light {
    background-color: $primary-light;

    .label {
      color: $primary-dark;
    }
  }

  &.primary-dark {
    background-color: $primary-dark;

    .label {
      color: $white;
    }
  }

  &.simple-text {
    background-color: transparent;

    .label {
      color: $primary-dark;
    }
  }

  &.green,
  &.ok {
    background-color: $primary;

    .label {
      color: $black;
    }
  }

  &.salmon,
  &.warning {
    background-color: $salmon;

    .label {
      color: $black;
    }
  }

  &.grey,
  &.disabled {
    background-color: $almost-white;

    .label {
      color: $mid-gray;
    }
  }

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.is-open-tab {
    border-radius: $border-radius-m $border-radius-m 0 0;
    background-color: $white;
    border: $border-width-s solid $primary;
    border-bottom: $border-width-s solid $white;
    box-sizing: border-box;
  }
}

.small {
  font-size: $font-size-2xs;

  > * {
    height: 11px;
    padding: pxToRem(4px) pxToRem(8px);
  }

  &.has-icon {
    .icon-container {
      padding-right: pxToRem(4px);
    }

    .label {
      padding-left: pxToRem(4px);
    }
  }
}

.big {
  font-size: $font-size-xs;

  > * {
    height: 14px;
    padding: pxToRem(6px) pxToRem(12px);
  }

  &.has-icon {
    .icon-container {
      padding-right: pxToRem(6px);
    }

    .label {
      padding-left: pxToRem(6px);
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
    fill: $primary-dark;
    width: 10px;
    height: 100%;
  }
}
</style>
