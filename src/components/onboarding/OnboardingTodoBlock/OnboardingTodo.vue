<template>
  <button class="onboarding-todo" :class="{ done: todoDone, passive }">
    <span class="todo-label">{{ todoLabel }}</span>
    <LoaderSimple v-if="asyncing" class="loader" />
    <span v-else class="toto-state">
      <IconImage class="checkmark" name="Check" />
    </span>
  </button>
</template>
<script setup lang="ts">
import LoaderSimple from '~/components/base/loader/LoaderSimple.vue'
import IconImage from '~/components/base/media/IconImage.vue'

withDefaults(
  defineProps<{
    todoLabel: string
    todoDone: boolean
    asyncing?: boolean
    passive?: boolean
  }>(),
  {
    asyncing: false,
    passive: false,
  }
)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.onboarding-todo {
  appearance: none;
  flex-basis: 25%;
  display: flex;
  align-items: center;
  gap: variables.$space-m;
  background-color: variables.$white;
  padding: variables.$space-m variables.$space-unit;
  border: variables.$blue solid variables.$border-width-s;
  border-radius: 4rem;
  cursor: pointer;
  transition: 0.2s all ease-in-out;
  transform: translateZ(0);

  &:hover {
    transform: translateZ(0) scale(1.03);
  }

  &.passive,
  &.passive:hover {
    cursor: wait;
    transform: none;
  }

  &.done {
    pointer-events: none;
    background-color: variables.$almost-white;
    cursor: default;
  }
}

.todo-label {
  font-weight: 700;
  font-size: variables.$font-size-m;
  color: variables.$primary-dark;
}

$checkbox-size: variables.pxToRem(20px);

.loader {
  height: $checkbox-size;
  width: $checkbox-size;
}

.toto-state {
  margin-left: auto;
  width: $checkbox-size;
  height: $checkbox-size;
  border: variables.$border-width-m solid variables.$primary-dark;
  border-radius: variables.$border-radius-xs;
  flex-shrink: 0;
  background-color: variables.$white;

  .checkmark {
    display: none;
    object-fit: contain;
    fill: variables.$white;
  }
}

.done .toto-state {
  background-color: variables.$primary-dark;

  .checkmark {
    display: inline-block;
  }
}
</style>
