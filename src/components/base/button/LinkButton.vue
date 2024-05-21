<template>
    <component
        :is="to ? 'router-link' : 'button'"
        :to="to"
        :class="{ 'icon-only': iconOnly }"
        type="button"
        class="link-button"
    >
        <ButtonContent :label="label" :btn-icon="btnIcon" />
    </component>
</template>

<script>
import ButtonContent from '@/components/base/button/ButtonContent.vue'
export default {
    name: 'LinkButton',

    components: {
        ButtonContent,
    },

    props: {
        label: {
            type: String,
            default: null,
        },

        to: {
            default: null,
            validator(value) {
                // use custom validator insted of types to allow null or undefined
                return !value || typeof value === 'string' || typeof value === 'object'
            },
        },

        btnIcon: {
            type: [String, Object],
            default: null,
        },
    },

    computed: {
        iconOnly() {
            return (!this.label || !this.label.length) && this.btnIcon
        },
    },
}
</script>

<style lang="scss" scoped>
.link-button {
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
    border: none;
    background: transparent;
    color: $primary-dark;
    padding: 0 0 0 $space-l;
    gap: $space-s;

    &.icon-only {
        border-radius: 50%;
        width: 42px;
        height: 42px;
        padding: 0;
    }
}

.link-button :deep(svg) {
    transition: 0.15s fill ease-in-out;
    fill: $primary-dark;
}
</style>