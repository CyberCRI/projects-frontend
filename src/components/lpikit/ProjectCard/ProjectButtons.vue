<template>
    <div class="project-buttons">
        <div
            v-if="!horizontalDisplay"
            class="preview-button"
            :class="{ 'preview-mode': isPreviewMode, disabled: !longPurpose }"
            @click="longPurpose ? $emit('toggle-preview-mode') : () => {}"
        >
            <IconImage name="BarsStaggered" />
        </div>

        <div class="see-project-button" @click="$emit('access-project')">
            {{ $filters.capitalize($t('project.view')) }}
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'ProjectButtons',

    emits: ['toggle-preview-mode', 'access-project'],

    components: { IconImage },

    props: {
        isPreviewMode: {
            type: Boolean,
            default: false,
        },

        longPurpose: {
            type: Boolean,
            default: true,
        },
        horizontalDisplay: {
            type: Boolean,
            default: false,
        },
    },
}
</script>

<style lang="scss" scoped>
.project-buttons {
    display: flex;
    align-items: center;
    border-top: 3px solid $primary-dark;

    > div {
        display: inline-block;
        align-items: center;
        justify-content: center;
        padding: pxToRem(12px);
        cursor: pointer;
        color: $primary-dark;
        font-weight: bold;
        font-size: $font-size-m;
    }

    .preview-button {
        width: 25%;
        border-right: 3px solid $primary-dark;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        transition: background-color 0.15s ease-in-out;

        svg {
            width: 16px;
            transition: fill 0.15s ease-in-out;
            fill: $primary-dark;
        }

        &.preview-mode {
            background-color: $green-dark;

            svg {
                fill: $white;
            }
        }

        &.disabled {
            cursor: initial;

            svg {
                opacity: 0.5;
            }

            &:hover {
                background: $white;

                svg {
                    fill: $primary-dark;
                }
            }
        }

        &:hover {
            background-color: $green-dark;

            svg {
                fill: $white;
            }
        }
    }

    .see-project-button {
        width: 75%;
        display: flex;
        justify-content: center;
        align-items: center;
        will-change: transform;
        overflow: hidden;
        background: $white;

        &::after {
            background: $primary-dark;
            border-bottom-right-radius: pxToRem(16px);
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            transform: translate(-100%, 0);
            transform-origin: left;
            transition: 0.15s all ease-in-out;
            will-change: transform;
            z-index: -1;
        }

        &:hover {
            color: $white;

            &::after {
                transform: translate(0, 0);
            }
        }
    }
}
</style>
