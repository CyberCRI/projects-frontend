<template>
    <div class="chip" :class="{ 'chip--small': small, selected: !hasRightIcon && selected }">
        <div v-if="leftIcon.length !== 0" class="chip__left-icon">
            <IconImage :name="leftIcon" />
        </div>

        <div class="chip__name">{{ name }}</div>

        <div
            v-if="hasRightIcon"
            class="chip__right-icon"
            :class="{ selected, removable }"
            @click="handleTag"
        >
            <IconImage :name="rightIcon" />
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'LpiChip',

    emits: ['remove', 'add'],

    components: {
        IconImage,
    },

    props: {
        leftIcon: {
            type: String,
            default: '',
            validator(value) {
                return ['Account', 'Flag', ''].includes(value)
            },
        },

        name: {
            type: String,
            required: true,
        },

        selected: {
            type: Boolean,
            default: false,
        },

        removable: {
            type: Boolean,
            default: false,
        },

        small: {
            type: Boolean,
            default: false,
        },

        hasRightIcon: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        rightIcon() {
            if (this.removable) return 'Close'
            return this.selected ? 'Check' : 'Plus'
        },
    },

    methods: {
        handleTag() {
            if (this.removable) this.$emit('remove')

            if (!this.selected) this.$emit('add')
        },
    },
}
</script>

<style lang="scss" scoped>
.chip {
    display: inline-flex;
    align-items: center;
    border-radius: $border-radius-l;
    border: $border-width-l solid $primary-dark;
    height: 38px;
    box-sizing: border-box;
    transition: background-color 0.6s;

    &__name {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        padding-left: $space-m;
        padding-right: $space-m;
        font-weight: 700;
        font-size: $font-size-m;
        color: $primary-dark;
        height: 100%;
        transition: color 0.6s;
    }

    &__left-icon {
        display: flex;
        border-top-left-radius: $border-radius-l;
        border-bottom-left-radius: $border-radius-l;
        border-right: $border-width-l solid $primary-dark;
        padding: $space-2xs;
    }

    &__right-icon {
        display: flex;
        border-top-right-radius: $border-radius-l;
        border-bottom-right-radius: $border-radius-l;
        border-left: $border-width-l solid $primary-dark;
        padding: $space-2xs;
        cursor: pointer;
        background: $white;

        &:hover {
            background: $primary-lighter;
        }
    }

    &.selected {
        background: $primary-dark;

        .chip__name {
            color: $white;
        }
    }

    .selected {
        background: $primary-lighter;
    }

    .removable {
        svg {
            fill: $salmon;
        }
    }

    svg {
        width: pxToRem(24px);
        fill: $primary-dark;
    }
}

.chip.chip--small {
    border: $border-width-m solid $primary-dark;
    height: 24px;

    .chip__name {
        font-size: $font-size-2xs;
        border-right: 2px solid $primary-dark;
    }

    .chip__left-icon {
        border-right: 2px solid $primary-dark;
    }

    svg {
        width: pxToRem(12px);
    }
}
</style>
