<template>
  <div class="contextual-tool-menu">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.contextual-tool-menu {
  position: relative;
  align-items: center;
  background: var(--white);
  color: $white;
  display: flex;
  border: 1px solid var(--primary-dark);
  border-radius: 6px;
  padding: $space-xs $space-s;
  gap: $space-s;
  filter: drop-shadow(0 2px 5px rgb(54 54 54 / 50%));

  :deep(.menu-item) {
    color: $white;
  }
}
</style>
