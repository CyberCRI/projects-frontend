<script setup lang="ts">
withDefaults(
  defineProps<{
    breadcrumbs?: any[]
    isNavCollapsed?: boolean
    isLoading?: boolean
  }>(),
  {
    breadcrumbs: () => [],
    isNavCollapsed: false,
    isLoading: false,
  }
)

const emit = defineEmits<{
  'toggle-nav-panel': []
  'collapse-nav-panel': []
}>()

const toggleNavPanel = () => emit('toggle-nav-panel')

const collapseNavPanel = () => emit('collapse-nav-panel')

const { isMobile } = useViewportWidth()
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
              class="toggle-button nav-panel-toggle-button skeletons-background"
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
            class="toggle-button nav-panel-toggle-button nav-panel-toggle-button-collapsed skeletons-background"
            secondary
            @click="toggleNavPanel"
          />
          <BreadCrumbs :breadcrumbs="breadcrumbs" />
        </div>
        <div class="content-panel-outer">
          <div class="content-panel-inner skeletons-background">
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
    background-color: color-mix(in srgb, var(--black), transparent 70%);
    z-index: 99;
  }
}

.nav-panel-layout {
  margin-bottom: $space-l;
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
  justify-content: flex-start;
}

.panels-ctn {
  display: flex;
  gap: 1.5rem;
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
</style>
