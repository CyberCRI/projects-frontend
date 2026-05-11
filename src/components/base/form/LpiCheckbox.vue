<template>
  <label
    class="lpi-checkbox"
    :class="{ disabled: disabled, 'is-checked': modelValue, 'as-button': asButton }"
  >
    <input
      type="checkbox"
      name="checkbox"
      :value="modelValue"
      :checked="modelValue"
      :disabled="disabled"
      @change="toggle"
    />
    {{ label }}
  </label>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    disabled?: boolean
    asButton?: boolean
  }>(),
  {
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

<style scoped lang="scss">
.lpi-checkbox {
  font-size: $font-size-m;
  color: var(--primary-dark);
  font-weight: 400;
  line-height: $line-height-squashed;
  display: grid;
  grid-template-columns: 1em auto;
  gap: $space-m;
}

.as-button {
  text-transform: capitalize;
  border: $border-width-s solid var(--primary-dark);
  border-radius: $border-radius-xs;
  padding: $space-m $space-s;
  margin-right: $space-m;

  &:hover {
    background-color: var(--primary-lighter);
  }

  &.is-checked {
    background-color: var(--primary-dark);
    color: $white;
    cursor: default;
  }
}

input[type='checkbox'] {
  appearance: none;
  background-color: $white;
  margin: 0;
  font: inherit;
  width: pxToRem(20px);
  height: pxToRem(20px);
  border: $border-width-s solid var(--primary-dark);
  border-radius: $border-radius-xs;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='checkbox']::before {
  content: '';
  width: pxToRem(12px);
  height: pxToRem(12px);
  transform: translateZ(0) scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--primary-dark);
}

.disabled input[type='checkbox']::before {
  box-shadow: inset 1em 1em $mid-gray;
}

input[type='checkbox']:checked::before {
  transform: translateZ(0) scale(1);
}

input[type='checkbox']:disabled {
  border: $border-width-s solid $mid-gray;
  color: $mid-gray;
  cursor: not-allowed;
}

.disabled {
  color: $mid-gray;
  cursor: not-allowed;
}
</style>
