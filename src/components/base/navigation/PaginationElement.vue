<template>
  <button class="reset-btn" type="button" rel="noopener" :aria-label="$t('pagination.next')">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

button {
  fill: variables.$primary-dark;
  color: variables.$primary-dark;
  font-weight: bold;
  font-size: variables.$font-size-xs;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &.current,
  &:hover {
    background: variables.$primary-light;
    border-radius: variables.$border-radius-l;
  }

  &:not(.current, .ellipsis):hover {
    color: variables.$primary;
    fill: variables.$primary;
  }

  &:not(.current, .ellipsis):active {
    color: variables.$black;
    fill: variables.$black;
  }
}
</style>
