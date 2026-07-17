<template>
  <div class="s-switch-input-ctn">
    <span v-if="label" class="s-label">{{ label }}</span>

    <div class="s-switch" :class="{ active: modelValue }" @click="toggleValue">
      <div class="s-control" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: null,
  }
)

const model = defineModel<boolean>()

const toggleValue = () => {
  model.value = !model.value
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.s-switch-input-ctn {
  display: flex;
  align-items: center;

  &.vertical {
    flex-flow: column nowrap;
    align-items: flex-start;
  }

  .s-switch {
    width: 46px;
    height: 25px;
    padding: variables.$space-2xs;
    border-radius: variables.$border-radius-l;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    will-change: transform;
    background-color: variables.$mid-gray;

    .s-control {
      transition: transform 0.3s ease-out;
    }

    &.active {
      background-color: variables.$primary;
    }

    &.active .s-control {
      transform: translate3d(100%, 0, 0);
    }
  }

  .s-label {
    font-size: variables.$font-size-s;
    color: variables.$primary-dark;
    font-weight: bold;
    margin-bottom: variables.$space-2xs;
    margin-right: variables.$space-s;
  }

  &.black-label .s-label {
    color: variables.$black;
  }

  .s-control {
    border-radius: 50%;
    width: 19px;
    height: 19px;
    background: variables.$almost-white;
  }
}
</style>
