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
.filter-search-input-ctn {
  position: relative;
  cursor: pointer;
  width: 100%;

  .search-input {
    background: $white;
    border: $border-width-s solid $light-gray;
    border-radius: $border-radius-xs;
    color: $black;
    padding: $space-s;
    font-size: $font-size-m;
    width: 100%;
    box-sizing: border-box;

    &:focus,
    &:focus-visible {
      outline: 0 none;
    }

    &::placeholder {
      color: $light-gray;
    }
  }
}
</style>
