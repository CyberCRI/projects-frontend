<template>
  <div :class="{ 'big-input': bigInput, disabled: disabled }" class="input-ctn">
    <slot name="label">
      <div class="label-form">
        <label v-if="label" v-bind="attrsLabel">
          {{ formatedLabel }}
        </label>
        <slot name="in-label" />
      </div>
    </slot>

    <slot />

    <small v-if="bottomText">{{ bottomText }}</small>
    <FieldErrors :errors="errors" />
  </div>
</template>

<script setup lang="ts">
import type FieldErrors from '~/components/base/form/FieldErrors.vue'
import type { ErrorObject } from '@vuelidate/core'

const props = withDefaults(
  defineProps<{
    label?: string
    attrsLabel?: any
    bottomText?: string
    bigInput?: boolean
    disabled?: boolean
    required?: boolean
    errors?: ErrorObject[]
  }>(),
  {
    label: null,
    attrsLabel: null,
    bottomText: null,
    required: false,
    bigInput: false,
    disabled: false,
    errors: () => [],
  }
)

const formatedLabel = computed(() => {
  // if required in props are true and not '*' in label, we add this
  if (!props.required || props.label.trim().endsWith('*')) {
    return props.label
  }
  return `${props.label} *`
})
</script>

<style lang="scss" scoped>
.input-ctn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  label {
    font-size: $font-size-s;
    font-weight: bold;
    margin-bottom: $space-m;
    color: $black;

    &.large-space {
      margin-bottom: $space-l;
    }
  }

  small {
    font-size: $font-size-xs;
    align-self: flex-end;
    color: $black;
  }

  &.disabled {
    input {
      color: $light-gray;
    }

    label {
      color: $light-gray;
    }

    small {
      color: $light-gray;
    }
  }
}

.label-form {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<style lang="scss">
.input-ctn {
  .disabled {
    input {
      color: $light-gray;
    }
  }

  &.big-input input {
    height: 60px;
    border-radius: 35px;
    font-size: $font-size-3xl;
    line-height: 1;
  }

  @media screen and (min-width: $min-tablet) {
    &.big-input input {
      height: 90px;
      font-size: $font-size-5xl;
      line-height: 1;
      border-radius: $border-radius-s;
    }
  }
}
</style>
