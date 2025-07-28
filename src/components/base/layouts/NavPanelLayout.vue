<script setup>
import { onMounted, onUnmounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
import throttle from 'lodash/throttle'

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

const { isMobile } = useViewportWidth()

// layout with flex based width breaks large table fix
// (see src/functs/editorUtils.ts)
// workaround is to manually set width of the content panel
const fixLayoutWidth = throttle(() => {
  const outer = document?.querySelector('.content-panel-outer')
  const inner = document?.querySelector('.content-panel-inner')
  if (outer && inner) {
    inner.style.display = 'none'

    const w = outer.offsetWidth
    if (w) inner.style.width = `${w}px`
    inner.style.display = ''
  }
}, 100)

onMounted(() => {
  window?.addEventListener('resize', fixLayoutWidth)
  fixLayoutWidth()
})
onUnmounted(() => {
  window?.removeEventListener('resize', fixLayoutWidth)
})
// fix layout on vue route change (eg, switching tabs)
onBeforeRouteUpdate(fixLayoutWidth)
</script>
<template>
  <div class="nav-panel-layout" :class="{ 'no-nav': isNavCollapsed }">
    <div class="panels-ctn">
      <transition name="backdrop-fade">
        <div
          v-if="!isLoading && !isNavCollapsed"
          class="nav-panel-backdrop"
          @click="collapseNavPanel"
        ></div>
      </transition>
      <transition name="slide-panel">
        <div v-if="!isNavCollapsed" class="nav-panel">
          <div class="breadcrumbs-ctn">
            <LpiButton
              v-if="!isMobile && !isNavCollapsed"
              btn-icon="MenuFoldLine"
              class="toggle-button nav-panel-toggle-button"
              secondary
              @click="toggleNavPanel"
            />
          </div>
          <slot name="nav-panel" />
        </div>
      </transition>
      <div class="content-panel">
        <div class="breadcrumbs-ctn">
          <LpiButton
            v-if="isMobile || isNavCollapsed"
            btn-icon="MenuUnfoldLine"
            class="toggle-button nav-panel-toggle-button nav-panel-toggle-button-collapsed"
            secondary
            @click="toggleNavPanel"
          />
          <BreadCrumbs :breadcrumbs="breadcrumbs" />
        </div>
        <div class="content-panel-outer">
          <div class="content-panel-inner">
            <slot name="content" />
          </div>
        </div>
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
  padding-top: 0.7rem;
  height: 2rem;
  padding-bottom: 1rem;

  @media screen and (max-width: $min-tablet) {
    .breadcrumbs {
      padding-left: 2.6rem;
    }

    .toggle-button {
      position: fixed;
      z-index: 110;
      left: 1rem;
    }
  }
}

.nav-panel .breadcrumbs-ctn {
  justify-content: flex-end;
}

.panels-ctn {
  display: flex;
  gap: 3rem;
  position: relative;

  @media (max-width: $min-tablet) {
    padding: 0 $space-xs;
    gap: 0;
  }
}

.no-nav .panels-ctn {
  gap: 0;
}

.content-panel {
  flex-basis: 100%;
}

// @media screen and (max-width: $min-tablet) {
//   .slide-panel-enter-from,
//   .slide-panel-leave-to {
//     transform: translateX(-100%);
//   }

//   .slide-panel-enter-active,
//   .slide-panel-leave-active {
//     transition: transform 0.2s ease-in-out;
//   }

//   .slide-panel-enter-to,
//   .slide-panel-leave-from {
//     transform: translateX(0);
//   }

//   .backdrop-fade-enter-active,
//   .backdrop-fade-leave-active {
//     transition: opacity 0.2s ease-in-out;
//   }

//   .backdrop-fade-enter-to,
//   .backdrop-fade-leave-from {
//     opacity: 1;
//   }

//   .backdrop-fade-enter-from,
//   .backdrop-fade-leave-to {
//     opacity: 0;
//   }
// }
</style>
