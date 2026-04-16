<script setup lang="ts">
const map = inject('map')

const zoomIn = () => {
  const mapRaw = toRaw((map as Ref<L.Map>).value)
  mapRaw.zoomIn()
}
const zoomOut = () => {
  const mapRaw = toRaw((map as Ref<L.Map>).value)
  mapRaw.zoomOut()
}
</script>

<template>
  <div data-test="map-control-zoom" class="zoom-container">
    <button
      data-test="map-control-zoom-in"
      class="btn-zoom top"
      :aria-label="$t('location.zoom-in')"
      @click.prevent.stop="zoomIn"
    >
      <IconImage name="Plus" />
    </button>
    <button
      data-test="map-control-zoom-out"
      class="btn-zoom bottom"
      :aria-label="$t('location.zoom-out')"
      @click.prevent.stop="zoomOut"
    >
      <IconImage name="Minus" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.zoom-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 0.5rem;

  $shadow-hover-def-1: 0 5px 10px rgb(0 0 0 / 12%);
  $shadow-hover-def-2: 0 4px 8px rgb(0 0 0 / 6%);

  box-shadow: $shadow-hover-def-1, $shadow-hover-def-2;
  overflow: hidden;
}

.btn-zoom {
  background-color: white;
  padding: 0.2rem;
  transition: all 0.2s;
  cursor: pointer;

  svg {
    width: 1.5rem;
    color: rgb(0 0 0 / 50%);
    fill: rgb(0 0 0 / 50%);
  }

  &:hover svg {
    color: black;
    fill: black;
  }
}
</style>
