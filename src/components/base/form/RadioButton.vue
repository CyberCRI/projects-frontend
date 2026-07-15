<template>
  <label
    class="form-control"
    :class="{
      'form-control--disabled': disabled,
      'as-button': asButton,
      'is-checked': isChecked,
    }"
  >
    <input
      type="radio"
      :name="radioGroup"
      :value="value"
      :disabled="disabled"
      :checked="isChecked"
      @change="toggle"
    />
    {{ label }}
  </label>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string
    radioGroup?: string
    value?: any
    disabled?: boolean
    asButton?: boolean
  }>(),
  {
    radioGroup: null,
    value: true,
    asButton: false,
  }
)

const model = defineModel<any>()

const isChecked = computed(() => {
  return model.value === props.value
})

const toggle = () => {
  model.value = props.value
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.form-control {
  font-size: variables.$font-size-m;
  color: variables.$primary-dark;
  font-weight: 400;
  line-height: variables.$line-height-squashed;
  display: inline-flex;
  align-items: center;
  gap: variables.$space-s;
  cursor: pointer;
}

.as-button {
  text-transform: capitalize;
  border: variables.$border-width-s solid variables.$primary-dark;
  border-radius: variables.$border-radius-xs;
  padding: variables.$space-m variables.$space-s;
  margin-right: variables.$space-m;

  &:hover {
    background-color: variables.$primary-lighter;
  }

  &.is-checked {
    background-color: variables.$primary-dark;
    color: variables.$white;
    cursor: default;
  }
}

input[type='radio'] {
  appearance: none;
  background-color: variables.$white;
  margin: 0;
  font: inherit;
  width: variables.pxToRem(20px);
  height: variables.pxToRem(20px);
  border: variables.$border-width-s solid variables.$primary-dark;
  border-radius: variables.pxToRem(20px);
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='radio']::before {
  content: '';
  width: variables.pxToRem(12px);
  height: variables.pxToRem(12px);
  border-radius: variables.pxToRem(12px);
  transform: translateZ(0) scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em variables.$primary-dark;
}

input[type='radio']:checked::before {
  transform: translateZ(0) scale(1);
}

input[type='radio']:disabled {
  border: variables.$border-width-s solid variables.$mid-gray;
  color: variables.$mid-gray;
  cursor: not-allowed;
}

.form-control--disabled {
  color: variables.$mid-gray;
  cursor: not-allowed;
}
</style>
