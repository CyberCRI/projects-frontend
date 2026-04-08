<template>
  <div id="mapControl" data-test="map-control" class="container-map-control">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.container-map-control {
  position: absolute;
  top: 0;
  right: 0;
  margin: 1rem;
  z-index: 400;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: end;
}
</style>
