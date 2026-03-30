<template>
  <div id="mapControl" class="container-map-control">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.container-map-control {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1rem;
  z-index: 999999;
}
</style>
