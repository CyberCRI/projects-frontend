<template>
    <button
        :class="{
            secondary,
            disabled,
            'icon-only': iconOnly,
            'reversed-order': reversedOrder,
        }"
        :disabled="disabled"
        type="button"
        class="lpi-button shadow-box"
    >
        <ButtonContent :label="label" :btn-icon="btnIcon" :no-text-transform="noTextTransform" />
    </button>
</template>

<script>
import ButtonContent from '@/components/base/button/ButtonContent.vue'
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

        btnIcon: {
            type: [String, Object],
            default: null,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        reversedOrder: {
            type: Boolean,
            default: false,
        },

        noTextTransform: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        iconOnly() {
            return (!this.label || !this.label.length) && this.btnIcon
        },
    },
}
</script>

<style lang="scss" scoped>
.lpi-button {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-50;
    font-weight: 700;
    font-size: $font-size-m;
    line-height: $line-height-tight;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    background: $primary-dark;
    color: $white;
    height: 35px;
    padding: $space-s $space-l;
    box-sizing: border-box;
    gap: $space-s;

    &.reversed-order {
        flex-flow: row-reverse nowrap;
    }

    &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
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
