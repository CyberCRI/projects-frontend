<template>
    <div>
        <Transition appear name="background-appear">
            <div v-if="isOpened" class="background" @click="close"></div>
        </Transition>
        <Transition appear name="drawer-slide">
            <div
                v-if="isOpened"
                :class="{
                    'no-footer': !hasFooter,
                    padding: padding,
                }"
                class="drawer"
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
                        <span class="icon-circle"><IconImage name="Close" /></span>
                    </div>
                </header>

                <main ref="main" :style="customStyle" class="drawer__main custom-scrollbar">
                    <slot></slot>
                </main>

                <footer v-if="hasFooter" class="drawer__footer">
                    <LpiButton
                        :disabled="asyncing"
                        :label="$filters.capitalize($t('common.cancel'))"
                        :secondary="true"
                        class="footer__left-button"
                        @click="close"
                        data-test="close-button"
                    />

                    <LpiButton
                        :disabled="confirmActionDisabled || asyncing"
                        :label="$filters.capitalize(confirmActionName || $t('common.confirm'))"
                        :left-icon="asyncing ? 'LoaderSimple' : null"
                        :secondary="false"
                        class="footer__right-button"
                        @click="confirm"
                        data-test="confirm-button"
                    />
                </footer>
            </div>
        </Transition>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'DrawerLayout',

    emits: ['close', 'confirm', 'unselect'],

    components: {
        IconImage,
        LpiButton,
    },

    data() {
        return {
            scrolled: false,
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
                        document.querySelector('body').classList.add('has-open-drawer')
                        this.$nextTick(() =>
                            this.$refs.main
                                ? this.$refs.main.addEventListener('scroll', this.onScroll)
                                : null
                        )
                    } else {
                        document.querySelector('body').classList.remove('has-open-drawer')
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
        document.querySelector('body').classList.remove('has-open-drawer')
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
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
    background-color: $gray-1;
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
        padding-left: $space-l;

        &.scrolled {
            box-shadow: 0 2px 5px rgb(190 190 190 / 50%);
        }
    }

    &__footer {
        flex-shrink: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        border-top: $border-width-s solid $gray-4;
        color: $primary-dark;
        font-weight: 700;
        padding-top: $space-l;
        padding-bottom: $space-l;
        position: sticky;
        bottom: 0;
        background: $white;

        button ~ button {
            margin-left: $space-m;
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
    width: 64px;
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
