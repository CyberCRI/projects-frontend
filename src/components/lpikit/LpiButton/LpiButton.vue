<template>
    <button
        :class="[
            size,
            { secondary, disabled, opacity, over },
            { 'icon-only': iconOnly },
            { 'no-border': noBorder },
            { 'no-margin': noMargin },
            { padding: padding },
        ]"
        :disabled="disabled"
        type="button"
        class="lpi-button"
    >
        <ButtonContent
            :label="label"
            :right-icon="rightIcon"
            :left-icon="leftIcon"
            :button-size="buttonSize"
        />
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

        size: {
            type: String,
            default: 'medium',
            validator(value) {
                return ['large', 'link', 'medium', 'small', 'extra-small', 'xx-small'].includes(
                    value
                )
            },
        },

        buttonSize: {
            type: String,
            default: 'sbutton',
            validator(value) {
                return ['mbutton', 'sbutton'].includes(value)
            },
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

        noBorder: {
            type: Boolean,
            default: false,
        },

        noMargin: {
            type: Boolean,
            default: false,
        },

        opacity: {
            type: Boolean,
            default: false,
        },

        over: {
            type: Boolean,
            default: false,
        },

        padding: {
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
    padding: $space-m $space-l;
    font-weight: 700;
    font-size: $font-size-m;
    line-height: 18px;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    background: $primary-dark;
    color: $white;

    &.disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }

    &.opacity {
        opacity: 1;
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
        width: 42px;
        height: 42px;
        padding: 0;

        &.no-centered {
            width: 24px;
            height: 24px;
            justify-content: left;
        }
    }

    &.no-border {
        border: 0;
    }

    &.no-margin {
        margin: 0;
    }

    &.extra-small {
        border: none;
        font-size: $font-size-xs;
        padding: pxToRem(10px) pxToRem(14px);
        height: 22px;
        box-sizing: border-box;

        &.icon-only {
            width: 22px;
            padding: 0;
        }
    }

    &.xx-small {
        border: none;
        font-size: $font-size-2xs;
        padding: $space-s;
        height: 7px;
        width: 7px;
        box-sizing: border-box;

        &.icon-only {
            width: 7px;
            padding: 0;
        }
    }

    &.small {
        border: none;
        height: 30px;
        padding: $space-s $space-l;
        box-sizing: border-box;

        &.icon-only {
            width: 30px;
            padding: 0;
        }
    }

    &.medium {
        height: 35px;
        padding: $space-s $space-l;
        box-sizing: border-box;

        &.icon-only {
            width: 35px;
            padding: 0;
        }
    }

    &.large {
        height: 46px;
        padding: 15px $space-l;
        box-sizing: border-box;

        &.icon-only {
            width: 46px;
        }
    }

    &.extra-large {
        height: 46px;
        padding: 15px $space-l;
        box-sizing: border-box;

        &.icon-only {
            width: 100px;
        }
    }

    &.over {
        position: absolute;
        left: 50%;
    }

    @media screen and (max-width: $min-tablet) {
        &.over {
            right: 400px;
        }

        &.padding {
            display: contents;
        }
    }
}

.lpi-button :deep(svg) {
    transition: 0.15s fill ease-in-out;
    fill: $white;
}

.lpi-button.secondary :deep(svg),
.link :deep(svg) {
    fill: $primary-dark;
}
</style>
