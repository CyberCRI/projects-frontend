<template>
    <button
        class="header-link"
        :class="{ underlined }"
        @click="$emit('click')"
        :data-test="dataTest"
    >
        <span class="link-label">
            <slot>
                <IconImage
                    v-if="icon"
                    :name="icon"
                    class="icon"
                    :class="{ rounded: roundedIcon }"
                />
                {{ label }}
            </slot>
        </span>
    </button>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'HeaderLink',

    emits: ['click'],

    components: {
        IconImage,
    },

    props: {
        label: {
            type: String,
            default: null,
        },

        icon: {
            type: String,
            default: null,
        },

        routes: {
            type: Array,
            default: null,
        },

        roundedIcon: {
            type: Boolean,
            default: false,
        },
        dataTest: {
            type: String,
            default: null,
        },
    },

    computed: {
        underlined() {
            return this.routes && this.routes.length && this.routes.includes(this.$route.name)
        },
    },
}
</script>

<style lang="scss" scoped>
.header-link {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $space-m $space-l;
    font-weight: 700;
    font-size: $font-size-m;
    cursor: pointer;
    will-change: transform;
    overflow: hidden;
    height: 42px;
    background-color: transparent;
    color: $primary-dark;
    border: 0 none;
    text-transform: uppercase;

    .link-label {
        display: flex;
        position: relative;
    }

    .icon {
        margin-right: $space-s;
        height: pxToRem(18px);
        fill: $primary-dark;

        &.rounded {
            fill: $white;
            background-color: $primary-dark;
            border-radius: pxToRem(9px);
        }
    }

    &.underlined,
    &:hover {
        opacity: 1;
        position: relative;

        & .link-label::after {
            content: '';
            position: absolute;
            bottom: -$space-xs;
            left: 0;
            right: 0;
            height: pxToRem(6px);
            background-color: $primary-dark;
        }
    }
}
</style>
