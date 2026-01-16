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
import IconImage from '@/components/base/media/IconImage.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'

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
.onboarding-todo {
  appearance: none;
  flex-basis: 25%;
  display: flex;
  align-items: center;
  gap: $space-m;
  background-color: $white;
  padding: $space-m $space-unit;
  border: $blue solid $border-width-s;
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
    background-color: $almost-white;
    cursor: default;
  }
}

.todo-label {
  font-weight: 700;
  font-size: $font-size-m;
  color: $primary-dark;
}

$checkbox-size: pxToRem(20px);

.loader {
  height: $checkbox-size;
  width: $checkbox-size;
}

.toto-state {
  margin-left: auto;
  width: $checkbox-size;
  height: $checkbox-size;
  border: $border-width-m solid $primary-dark;
  border-radius: $border-radius-xs;
  flex-shrink: 0;
  background-color: $white;

  .checkmark {
    display: none;
    object-fit: contain;
    fill: $white;
  }
}

.done .toto-state {
  background-color: $primary-dark;

  .checkmark {
    display: inline-block;
  }
}
</style>
