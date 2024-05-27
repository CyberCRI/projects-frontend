<template>
    <button
        class="external-btn"
        :class="{
            'reversed-order': reversedOrder,
            'vertical-layout': verticalLayout,
            'has-border': hasBorder,
        }"
    >
        <div v-if="btnIcon" class="over-button">
            <IconImage :name="btnIcon" class="btn" />
            <span class="number over" v-if="nbButton"
                ><span>{{ nbButton }}</span></span
            >
        </div>

        <span v-if="label" data-test="button-label" class="label">{{ label }}</span>
    </button>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'

export default {
    name: 'ExternalLabelButton',

    components: {
        IconImage,
    },

    props: {
        label: {
            type: String,
            default: '',
        },

        btnIcon: {
            type: String,
            default: null,
        },

        verticalLayout: {
            type: Boolean,
            default: false,
        },

        reversedOrder: {
            type: Boolean,
            default: false,
        },

        hasBorder: {
            type: Boolean,
            default: false,
        },

        nbButton: {
            type: String,
            default: null,
        },
    },
}
</script>

<style lang="scss" scoped>
.external-btn {
    display: inline-flex;
    flex-direction: row;
    gap: $space-s;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: $primary-dark;
    cursor: pointer;

    &.reversed {
        flex-direction: row-reverse;
    }

    &.vertical-layout {
        display: flex;
        flex-direction: column;
        align-items: center;

        &.reversed-order {
            flex-direction: column-reverse;
        }
    }

    .label {
        font-size: $font-size-s;
        font-weight: 400;
        color: $primary-dark;
        text-align: center;
    }

    .number {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $font-size-2xs;
        padding: $space-s;
        height: 7px;
        width: 7px;
        box-sizing: border-box;
        background: $primary-dark;
        color: $white;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 0;

        @media screen and (max-width: $min-tablet) {
            right: 400px; // TODO: ???
        }
    }

    .btn-label {
        font-weight: 700;
    }

    .btn {
        width: pxToRem(32px);
        height: pxToRem(32px);
        color: $primary-dark;
        fill: $primary-dark;
    }

    &.has-border {
        .over-button {
            border: $border-width-m solid $primary-dark;
            border-radius: $border-radius-50;
            width: pxToRem(32px);
            height: pxToRem(32px);
        }

        .btn {
            width: pxToRem(24px);
            height: pxToRem(24px);
        }
    }

    .over-button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        .over {
            pointer-events: none;
        }
    }

    &.bg-on-hover {
        svg {
            transform-origin: center;
            transition: all 200ms ease-in-out;
        }

        &:hover {
            border-radius: 8px;
            background-color: $primary-light !important;

            svg {
                transform: scale(1.1);
            }
        }
    }
}
</style>
