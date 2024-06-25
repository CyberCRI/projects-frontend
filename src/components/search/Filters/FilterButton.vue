<template>
    <div
        :class="{
            'add-filter__button-list__button--selected': isSelected,
            'add-filter__button-list__button--hide': isHidden,

            'add-filter__button-list__button--unused': isUnused,
        }"
        class="add-filter__button-list__button"
    >
        {{ label }}
        <span v-if="isSelected" class="icon-ctn">
            <IconImage name="Close" />
        </span>
    </div>
</template>
<script>
import IconImage from '@/components/base/media/IconImage.vue'
export default {
    name: 'FilterButton',
    props: {
        label: {
            type: String,
            default: () => {},
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        isHidden: {
            type: Boolean,
            default: false,
        },
        isUnused: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        IconImage,
    },
}
</script>
<style lang="scss" scoped>
.add-filter__button-list__button {
    display: flex;
    align-items: center;
    background: $white;
    border: $border-width-s solid $primary;
    padding: $space-s;
    height: min-content;
    box-sizing: border-box;
    border-radius: $border-radius-l;
    text-transform: uppercase;
    font-size: $font-size-s;
    color: $primary-dark;
    line-height: $line-height-squashed;
    cursor: pointer;

    &:hover {
        opacity: 0.7;
    }

    &--selected {
        font-weight: 700;
        border: $border-width-s solid $primary-dark;
    }

    &--hide {
        display: none;
    }

    &--unused {
        background: transparent;
        border: $border-width-s solid $primary;
    }

    $filter-value-icon-size: 1em;

    .icon-ctn {
        flex-shrink: 0;
        margin-left: $space-m;
        display: inline-block;
        width: $filter-value-icon-size;
        height: $filter-value-icon-size;
        background: $primary-dark;
        position: relative;
        border: $border-width-m solid $primary-dark;
        border-radius: 100%;

        svg {
            width: $filter-value-icon-size;
            fill: $white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
