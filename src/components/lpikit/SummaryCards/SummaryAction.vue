<template>
    <div class="summary-action">
        <IconImage class="icon" :name="actionIcon" />
        <span class="label"> {{ $filters.capitalize(actionLabel) }}</span>
    </div>
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
    },
}
</script>
<style lang="scss" scoped>
.summary-action {
    display: flex;
    align-items: center;
    width: auto;
    margin-inline: $space-m;
    margin-block: $space-m;
    cursor: pointer;

    .icon {
        fill: $primary-dark;
        height: $font-size-2xl;
        width: $font-size-2xl;
    }

    .label {
        color: $primary-dark;
        font-weight: 700;
        margin-left: $space-xs;
    }

    .icon,
    .label {
        transition: transform 0.2s;
        transform-origin: left center;
    }

    &:hover {
        .icon {
            transform: scale(1.35);
        }

        .label {
            transform: scaleX(1.1);
        }
    }
}
</style>
