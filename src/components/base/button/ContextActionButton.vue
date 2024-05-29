<template>
    <button
        :class="[{ secondary }, actionIcon]"
        type="button"
        class="context-action-button shadow-box"
    >
        <IconImage :name="actionIcon" class="action-icon" />
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
    },
}
</script>

<style lang="scss" scoped>
.context-action-button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    font-size: $font-size-m;
    line-height: 18px;
    transition: 0.15s all ease-in-out;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    background: $primary-dark;
    color: $white;
    border-radius: 50%;
    padding: 0;
    border: none;
    height: 30px;
    width: 30px;
    box-sizing: border-box;

    &.small {
        height: 22px;
        width: 22px;
    }

    &.secondary {
        background: $white;
        color: $primary-dark;
        fill: $primary-dark;
        border: $border-width-s solid $primary-dark;
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
}

.context-action-button :deep(svg) {
    transition: 0.15s fill ease-in-out;
    fill: $white;
    height: pxToRem(18px);
    width: pxToRem(18px);
}

.context-action-button.small :deep(svg) {
    height: pxToRem(16px);
    width: pxToRem(16px);
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
</style>
