<template>
    <label class="form-control" :class="{ 'form-control--disabled': disabled }">
        <input
            type="radio"
            name="radio"
            @change="toggle"
            :value="modelValue"
            :disabled="disabled"
            :checked="checked"
        />
        {{ label }}
    </label>
</template>

<script>
export default {
    name: 'RadioButton',

    emits: ['update:modelValue'],

    data() {
        return {
            value: {},
        }
    },
    props: {
        label: {
            type: String,
            required: true,
        },

        modelValue: {
            type: [Boolean, Object],
            default: false,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        checked: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        toggle() {
            this.$emit('update:modelValue', this.modelValue)
        },
    },
}
</script>

<style scoped lang="scss">
.form-control {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 400;
    line-height: $line-height-squashed;
    display: inline-flex;
    align-items: center;
    gap: $space-s;
}

.form-control + .form-control {
    margin-top: 1em;
}

input[type='radio'] {
    appearance: none;
    background-color: $white;
    margin: 0;
    font: inherit;
    width: pxToRem(20px);
    height: pxToRem(20px);
    border: $border-width-s solid $primary-dark;
    border-radius: pxToRem(20px);
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
    cursor: pointer;
}

input[type='radio']::before {
    content: '';
    width: pxToRem(12px);
    height: pxToRem(12px);
    border-radius: pxToRem(12px);
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em $primary-dark;
}

input[type='radio']:checked::before {
    transform: scale(1);
}

// TODO check with designer if we keep this outline on focus
// input[type='radio']:focus {
//     outline: max(2px, 0.15em) solid currentColor;
//     outline-offset: max(2px, 0.15em);
// }
input[type='radio']:disabled {
    border: $border-width-s solid $mid-gray;
    color: $mid-gray;
    cursor: not-allowed;
}

.form-control--disabled {
    color: $mid-gray;
    cursor: not-allowed;
}
</style>
