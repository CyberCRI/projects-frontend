<template>
    <div class="menu-tip" @click.prevent.stop="open" :class="{ 'is-open': isOpen }">
        <slot class="trigger"></slot>
        <transition name="scale">
            <div
                class="menu-content"
                v-show="isOpen"
                :class="{ 'shadowed-box': isOpen, 'is-open': isOpen }"
                v-click-outside="close"
                @click.capture="closeAfterClick"
            >
                <ContextActionButton
                    action-icon="Close"
                    class="close-icon"
                    @click.prevent.stop="close"
                    secondary
                    no-border
                />
                <div class="content-wrapper">
                    <slot name="custom-content"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import { ref } from 'vue'

let openedMenuTip = ref(null)

export default {
    name: 'MenuTip',

    components: {
        ContextActionButton,
    },

    data() {
        return {
            uniqueId: (Math.random() + 1).toString(36).substring(7),
            openedMenuTip,
        }
    },

    methods: {
        open() {
            openedMenuTip.value = this.uniqueId
        },

        close() {
            openedMenuTip.value = null
        },

        closeAfterClick(event) {
            if (event.target.closest('.menu-tip .content-wrapper')) {
                this.$nextTick(() => {
                    this.close()
                })
            }
        },
    },

    computed: {
        isOpen() {
            return openedMenuTip.value === this.uniqueId
        },
    },
}
</script>

<style lang="scss" scoped>
$padding: 1rem;

.menu-tip {
    width: max-content;
    height: max-content;
    position: relative;
    z-index: 10;

    &.is-open {
        z-index: 11; // so it appear higher than other triggers
    }
}

.menu-content {
    padding: 1rem;
    padding-right: 3rem;
    background-color: $white;
    border: $border-width-s solid $primary-dark;
    position: absolute;
    top: -1rem;
    right: -1rem;
    width: max-content;
    height: max-content;

    .close-icon {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }
}

.scale-enter-from,
.scale-leave-to {
    transform: scale(0);
}

.scale-enter-to,
.scale-leave-from {
    transform: scale(1);
}

.scale-enter-active,
.scale-leave-active {
    transition: transform 0.2s ease-in-out;
    transform-origin: calc(100% - 1.5rem) 1.5rem;
}
</style>
