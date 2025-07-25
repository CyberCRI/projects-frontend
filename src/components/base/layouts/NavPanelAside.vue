<template>
  <div class="nav-panel">
    <div class="nav-panel-inner">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavPanelAside',
}
</script>
<style scoped lang="scss">
.nav-panel {
  flex-shrink: 0;
  flex-grow: 0;
}

@media screen and (max-width: $min-tablet) {
  .nav-panel {
    position: fixed;
    box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 10%);
    background-color: $white;
    z-index: 105;
    width: calc(18rem + 2.125rem);
    top: 3rem;
    left: 0;
    bottom: 0;
    overflow-y: auto;
    padding: 2.125rem;
    box-sizing: border-box;
    padding-top: 8rem; // or 4rem ?
  }
}

@media screen and (min-width: $min-tablet) {
  .nav-panel-inner {
    width: 16rem;
  }
}
</style>
