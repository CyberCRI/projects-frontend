<template>
    <div class="s-switch-input-ctn">
        <span v-if="label" class="s-label">{{ label }}</span>

        <div class="s-switch" :class="{ active: modelValue }" @click="toggleValue">
            <div class="s-control" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'SwitchInput',

    emits: ['update:modelValue'],

    props: {
        label: {
            type: String,
            default: null,
        },

        modelValue: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        toggleValue() {
            this.$emit('update:modelValue', !this.modelValue)
        },
    },
}
</script>

<style lang="scss" scoped>
.s-switch-input-ctn {
    display: flex;
    align-items: center;

    &.vertical {
        flex-flow: column nowrap;
        align-items: flex-start;
    }

    .s-switch {
        width: 46px;
        height: 25px;
        padding: $space-2xs;
        border-radius: $border-radius-l;
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        will-change: transform;
        background-color: $mid-gray;

        .s-control {
            transition: transform 0.3s ease-out;
        }

        &.active {
            background-color: $primary;
        }

        &.active .s-control {
            transform: translate3d(100%, 0, 0);
        }
    }

    .s-label {
        font-size: $font-size-s;
        color: $primary-dark;
        font-weight: bold;
        margin-bottom: $space-2xs;
        margin-right: $space-s;
    }

    &.black-label .s-label {
        color: $black;
    }

    .s-control {
        border-radius: 50%;
        width: 19px;
        height: 19px;
        background: $almost-white;
    }
}
</style>
