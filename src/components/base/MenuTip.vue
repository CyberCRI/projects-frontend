<template>
  <div class="menu-tip" :class="{ 'is-open': isOpen }" @click.prevent.stop="open">
    <slot class="trigger" />
    <transition name="scale">
      <div
        v-show="isOpen"
        v-click-outside="close"
        class="menu-content"
        :class="{ 'shadowed-box': isOpen, 'is-open': isOpen }"
      >
        <ContextActionButton
          action-icon="Close"
          class="close-icon"
          secondary
          no-border
          @click.prevent.stop="close"
        />
        <div class="content-wrapper" @click.capture="closeAfterClick">
          <slot name="custom-content" />
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

  computed: {
    isOpen() {
      return openedMenuTip.value === this.uniqueId
    },
  },

  methods: {
    open() {
      openedMenuTip.value = this.uniqueId
    },

    close() {
      openedMenuTip.value = null
    },

    closeAfterClick() {
      this.$nextTick(() => {
        this.close()
      })
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
