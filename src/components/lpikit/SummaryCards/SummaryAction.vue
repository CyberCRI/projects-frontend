<template>
    <component :is="to ? 'RouterLink' : 'vue:span'" :to="to" class="summary-action">
        <IconImage class="icon" :name="actionIcon" />
        <span class="label"> {{ $filters.capitalize(actionLabel) }}</span>
    </component>
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'
export default {
    name: 'SummaryAction',

    components: { IconImage },

    props: {
        actionIcon: {
            type: String,
            default: 'ArrowRight',
        },

        actionLabel: {
            type: String,
            default: '',
        },
        to: {
            type: [Object, String, null],
            default: null,
        },
    },
}
</script>
<style lang="scss" scoped>
.summary-action {
    display: flex;
    align-items: center;
    width: min-content;
    cursor: pointer;
    position: relative;

    &::before {
        content: '';
        background-color: $primary-light;
        inset: 0;
        z-index: 0;
        position: absolute;
        transform-origin: center left;
        transform: scale(0, 1);
        transition: 200ms ease-in-out;
        border-radius: $border-radius-s;
    }

    &:hover::before {
        transform: scale(1, 1);
    }

    .icon,
    .label {
        position: relative;
        z-index: 1;
    }

    .icon {
        fill: $primary-dark;
        height: $font-size-2xl;
        width: $font-size-2xl;
    }

    .label {
        color: $primary-dark;
        font-weight: 700;
        margin-left: $space-xs;
        white-space: nowrap;
    }

    .icon,
    .label {
        transition: transform 0.2s;
        transform-origin: left center;
    }
}
</style>
