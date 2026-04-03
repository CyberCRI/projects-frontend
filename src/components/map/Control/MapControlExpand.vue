<script setup lang="ts">
const emit = defineEmits(['expand'])
const onExpand = () => emit('expand')
</script>

<template>
  <div class="expand-container">
    <button class="btn-expand" :aria-label="$t('common.expand-in')" @click.prevent.stop="onExpand">
      <IconImage name="Expand" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.expand-container {
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

.btn-expand {
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
