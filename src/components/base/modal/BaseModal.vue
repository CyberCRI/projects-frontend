<template>
  <div>
    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="stateModal" class="modal-backdrop" data-test="modal-backdrop">
          <div
            :id="modalId"
            class="modal-wrapper"
            :data-test="modalDataTest"
            :class="{ 'full-screen': fullScreen }"
          >
            <div v-if="$slots.topping" class="modal-topping">
              <slot name="topping" />
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
                  <slot name="header-title" />
                </div>

                <div class="dismiss-button">
                  <slot name="dismiss-button" :close="close">
                    <ContextActionButton
                      v-if="canClose"
                      secondary
                      aria-label="Close modal"
                      class="btn-close"
                      action-icon="Close"
                      data-test="modal-dismiss-button"
                      @click="close"
                    />
                  </slot>
                </div>
              </section>
              <section
                id="modalDescription"
                class="modal-content custom-scrollbar"
                @scroll="$emit('content-scroll', $event)"
              >
                <slot name="content" />
              </section>

              <footer v-if="$slots.footer" class="modal-footer">
                <slot name="footer" />
              </footer>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import ContextActionButton from '~/components/base/button/ContextActionButton.vue'

import { useUniqueId } from '~/composables/useUniqueId'

import { delay } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    canClose?: boolean
    isSmall?: boolean
    fullScreen?: boolean
    modalId?: string
    modalDataTest?: string
  }>(),
  {
    width: null,
    height: null,
    canClose: true,
    isSmall: false,
    fullScreen: false,
    modalId: null,
    modalDataTest: null,
  }
)

const emit = defineEmits<{
  close: []
  submit: []
  'content-scroll': [any]
}>()

const { stateModal, closeModal, openModal } = useModal()
const uniqueId = useUniqueId()

const customSize = computed(() => ({
  width: props.width,
  height: props.height,
}))

const close = async () => {
  closeModal()
  await delay(500)
  emit('close')
}

onMounted(() => {
  document.body.classList.add(`has-open-modal-${uniqueId}`)
  nextTick(() => openModal())
})

onBeforeUnmount(() => {
  document.body.classList.remove(`has-open-modal-${uniqueId}`)
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.modal-backdrop {
  z-index: variables.$zindex-modal-backdrop;
  position: fixed;
  inset: 0;
  background: variables.$modal-background;
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
    top: variables.$navbar-height;
    left: 0;
    width: 100vw;
    height: calc(100vh - variables.$navbar-height);
    transform: unset;

    .modal {
      max-width: unset;
    }
  }
}

.modal {
  z-index: variables.$zindex-modal;
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  background: variables.$white;
  overflow: hidden;
  color: variables.$almost-black;
  border-radius: variables.$border-radius-s;
  max-width: clamp(320px, 90%, 760px);
  margin: variables.$space-s;
  max-height: calc(100vh - 32px);
  padding-top: variables.$space-l;
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
  padding: 20px;
  flex-grow: 1;
  overflow-y: scroll;
  max-height: 80vh;
  display: flex;
  flex-flow: column;
}

.modal-footer {
  display: flex;
  place-content: space-between center;
  padding: variables.$space-l;

  button {
    cursor: pointer;
  }
}

@media screen and (min-width: variables.$min-tablet) {
  .modal-body {
    max-height: 800px;
  }
}

.modal-header {
  background-color: variables.$white;
  display: flex;
  justify-content: stretch;
  align-items: center;
  padding: 0 variables.$border-radius-l;
  box-sizing: border-box;
  position: relative;

  .header-title {
    flex-grow: 1;
    font-size: variables.$font-size-2xl;
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

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

@media (min-width: variables.$min-tablet) {
  .modal {
    max-height: calc(100vh - #{variables.$space-2xl});
    position: relative;

    &.small {
      max-width: 550px;
    }
  }
}
</style>
