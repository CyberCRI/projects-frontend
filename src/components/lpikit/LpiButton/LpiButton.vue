<template>
    <button
        :class="{ secondary, disabled, 'icon-only': iconOnly }"
        :disabled="disabled"
        type="button"
        class="lpi-button"
    >
        <ButtonContent :label="label" :right-icon="rightIcon" :left-icon="leftIcon" />
    </button>
</template>

<script>
import ButtonContent from '@/components/lpikit/LpiButton/ButtonContent.vue'
export default {
    name: 'LpiButton',

    components: {
        ButtonContent,
    },

    props: {
        label: {
            type: String,
            default: null,
        },

        secondary: {
            type: Boolean,
            default: false,
        },

        leftIcon: {
            type: [String, Object],
            default: null,
        },

        rightIcon: {
            type: [String, Object],
            default: null,
        },

        disabled: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        iconOnly() {
            return (!this.label || !this.label.length) && (this.leftIcon || this.rightIcon)
        },
    },
}
</script>

<style lang="scss" scoped>
.lpi-button {
    display: flex;
    justify-content: center;
    align-items: center;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-50;
    font-weight: 700;
    font-size: $font-size-m;
    line-height: 18px;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    background: $primary-dark;
    color: $white;
    height: 35px;
    padding: $space-s $space-l;
    box-sizing: border-box;

    &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    &.secondary {
        background: transparent;
        color: $primary-dark;
        fill: $primary-dark;

        &.white-bg {
            // temp fix class used is ProjectDescriptionTab. TODO: fix cleanly while refactoring this component
            background-color: $white;
        }
    }

    &.icon-only {
        border-radius: 50%;
        width: 35px;
        padding: 0;
    }
}

.lpi-button :deep(svg) {
    transition: 0.15s fill ease-in-out;
    fill: $white;
}

.lpi-button.secondary :deep(svg) {
    fill: $primary-dark;
}
</style>
