<template>
    <div
        class="external-btn"
        :class="{ reversed, disabled, topIcon, noMargin }"
        @click="$emit('click')"
    >
        <div v-if="rightIcon" class="over-button">
            <LpiButton
                class="btn"
                :right-icon="rightIcon"
                color="primary-dark"
                secondary
                :disabled="disabled"
                :reversed="reversed"
                :no-border="noBorder"
                :no-margin="noMargin"
                :no-flex="noFlex"
                :size="size"
                :button-size="buttonSize"
            />
            <LpiButton
                v-if="nbButton"
                :label="nbButton"
                :disabled="true"
                size="xx-small"
                :over="true"
                :opacity="true"
            />
        </div>

        <span :class="{ disabled, bold }">{{ label }}</span>

        <div v-if="leftIcon" class="over-button">
            <LpiButton
                class="btn"
                :left-icon="leftIcon"
                color="primary-dark"
                secondary
                :disabled="disabled"
                :reversed="reversed"
                :no-border="noBorder"
                :no-margin="noMargin"
                :no-flex="noFlex"
                :size="size"
                :button-size="buttonSize"
            />
            <LpiButton
                v-if="nbButton"
                :label="nbButton"
                :disabled="true"
                size="xx-small"
                :over="true"
                :opacity="true"
            />
        </div>
    </div>
</template>

<script>
import LpiButton from './LpiButton.vue'

export default {
    name: 'ExternalLabelButton',

    emits: ['click'],

    components: {
        LpiButton,
    },

    props: {
        label: {
            type: String,
            default: '',
        },

        rightIcon: {
            type: String,
            default: null,
        },

        leftIcon: {
            type: String,
            default: null,
        },

        topIcon: {
            type: Boolean,
            default: false,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        reversed: {
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

        bold: {
            type: Boolean,
            default: false,
        },

        noFlex: {
            type: Boolean,
            default: false,
        },

        nbButton: {
            type: String,
            default: null,
        },
        size: {
            type: String,
            default: null,
        },
        buttonSize: {
            type: String,
            default: null,
        },
    },
}
</script>

<style lang="scss" scoped>
.external-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;

    span {
        font-size: $font-size-s;
        font-weight: 400;
        color: $primary-dark;
        text-align: center;
    }

    &.disabled,
    &.disabled * {
        pointer-events: none;
        cursor: default;
    }

    &.disabled span {
        opacity: 0.7;
    }

    .bold {
        font-weight: 700;
    }

    .btn {
        width: 32px;
        height: 32px;
        border-width: $border-width-m;
    }

    .over-button {
        display: flex;
        flex-direction: row;
        position: relative;

        .below-text {
            position: absolute;
            top: 37px;
            width: 100%;

            @media screen and (max-width: $min-tablet) {
                top: 32px;
            }
        }

        .over {
            pointer-events: none;
        }
    }
}

@media screen and (min-width: $min-tablet) {
    .external-btn {
        flex-direction: row-reverse;
        cursor: pointer;

        .btn {
            margin-left: $space-m;
        }

        &.noMargin {
            .btn {
                margin-left: 0;
            }
        }

        &.reversed {
            flex-direction: row;

            .btn {
                margin-left: 0;
                margin-right: $space-m;
            }
        }

        &.topIcon {
            display: flex;
            flex-direction: column;
            align-items: center;

            .btn {
                margin-left: 0;
                margin-right: 0;
                margin-bottom: 5px;
            }
        }
    }
}
</style>
