<template>
  <div>
    <Transition appear name="background-appear">
      <div v-if="isOpened" class="background" data-test="drawer-background" @click="close" />
    </Transition>
    <Transition appear name="drawer-slide">
      <div v-if="isOpened" class="drawer" data-test="drawer-layout-container">
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
          <slot />
        </main>

        <footer v-if="!noFooter" class="drawer__footer">
          <slot name="footer">
            <LpiButton
              :disabled="asyncing"
              :label="$filters.capitalize($t('common.cancel'))"
              secondary
              class="footer__left-button"
              data-test="close-button"
              @click="close"
            />

            <LpiButton
              :disabled="confirmActionDisabled || asyncing"
              :label="$filters.capitalize(confirmActionName || $t('common.confirm'))"
              :btn-icon="asyncing ? 'LoaderSimple' : null"
              class="footer__right-button"
              data-test="confirm-button"
              @click="confirm"
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

  components: {
    IconImage,
    LpiButton,
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

    noFooter: {
      type: Boolean,
      default: false,
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
  },

  emits: ['close', 'confirm', 'unselect'],

  data() {
    return {
      scrolled: false,
      uniqueId: (Math.random() + 1).toString(36).substring(7),
    }
  },

  watch: {
    isOpened: {
      handler: function (neo, old) {
        if (!import.meta.client) return
        if (neo !== old) {
          if (neo) {
            document.querySelector('body').classList.add(`has-open-drawer-${this.uniqueId}`)
            this.$nextTick(() =>
              this.$refs.main ? this.$refs.main.addEventListener('scroll', this.onScroll) : null
            )
          } else {
            document.querySelector('body').classList.remove(`has-open-drawer-${this.uniqueId}`)
            if (this.$refs.main) this.$refs.main.removeEventListener('scroll', this.onScroll)
          }
        }
      },
      immediate: true,
    },
  },

  unmounted() {
    if (!import.meta.client) return
    // if destroyed before closing, need to cleanup un-scrollable body
    document.querySelector('body').classList.remove(`has-open-drawer-${this.uniqueId}`)
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
}
</script>

<style lang="scss" scoped>
$slide-duration: 400ms;

.background {
  z-index: $zindex-drawer;
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100vw;
  background-color: $modal-background;
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
    max-height: 100%;
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
    min-height: 64px;
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
      width: $layout-size-m;
      fill: $primary-dark;
    }
  }
}
</style>
