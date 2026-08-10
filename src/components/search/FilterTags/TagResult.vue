<template>
  <div class="tag-label" :data-test="`tag-label-${label}`">
    <div class="tag-header">
      <span class="tag-name">{{ label }}</span>
      <span v-if="classificationName" class="classification">{{ classificationName }}</span>
    </div>
    <p class="tag-description">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    description?: string
    classificationName?: string
  }>(),
  {
    description: '',
    classificationName: '',
  }
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.tag-label {
  display: inline-block;
  background: variables.$white;
  border: variables.$border-width-s solid variables.$primary;
  border-radius: variables.$border-radius-l;
  padding: variables.$space-s variables.$space-m;
  color: variables.$primary-dark;
  font-size: variables.$font-size-m;
}

.tag-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.classification {
  font-size: 0.7em;
  color: variables.$mid-gray;
}

.tag-name {
  text-transform: uppercase;
}

.tag-description {
  font-size: 0.7em;
}
</style>
