<template>
    <label class="form-control" :class="{ 'form-control--disabled': disabled }">
        <input
            type="checkbox"
            name="checkbox"
            @change="toggle"
            :value="modelValue"
            :checked="modelValue"
            :disabled="disabled"
        />
        {{ label }}
    </label>
</template>

<script>
export default {
    name: 'LpiCheckbox',

    emits: ['update:modelValue'],

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

    methods: {
        toggle(e) {
            this.$emit('update:modelValue', !!e.target.checked)
        },
    },
}
</script>

<style scoped lang="scss">
.form-control {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 400;
    line-height: 12px;
    display: grid;
    grid-template-columns: 1em auto;
    gap: $space-m;
}

.form-control + .form-control {
    margin-top: 1em;
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

input[type='checkbox']::before {
    content: '';
    width: pxToRem(12px);
    height: pxToRem(12px);
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em $primary-dark;
}

input[type='checkbox']:checked::before {
    transform: scale(1);
}

// TODO check with designer if we keep this outline on focus
// input[type='checkbox']:focus {
//     outline: max(2px, 0.15em) solid currentColor;
//     outline-offset: max(2px, 0.15em);
// }

input[type='checkbox']:disabled {
    border: $border-width-s solid $disabled;
    color: $disabled;
    cursor: not-allowed;
}

.form-control--disabled {
    color: $disabled;
    cursor: not-allowed;
}
</style>
