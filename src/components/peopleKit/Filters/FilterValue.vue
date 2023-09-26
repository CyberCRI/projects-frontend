<template>
    <div :class="type" class="filter-value">
        <div class="filter-value-label">{{ label }}</div>

        <span v-if="icon" class="icon-ctn">
            <IconImage :name="icon" />
        </span>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'FilterValue',
    props: {
        label: {
            type: String,
            default: () => {},
        },

        icon: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            default: '',
        },
    },

    components: {
        IconImage,
    },
}
</script>

<style lang="scss" scoped>
$filter-value-icon-size: 16px;

.filter-value {
    display: flex;
    align-items: center;
    justify-content: center;
    border: $border-width-s solid $primary-dark;
    border-radius: $border-radius-l;
    overflow: hidden;
    box-sizing: border-box;
    min-width: 40px;
    background: $white;
    padding: $space-s $space-m;

    .filter-value-label {
        text-transform: uppercase;
        font-size: $font-size-s;
        font-weight: 700;
        color: $primary-dark;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }

    .icon-ctn {
        margin-left: $space-m;
        display: inline-block;
        width: pxToRem($filter-value-icon-size);
        height: pxToRem($filter-value-icon-size);
        background: $primary-dark;
        position: relative;
        border: $border-width-m solid $primary-dark;
        border-radius: 100%;

        svg {
            width: pxToRem($filter-value-icon-size);
            fill: $white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    &.suggested {
        border: $border-width-s solid $green;

        .filter-value-label {
            font-weight: 400;
        }
    }

    &.actionable {
        cursor: pointer;
    }
}
</style>
