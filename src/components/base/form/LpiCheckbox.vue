<template>
  <label
    class="lpi-checkbox pointer"
    :class="{
      disabled: disabled,
      'is-checked': modelValue,
      'as-button': asButton,
    }"
  >
    <div class="checkbox-container">
      <input
        type="checkbox"
        name="checkbox"
        :value="modelValue"
        :checked="modelValue"
        :disabled="disabled"
        @change="toggle"
      />
    </div>
    <slot name="label">
      {{ label }}
    </slot>
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    asButton?: boolean
  }>(),
  {
    label: '',
    asButton: false,
    disabled: false,
  }
)

const model = defineModel<boolean>()

const toggle = (e: Event) => {
  const target = e.target as HTMLInputElement
  model.value = !!target.checked
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.lpi-checkbox {
  font-size: variables.$font-size-m;
  color: var(--primary-dark);
  font-weight: 400;
  line-height: variables.$line-height-squashed;
  display: grid;
  grid-template-columns: 1em auto;
  gap: variables.$space-m;
}

.checkbox-container {
  --padding-checkbox: 0.1rem;

  width: calc(20px - (var(--padding-checkbox) * 2));
  height: calc(20px - (var(--padding-checkbox) * 2));
  padding: var(--padding-checkbox);
  background-color: var(--white);
  border-radius: variables.$border-radius-xs;
}

.as-button {
  text-transform: capitalize;
  border: variables.$border-width-s solid var(--primary-dark);
  border-radius: variables.$border-radius-xs;
  padding: variables.$space-m variables.$space-s;
  margin-right: variables.$space-m;

  &:hover {
    background-color: var(--primary-lighter);
  }

  &.is-checked {
    background-color: var(--primary-dark);
    color: variables.$white;
    cursor: default;
  }
}

input[type='checkbox'] {
  width: 100%;
  height: 100%;
  accent-color: var(--primary-dark);
  margin: 0;
  background-color: var(--white);
  font: inherit;
  display: grid;
  place-content: center;
  cursor: pointer;
}

.disabled input[type='checkbox']::before {
  box-shadow: inset 1em 1em variables.$mid-gray;
}

input[type='checkbox']:checked::before {
  transform: translateZ(0) scale(1);
}

input[type='checkbox']:disabled {
  border: variables.$border-width-s solid variables.$mid-gray;
  color: variables.$mid-gray;
  cursor: not-allowed;
}

.disabled {
  color: variables.$mid-gray;
  cursor: not-allowed;
}
</style>
