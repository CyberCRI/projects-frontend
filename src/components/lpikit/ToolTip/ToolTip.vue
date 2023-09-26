<template>
    <Popper
        ref="popper-ctn"
        :class="{ secondary }"
        :content="content"
        :disabled="disabled"
        :force-show="forceShow"
        :placement="placement"
        :offset-distance="offsetDistance"
        :offset-skid="offsetSkid"
        :hover="hover"
        :interactive="interactive"
        :arrow="arrow"
        class="tooltip"
    >
        <template #content v-if="!content">
            <slot name="custom-content"></slot>
        </template>

        <slot class="trigger"></slot>
    </Popper>
</template>

<script>
import Popper from 'vue3-popper'

export default {
    name: 'ToolTip',

    components: {
        Popper,
    },

    mounted() {
        // if (!this.isTextContent) this.$refs['popper-ctn'].popper.classList.add('popper') // to show an arrow on custom tooltip contents
    },

    props: {
        interactive: {
            type: Boolean,
            default: true,
        },

        hover: {
            type: Boolean,
            default: false,
        },

        placement: {
            type: String,
            default: 'auto',
            validator(value) {
                return [
                    'auto',
                    'top-start',
                    'top',
                    'top-end',
                    'right-start',
                    'right',
                    'right-end',
                    'bottom-start',
                    'bottom',
                    'bottom-end',
                    'left-start',
                    'left',
                    'left-end',
                ].includes(value)
            },
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        arrow: {
            type: Boolean,
            default: true,
        },

        forceShow: {
            type: Boolean,
            default: false,
        },

        offsetDistance: {
            type: String,
            default: '12',
        },
        offsetSkid: {
            type: String,
            default: '0',
        },

        secondary: {
            type: Boolean,
            default: false,
        },

        content: {
            type: String,
            default: null,
        },
    },
}
</script>

<style lang="scss" scoped>
.tooltip {
    --popper-theme-background-color: #{$primary-lighter};
    --popper-theme-border-width: 2px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: #{$border-radius-m};
    --popper-theme-border-color: #{$primary-dark};
    --popper-theme-text-color: #{$primary-dark};
    --popper-theme-box-shadow: none;
    --popper-theme-background-color-hover: var(--popper-theme-background-color);

    .popper {
        font-size: $font-size-xs;
        font-weight: 700;
    }

    &.secondary {
        --popper-theme-background-color: #{$primary-dark};
        --popper-theme-border-color: #{$primary-dark};
        --popper-theme-text-color: #{$white};
    }

    &.shadowed {
        --popper-theme-box-shadow: 0 2px 5px rgb(190 190 190 / 50%);
        --popper-theme-border-color: #{$green};
        --popper-theme-background-color: #{$white};
        --popper-theme-padding: #{$space-m};
    }
}
</style>

<style lang="scss">
.tooltip {
    .popper[x-placement^='top'] .popper__arrow {
        border-color: $primary-dark transparent transparent transparent;
    }

    .popper[x-placement^='right'] .popper__arrow {
        border-color: transparent $primary-dark transparent transparent;
    }

    .popper[x-placement^='bottom'] .popper__arrow {
        border-color: transparent transparent $primary-dark transparent;
    }

    .popper[x-placement^='left'] .popper__arrow {
        border-color: transparent transparent transparent $primary-dark;
    }
}
</style>
