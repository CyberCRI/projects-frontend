<template>
    <button
        :class="[
            size,
            { secondary, disabled, text, opacity, over },
            { 'icon-only': iconOnly },
            { 'no-border': noBorder },
            { 'no-margin': noMargin },
            { 'no-flex': noFlex },
            { padding: padding },
        ]"
        :disabled="disabled"
        :type="buttonType"
        class="lpi-button"
        @click="$emit('click')"
    >
        <IconImage
            v-if="leftIcon && leftIcon !== 'LoaderSimple'"
            :name="leftIcon"
            class="left-icon"
        />
        <LoaderSimple v-if="leftIcon && leftIcon === 'LoaderSimple'" class="left-icon loader" />

        <span v-if="label" data-test="button-label" class="label">{{ label }}</span>

        <IconImage
            v-if="rightIcon && !cloud"
            :name="rightIcon"
            class="right-icon"
            :class="buttonSize"
        />
        <img
            v-else-if="rightIcon"
            class="right-icon img-format"
            :class="buttonSize"
            :src="rightIcon"
        />
    </button>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import LoaderSimple from '@/components/lpikit/Loader/LoaderSimple.vue'

export default {
    name: 'LpiButton',

    emits: ['click'],

    components: {
        IconImage,
        LoaderSimple,
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

        text: {
            type: Boolean,
            default: false,
        },

        buttonType: {
            type: String,
            default: 'button', // avoid submiting form by default
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

        noFlex: {
            type: Boolean,
            default: false,
        },

        over: {
            type: Boolean,
            default: false,
        },

        cloud: {
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
.label {
    text-transform: lowercase;
}

.label::first-letter {
    text-transform: capitalize;
}

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

    &.text {
        cursor: text;
    }

    &.opacity {
        opacity: 1;
    }

    svg {
        transition: 0.15s fill ease-in-out;
        fill: $white;
    }

    &.secondary {
        background: transparent;
        color: $primary-dark;
        fill: $primary-dark;

        &.white-bg {
            // temp fix class used is ProjectDescriptionTab. TODO: fix cleanly while refactoring this component
            background-color: $white;
        }

        svg {
            transition: 0.15s fill ease-in-out;
            fill: $primary-dark;
        }
    }

    .left-icon {
        margin-right: $space-s;
        height: pxToRem(18px);
    }

    :deep(.left-icon.loader) {
        path {
            fill: $primary;
        }
    }

    .right-icon {
        margin-left: $space-s;
        height: pxToRem(18px);

        &.mbutton {
            height: pxToRem(25px);
        }
    }

    &.icon-only {
        border-radius: 50%;
        width: 42px;
        height: 42px;
        padding: 0;

        .left-icon {
            margin-right: 0;
        }

        .right-icon {
            margin-left: 0;
        }

        &.no-centered {
            width: 24px;
            height: 24px;
            justify-content: left;
        }
    }

    .img-format {
        display: block;
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

    &.no-flex {
        display: inline-block;
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

.link {
    border: none;
    background: transparent;
    color: $primary-dark;
    padding: 0 0 0 $space-l;

    &.icon-only {
        padding: 0;
    }

    svg {
        transition: 0.15s fill ease-in-out;
        fill: $primary-dark;
    }
}
</style>

<style lang="scss">
.lpi-button .loader-simple {
    width: 22px;
    height: 22px;
    margin-right: $space-s;

    path {
        fill: $primary-dark;
    }
}
</style>
