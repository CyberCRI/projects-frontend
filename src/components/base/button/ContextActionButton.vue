<template>
    <button
        :class="[{ secondary, 'no-border': noBorder }, actionIcon]"
        type="button"
        class="context-action-button shadow-box"
    >
        <span class="icon-wrapper">
            <IconImage :name="actionIcon" class="action-icon" />
        </span>

        <span v-if="actionLabel" class="action-label">{{ actionLabel }}</span>
    </button>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
export default {
    name: 'ContextActionButton',

    components: {
        IconImage,
    },

    props: {
        actionIcon: {
            type: [String, Object],
            required: true,
        },
        secondary: {
            type: Boolean,
            default: false,
        },
        noBorder: {
            type: Boolean,
            default: false,
        },
        actionLabel: {
            type: String,
            default: '',
        },
    },
}
</script>

<style lang="scss" scoped>
.context-action-button {
    --context-action-button-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: $font-size-m;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    padding: 0;
    border: none;
    box-sizing: border-box;
    width: max-content;
    background: transparent;
    gap: 0.5rem;
    appearance: none;
    border-radius: 50%;

    .action-label {
        color: $primary-dark;
    }

    .icon-wrapper {
        width: var(--context-action-button-size);
        height: var(--context-action-button-size);
        background: $primary-dark;
        color: $white;
        border-radius: 50%;
        position: relative;
    }

    &.extra-small {
        --context-action-button-size: 1rem;
    }

    &.small {
        --context-action-button-size: 1.5rem;
    }

    &.secondary .icon-wrapper {
        background: $white;
        color: $primary-dark;
        fill: $primary-dark;
        border: $border-width-s solid $primary-dark;
    }

    &.no-border .icon-wrapper {
        border: none !important;
    }

    &.Pen:hover {
        .action-icon {
            animation: rotate-pen 0.5s ease-in-out infinite;
            transform-origin: bottom left;
        }
    }

    &.Close:hover {
        .action-icon {
            animation: rotate-close 1.2s ease-in-out infinite;
            transform-origin: center center;
        }
    }

    &.DotsHorizontal:hover {
        .action-icon {
            animation: horizontal-squeeze 0.8s ease-in-out infinite;
            transform-origin: center center;
        }
    }
}

.action-label {
    padding-right: 0.5rem;
}

.context-action-button :deep(svg) {
    transition: 0.15s fill ease-in-out;
    fill: $white;
    position: absolute;
    inset: 5%;
}

.context-action-button.secondary :deep(svg) {
    fill: $primary-dark;
}

@keyframes rotate-pen {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(10deg);
    }

    75% {
        transform: rotate(-10deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@keyframes rotate-close {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(90deg);
    }

    75% {
        transform: rotate(-90deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

@keyframes horizontal-squeeze {
    0% {
        transform: scaleX(1);
    }

    50% {
        transform: scaleX(1.4);
    }

    100% {
        transform: scaleX(1);
    }
}
</style>
