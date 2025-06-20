<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  isNavCollapsed: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-nav-panel', 'collapse-nav-panel'])

const toggleNavPanel = () => {
  emit('toggle-nav-panel')
}

const collapseNavPanel = () => {
  emit('collapse-nav-panel')
}
</script>
<template>
  <div class="nav-panel-layout">
    <div class="breadcrumbs-ctn">
      <LpiButton
        :btn-icon="isNavCollapsed ? 'MenuUnfoldLine' : 'MenuFoldLine'"
        class="toggle-button"
        @click="toggleNavPanel"
      />
      <BreadCrumbs :breadcrumbs="breadcrumbs" />
    </div>
    <div class="panels-ctn">
      <transition name="backdrop-fade">
        <div
          v-if="!isLoading && !isNavCollapsed"
          class="nav-panel-backdrop"
          @click="collapseNavPanel"
        ></div>
      </transition>
      <transition name="slide-panel">
        <slot name="nav-panel" />
      </transition>
      <div class="content-panel">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.nav-panel-backdrop {
  display: none;

  @media (max-width: $min-tablet) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 70%);
    z-index: 99;
  }
}

.breadcrumbs-ctn {
  display: flex;
  align-items: center;
  gap: 1rem;

  @media screen and (max-width: $min-tablet) {
    .breadcrumbs {
      padding-left: 2.6rem;
    }

    .toggle-button {
      position: fixed;
      z-index: 110;
    }
  }
}

.panels-ctn {
  display: flex;
  gap: 3rem;
  position: relative;

  @media (max-width: $min-tablet) {
    padding: 0 $space-xs;
  }
}

.content-panel {
  flex-basis: 100%;
}

@media screen and (max-width: $min-tablet) {
  .slide-panel-enter-from,
  .slide-panel-leave-to {
    transform: translateX(-100%);
  }

  .slide-panel-enter-active,
  .slide-panel-leave-active {
    transition: transform 0.2s ease-in-out;
  }

  .slide-panel-enter-to,
  .slide-panel-leave-from {
    transform: translateX(0);
  }

  .backdrop-fade-enter-active,
  .backdrop-fade-leave-active {
    transition: opacity 0.2s ease-in-out;
  }

  .backdrop-fade-enter-to,
  .backdrop-fade-leave-from {
    opacity: 1;
  }

  .backdrop-fade-enter-from,
  .backdrop-fade-leave-to {
    opacity: 0;
  }
}
</style>
