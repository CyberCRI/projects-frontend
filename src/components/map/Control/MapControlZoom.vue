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
  <div class="zoom-container">
    <button class="btn-zoom top" :aria-label="$t('common.zoom-in')" @click.prevent.stop="zoomIn">
      <IconImage name="Plus" />
    </button>
    <button
      class="btn-zoom bottom"
      :aria-label="$t('common.zoom-out')"
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
    color: rgba(0, 0, 0, 0.5);
    fill: rgba(0, 0, 0, 0.5);
  }

  &:hover svg {
    color: black;
    fill: black;
  }
}
</style>
