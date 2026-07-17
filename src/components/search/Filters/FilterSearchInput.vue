<template>
  <div class="filter-search-input-ctn">
    <input
      ref="search-input"
      v-bind="attrs"
      v-model="model"
      class="search-input"
      type="text"
      data-test="search-input"
      @keyup.enter="$emit('enter')"
    />
  </div>
</template>

<script setup lang="ts">
const attrs = useAttrs()
const model = defineModel<string>()

defineEmits<{ enter: [] }>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.filter-search-input-ctn {
  position: relative;
  cursor: pointer;
  width: 100%;

  .search-input {
    background: variables.$white;
    border: variables.$border-width-s solid variables.$light-gray;
    border-radius: variables.$border-radius-xs;
    color: variables.$black;
    padding: variables.$space-s;
    font-size: variables.$font-size-m;
    width: 100%;
    box-sizing: border-box;

    &:focus,
    &:focus-visible {
      outline: 0 none;
    }

    &::placeholder {
      color: variables.$light-gray;
    }
  }
}
</style>
