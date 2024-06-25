<template>
    <ToolTip
        arrow
        class="color-tip"
        :hover="true"
        :interactive="false"
        :disabled="!names?.length"
        secondary
        placement="bottom"
    >
        <div
            @click.stop.prevent="$emit('main-action')"
            :class="{
                'add-filter__button-list__button--selected': isSelected,
                'add-filter__button-list__button--hide': isHidden,

                'add-filter__button-list__button--unused': isUnused,
            }"
            class="add-filter__button-list__button"
        >
            {{ label }}
            <ContextActionButton
                v-if="isSelected"
                class="icon-ctn extra-small"
                @click.stop.prevent="$emit('clear-action')"
                action-icon="Close"
            />
        </div>
        <template #custom-content>
            <div class="tooltip-div">
                <ul class="list-ctn">
                    <li v-for="name in names" :key="name" class="item">
                        {{ name }}
                    </li>
                </ul>
            </div>
        </template>
    </ToolTip>
</template>
<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import ToolTip from '@/components/base/ToolTip.vue'

export default {
    name: 'FilterButton',

    emits: ['clear-action', 'main-action'],

    components: {
        ContextActionButton,
        ToolTip,
    },

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
        names: {
            type: Array,
            default: () => [],
        },
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
    }
}

.tooltip-div {
    padding: 1rem;

    ul {
        list-style: square;
        padding-left: 1rem;
    }
}
</style>
