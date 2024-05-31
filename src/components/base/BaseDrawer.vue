<template>
    <div>
        <Transition appear name="background-appear">
            <div
                v-if="isOpened"
                class="background"
                @click="close"
                data-test="drawer-background"
            ></div>
        </Transition>
        <Transition appear name="drawer-slide">
            <div
                v-if="isOpened"
                :class="{
                    'no-footer': !hasFooter,
                    padding: padding,
                }"
                class="drawer"
                data-test="drawer-layout-container"
            >
                <header :class="{ scrolled }" class="drawer__header">
                    <div class="header-text">
                        <slot name="header_prefix" />

                        <div class="header__title">
                            {{ $filters.capitalize(title) }}
                        </div>

                        <slot name="header_clear" />
                    </div>

                    <div class="header__close" @click="close">
                        <span class="icon-circle shadow-box"><IconImage name="Close" /></span>
                    </div>
                </header>

                <main ref="main" :style="customStyle" class="drawer__main custom-scrollbar">
                    <slot></slot>
                </main>

                <footer v-if="hasFooter" class="drawer__footer">
                    <slot name="footer">
                        <LpiButton
                            :disabled="asyncing"
                            :label="$filters.capitalize($t('common.cancel'))"
                            secondary
                            class="footer__left-button"
                            @click="close"
                            data-test="close-button"
                        />

                        <LpiButton
                            :disabled="confirmActionDisabled || asyncing"
                            :label="$filters.capitalize(confirmActionName || $t('common.confirm'))"
                            :btn-icon="asyncing ? 'LoaderSimple' : null"
                            class="footer__right-button"
                            @click="confirm"
                            data-test="confirm-button"
                        />
                    </slot>
                </footer>
            </div>
        </Transition>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
    name: 'BaseDrawer',

    emits: ['close', 'confirm', 'unselect'],

    components: {
        IconImage,
        LpiButton,
    },

    data() {
        return {
            scrolled: false,
            uniqueId: (Math.random() + 1).toString(36).substring(7),
        }
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },

        title: {
            type: String,
            required: true,
        },

        confirmActionName: {
            type: String,
            default: null,
        },

        hasFooter: {
            type: Boolean,
            default: true,
        },

        customStyle: {
            type: Object,
            default: () => {},
        },

        confirmActionDisabled: {
            type: Boolean,
            default: false,
        },

        asyncing: {
            type: Boolean,
            deafault: false,
        },

        padding: {
            type: Boolean,
            default: true,
        },
    },

    methods: {
        close() {
            this.$emit('close')
        },
        confirm() {
            this.$emit('confirm')
        },
        onScroll() {
            this.scrolled = this.$refs.main && this.$refs.main.scrollTop > 10
        },
    },

    watch: {
        isOpened: {
            handler: function (neo, old) {
                if (neo !== old) {
                    if (neo) {
                        document
                            .querySelector('body')
                            .classList.add(`has-open-drawer-${this.uniqueId}`)
                        this.$nextTick(() =>
                            this.$refs.main
                                ? this.$refs.main.addEventListener('scroll', this.onScroll)
                                : null
                        )
                    } else {
                        document
                            .querySelector('body')
                            .classList.remove(`has-open-drawer-${this.uniqueId}`)
                        if (this.$refs.main)
                            this.$refs.main.removeEventListener('scroll', this.onScroll)
                    }
                }
            },
            immediate: true,
        },
    },

    unmounted() {
        // if destroyed before closing, need to cleanup un-scrollable body
        document.querySelector('body').classList.remove(`has-open-drawer-${this.uniqueId}`)
    },
}
</script>

<style lang="scss" scoped>
$header-height: 64px;
$footer-height: 42px;
$slide-duration: 400ms;

.background {
    z-index: $zindex-drawer;
    position: fixed;
    inset: 0;
    height: 100vh;
    width: 100vw;
    background-color: $dark-gray;
    opacity: 0.3;

    &.background-appear-enter-active {
        transition: transform 0s; // background appear immediately
        transition-timing-function: step-start;
    }

    &.background-appear-leave-active {
        transition: transform $slide-duration; // background disappear afetrr slide
        transition-timing-function: step-end;
    }

    &.drawer-slide-enter,
    &.drawer-slide-leave-to {
        opacity: 0;
    }
}

.drawer {
    z-index: $zindex-drawer;
    background: $white;
    border-left: $border-width-s solid $primary-dark;
    border-right: none;
    width: 90vw;
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    border-radius: 0;
    transform: translateX(0);

    .drawer__main {
        padding: $space-l $space-l $space-xl $space-l;
        overflow: auto;
        overflow-x: hidden;
        flex-grow: 1;
        display: flex;
        flex-flow: column nowrap;
    }

    &.drawer-slide-leave-active,
    &.drawer-slide-enter-active {
        transition: transform $slide-duration;
        transform: translateX(0);
    }

    &.drawer-slide-enter-from,
    &.drawer-slide-leave-to {
        transform: translateX(100%);
    }

    .results-ctn {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        gap: $space-m;
        padding: $space-l;

        .selected-card {
            background-color: $primary-lighter;
        }
    }

    &.padding {
        padding: pxToRem(16px);
    }

    .small > & {
        width: pxToRem(450px);
        max-width: 100vw;
    }

    .medium > & {
        width: pxToRem(850px);
        max-width: 100vw;
    }

    .full > & {
        width: 100vw;
        max-width: 100vw;
    }

    &__header {
        flex-shrink: 0;
        height: $header-height;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 $space-l;

        &.scrolled {
            box-shadow: 0 2px 5px rgb(190 190 190 / 50%);
        }
    }

    &__footer {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        border-top: $border-width-s solid $lighter-gray;
        color: $primary-dark;
        font-weight: 700;
        padding-top: $space-l;
        padding-bottom: $space-l;
        position: sticky;
        bottom: 0;
        background: $white;
        gap: $space-l;

        button ~ button {
            text-transform: capitalize;
        }
    }

    &.no-footer {
        &__main {
            max-height: calc(100vh - $space-l - $header-height);
        }
    }
}

.header-text {
    display: flex;
    flex-direction: row;
    align-items: center;

    .header__title {
        font-size: $font-size-2xl;
        color: $black;
        font-weight: 700;
        display: flex;
        align-items: center;
    }
}

.header__close {
    width: min-content;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .icon-circle {
        width: 2rem;
        height: 2rem;
        border: $border-width-s solid $primary-dark;
        border-radius: 2rem;
        position: relative;
        display: inline-block;

        svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: $font-size-m;
            fill: $primary-dark;
        }
    }
}
</style>
