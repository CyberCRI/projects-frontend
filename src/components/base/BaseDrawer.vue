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
              {{ title }}
            </div>

            <slot name="header_clear" />
          </div>

          <LpiButton
            data-test="drawer-close"
            btn-icon="Close"
            :aria-label="$t('common.close')"
            @click="close"
          />
        </header>

        <main
          ref="main"
          :style="customStyle"
          class="drawer__main custom-scrollbar"
          :class="{
            'pointer-events-none opacity-80': asyncing,
          }"
        >
          <slot />
        </main>

        <footer v-if="!noFooter" class="drawer__footer">
          <slot name="footer">
            <LpiButton
              :disabled="asyncing"
              :label="$t('common.cancel')"
              secondary
              class="footer__left-button"
              data-test="close-button"
              @click="close"
            />

            <LpiButton
              :disabled="confirmActionDisabled || asyncing"
              :label="confirmActionName || $t('common.confirm')"
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

<script setup lang="ts">
import LpiButton from '~/components/base/button/LpiButton.vue'
import type { StyleValue } from 'vue'

import { onClient, onClientUnmounted } from '~/composables/onClient'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    title: string
    confirmActionName?: string
    noFooter?: boolean
    customStyle?: StyleValue
    confirmActionDisabled?: boolean
    asyncing?: boolean
  }>(),
  {
    isOpened: false,
    confirmActionName: null,
    noFooter: false,
    customStyle: () => ({}),
    confirmActionDisabled: false,
    asyncing: false,
  }
)

const emit = defineEmits(['close', 'confirm', 'unselect'])

const scrolled = ref(false)
const uniqueId = useUniqueId()
const mainRef = useTemplateRef('main')

const close = () => emit('close')
const confirm = () => emit('confirm')
const onScroll = () => (scrolled.value = mainRef.value && mainRef.value.scrollTop > 10)

watch(
  () => props.isOpened,
  onClient((neo, old) => {
    if (neo !== old) {
      if (neo) {
        document.querySelector('body').classList.add(`has-open-drawer-${uniqueId}`)
        nextTick(() => (mainRef.value ? mainRef.value.addEventListener('scroll', onScroll) : null))
      } else {
        document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)
        if (mainRef.value) mainRef.value.removeEventListener('scroll', onScroll)
      }
    }
  }),
  { immediate: true }
)

onClientUnmounted(() => {
  // if destroyed before closing, need to cleanup un-scrollable body
  document.querySelector('body').classList.remove(`has-open-drawer-${uniqueId}`)
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$slide-duration: 400ms;

.background {
  z-index: variables.$zindex-drawer;
  position: fixed;
  inset: 0;
  height: 100vh;
  width: 100vw;
  background-color: variables.$modal-background;
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
  z-index: variables.$zindex-drawer;
  background: variables.$white;
  border-left: variables.$border-width-s solid variables.$primary-dark;
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
    padding: 0 variables.$space-l variables.$space-xl;
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
    gap: variables.$space-m;
    padding: variables.$space-l;

    .selected-card {
      background-color: variables.$primary-lighter;
    }
  }

  .small > & {
    width: variables.pxtorem(450px);
    max-width: 100vw;
  }

  .medium > & {
    width: variables.pxtorem(850px);
    max-width: 100vw;
  }

  .full > & {
    width: 100vw;
    max-width: 100vw;
  }

  .transparent > &,
  .transparent > &__footer {
    background-color: color-mix(in srgb, variables.$modal-background, transparent 10%);
  }

  &__header {
    flex-shrink: 0;
    min-height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 variables.$space-l;

    &.scrolled {
      box-shadow: 0 2px 5px rgb(190 190 190 / 50%);
    }
  }

  &__footer {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: variables.$border-width-s solid variables.$lighter-gray;
    color: variables.$primary-dark;
    font-weight: 700;
    padding-top: variables.$space-l;
    padding-bottom: variables.$space-l;
    position: sticky;
    bottom: 0;
    background: variables.$white;
    gap: variables.$space-l;

    .transparent > & {
      background-color: color-mix(in srgb, variables.$modal-background, transparent 10%);
      color: white;
    }

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
    font-size: variables.$font-size-2xl;
    color: variables.$black;

    .transparent & {
      color: white;
    }

    font-weight: 700;
    display: flex;
    align-items: center;
  }
}
</style>
