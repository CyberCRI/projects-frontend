<template>
    <div>
        <teleport to="body">
            <transition name="modal-fade">
                <div class="modal-backdrop">
                    <div class="modal-wrapper" :class="{ 'full-screen': fullScreen }">
                        <div v-if="$slots.topping" class="modal-topping">
                            <slot name="topping"></slot>
                        </div>
                        <div
                            :class="{ small: isSmall }"
                            :style="customSize"
                            aria-describedby="modalDescription"
                            aria-labelledby="modalTitle"
                            class="modal"
                            role="dialog"
                        >
                            <section class="modal-header">
                                <div class="header-title">
                                    <slot name="header-title"></slot>
                                </div>

                                <div class="dismiss-button">
                                    <slot name="dismiss-button">
                                        <ContextActionButton
                                            v-if="canClose"
                                            secondary
                                            aria-label="Close modal"
                                            class="btn-close"
                                            action-icon="Close"
                                            @click="close"
                                        />
                                    </slot>
                                </div>
                            </section>
                            <section id="modalDescription" class="modal-content custom-scrollbar">
                                <slot name="content"></slot>
                            </section>

                            <footer v-if="$slots.footer" class="modal-footer">
                                <slot name="footer"></slot>
                            </footer>
                        </div>
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script>
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'

export default {
    name: 'BaseModal',

    components: { ContextActionButton },

    data() {
        return {
            uniqueId: (Math.random() + 1).toString(36).substring(7),
        }
    },

    props: {
        width: {
            type: String,
            default: null,
        },

        height: {
            type: String,
            default: null,
        },

        canClose: {
            type: Boolean,
            default: true,
        },

        isSmall: {
            type: Boolean,
            default: false,
        },

        fullScreen: {
            type: Boolean,
            default: false,
        },
    },

    emits: ['close', 'submit'],

    mounted() {
        document.querySelector('body').classList.add(`has-open-modal-${this.uniqueId}`)
    },

    unmounted() {
        document.querySelector('body').classList.remove(`has-open-modal-${this.uniqueId}`)
    },

    methods: {
        close() {
            this.$emit('close')
        },
    },

    computed: {
        customSize() {
            return {
                width: this.width,
                height: this.height,
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.modal-backdrop {
    z-index: $zindex-modal-backdrop;
    position: fixed;
    inset: 0;
    background: $modal-background;
}

.modal-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    display: flex;
    justify-content: center;

    &.full-screen {
        top: $navbar-height;
        left: 0;
        width: 100vw;
        height: calc(100vh - $navbar-height);
        transform: unset;

        .modal {
            max-width: unset;
        }
    }
}

.modal {
    z-index: $zindex-modal;
    flex-grow: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    background: $white;
    overflow: hidden;
    color: $dark;
    border-radius: $border-radius-s;
    max-width: clamp(320px, 90%, 760px);
    margin: $space-s;
    max-height: calc(100vh - 32px);
    padding-top: $space-l;
    box-shadow: 0 0 6px 0 rgb(0 0 0 / 15%);
}

.modal-body {
    flex-grow: 1;
}

.modal-topping {
    display: inline-block;
    position: absolute;
    z-index: 1100;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
}

.modal-content {
    position: relative;
    padding: 40px;
    flex-grow: 1;
    overflow-y: scroll;
    max-height: 80vh;
    display: flex;
    flex-flow: column;
}

.modal-footer {
    display: flex;
    align-content: space-between;
    justify-content: center;
    padding: $space-xl;

    button {
        cursor: pointer;
    }
}

@media screen and (min-width: $min-tablet) {
    .modal-body {
        max-height: 800px;
    }
}

.modal-header {
    background-color: $white;
    display: flex;
    justify-content: stretch;
    align-items: center;
    padding: 0 $border-radius-l;
    box-sizing: border-box;
    position: relative;

    .header-title {
        flex-grow: 1;
        font-size: $font-size-2xl;
        font-weight: bold;
        text-align: center;
    }

    .dismiss-button {
        position: absolute;
        top: 50%;
        right: 14px; /* modal padding + scrollbar width */
        transform: translate(0, -50%);
        z-index: 10;
    }
}

.modal-fade-enter,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.5s ease;
}

@media (min-width: $min-tablet) {
    .modal {
        max-height: calc(100vh - #{$space-2xl});
        position: relative;

        &.small {
            max-width: 550px;
        }
    }
}
</style>
