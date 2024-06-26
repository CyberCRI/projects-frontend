<template>
    <ToolTip
        arrow
        class="color-tip"
        :hover="true"
        :interactive="false"
        :disabled="!names || names?.length < 2"
        secondary
        placement="bottom"
        :class="{
            'is-hidden': isHidden,
        }"
    >
        <div
            @click.stop.prevent="$emit('main-action')"
            :class="{
                'is-selected': isSelected,

                'is-unused': isUnused,
            }"
            class="filter-button"
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
.filter-button {
    display: flex;
    gap: $space-m;
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

    &.is-selected {
        font-weight: 700;
        border: $border-width-s solid $primary-dark;
    }

    &.is-unused {
        background: transparent;
        border: $border-width-s solid $primary;
    }

    .icon-ctn {
        flex-shrink: 0;
    }
}

.is-hidden {
    display: none;
}

.tooltip-div {
    padding: 1rem;

    ul {
        list-style: square;
        padding-left: 1rem;
    }
}
</style>
