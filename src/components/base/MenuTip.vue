<template>
  <div class="menu-tip" :class="{ 'is-open': stateModal }" @click.prevent.stop="openModal">
    <slot class="trigger" />
    <transition name="scale">
      <div
        v-show="stateModal"
        v-click-outside="closeModal"
        class="menu-content"
        :class="{ 'shadowed-box': stateModal, 'is-open': stateModal }"
      >
        <ContextActionButton
          action-icon="Close"
          class="close-icon"
          secondary
          no-border
          @click.prevent.stop="closeModal"
        />
        <div class="content-wrapper" @click.capture="closeAfterClick">
          <slot name="custom-content" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'

const { stateModal, openModal, closeModal } = useModal()
const closeAfterClick = () => nextTick(() => closeModal())
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
  transform: translateZ(0) scale(0);
}

.scale-enter-to,
.scale-leave-from {
  transform: translateZ(0) scale(1);
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.2s ease-in-out;
  transform-origin: calc(100% - 1.5rem) 1.5rem;
}
</style>
