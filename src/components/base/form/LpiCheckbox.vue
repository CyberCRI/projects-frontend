<template>
  <label class="lpi-checkbox" :class="{ disabled: disabled, 'is-on': modelValue }">
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

<script>
export default {
  name: 'LpiCheckbox',

  props: {
    label: {
      type: String,
      required: true,
    },

    modelValue: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:modelValue'],

  methods: {
    toggle(e) {
      this.$emit('update:modelValue', !!e.target.checked)
    },
  },
}
</script>

<style scoped lang="scss">
.lpi-checkbox {
  font-size: $font-size-m;
  color: $primary-dark;
  font-weight: 400;
  line-height: $line-height-squashed;
  display: grid;
  grid-template-columns: 1em auto;
  gap: $space-m;
}

input[type='checkbox'] {
  appearance: none;
  background-color: $white;
  margin: 0;
  font: inherit;
  width: pxToRem(20px);
  height: pxToRem(20px);
  border: $border-width-s solid $primary-dark;
  border-radius: $border-radius-xs;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='checkbox'] {
  background-color: $white;
}

input[type='checkbox']::before {
  content: '';
  width: pxToRem(12px);
  height: pxToRem(12px);
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em $primary-dark;
}

.disabled input[type='checkbox']::before {
  box-shadow: inset 1em 1em $mid-gray;
}

input[type='checkbox']:checked::before {
  transform: scale(1);
}

.as-button {
  border: 1px solid $primary-dark;
  padding: $space-m;
  border-radius: $border-radius-xs;
  display: flex;
  align-items: center;
  text-align: right;
  font-weight: 700;
  font-size: $font-size-m;
  line-height: $line-height-tight;
  color: $primary-dark;
  margin: 0;
  cursor: pointer;
  margin-left: $space-s;
  transition:
    color 200ms ease-in-out,
    background-color 200ms ease-in-out;

  // &:hover {
  //     background-color: $primary-dark;
  //     color: $white;
  // }

  &.is-on {
    background-color: $primary-dark;
    color: $white;

    // &:hover {
    //     background-color: $white;
    //     color: $primary-dark;
    // }

    &.form-control--disabled {
      background-color: $mid-gray;
      color: $white;
    }

    &.disabled {
      background-color: $mid-gray;
      color: $white;
    }
  }
}

.min-width {
  width: min-content;
}

// TODO check with designer if we keep this outline on focus
// input[type='checkbox']:focus {
//     outline: max(2px, 0.15em) solid currentColor;
//     outline-offset: max(2px, 0.15em);
// }

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
