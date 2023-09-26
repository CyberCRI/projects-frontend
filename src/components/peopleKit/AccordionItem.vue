<template>
    <div class="accordion">
        <div class="header" :class="{ 'header-active': show }" @click="toggle">
            <slot name="header" />
            <IconImage name="MenuDown" class="icon" :class="{ rotate: show }" />
        </div>
        <transition
            name="accordion"
            @before-enter="beforeEnter"
            @enter="enter"
            @before-leave="beforeLeave"
            @leave="leave"
        >
            <div class="body" v-show="show">
                <div class="body-inner">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'AccordionItem',

    emits: ['is-active'],

    components: { IconImage },

    data() {
        return {
            show: false,
        }
    },

    methods: {
        toggle() {
            this.show = !this.show
            this.$emit('is-active', this.show)
        },

        beforeEnter(el) {
            el.style.height = '0'
        },

        enter(el) {
            el.style.height = '100%'
        },

        beforeLeave(el) {
            el.style.height = '100%'
        },

        leave(el) {
            el.style.height = '0'
        },
    },
}
</script>

<style scoped lang="scss">
.header {
    display: inline-flex;
    align-items: center;
    width: 100%;
    padding: 8px;
    border-radius: $border-radius-xs;

    &-active {
        background: $green;
        color: $primary-dark;
    }
}

.accordion .icon {
    width: pxToRem(24px);
    fill: $white;
    transform: rotate(0deg);
    transition-duration: 0.3s;
}

.accordion .body {
    display: block;
    overflow: scroll;
    border-top: 0;
    border-bottom-left-radius: $border-radius-s;
    border-bottom-right-radius: $border-radius-s;
    transition: 150ms ease-out;
}

.accordion .body-inner {
    padding: $space-s;
    overflow-wrap: break-word;
    overflow: auto;

    /*   white-space: pre-wrap; */
}

.accordion .icon.rotate {
    transform: rotate(180deg);
    transition-duration: 0.3s;
    fill: $primary-dark;
}
</style>
