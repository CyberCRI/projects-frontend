<template>
  <div class="section-header-ctn">
    <div class="section-header">
      <span>{{ title }}</span>
      &nbsp;
      <span v-if="quantity">({{ quantity }})</span>
    </div>

    <SeeMoreArrow
      v-if="hasButton"
      :label="buttonLabel"
      class="section-button"
      @click.prevent="$emit('redirect-button-clicked')"
    />
  </div>
</template>

<script setup lang="ts">
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'

withDefaults(
  defineProps<{
    title?: string
    buttonLabel?: string
    quantity?: number
    hasButton?: boolean
  }>(),
  {
    title: '',
    buttonLabel: null,
    quantity: null,
    hasButton: true,
  }
)

defineEmits<{ 'redirect-button-clicked': [] }>()
</script>

<style lang="scss" scoped>
.section-header-ctn {
  display: flex;
  align-items: flex-end;
  color: $primary-dark;
  fill: $primary-dark;
  margin-bottom: $space-m;

  .section-header {
    display: flex;
    align-items: flex-start;
    font-weight: 700;

    > span {
      font-size: $font-size-l;
    }
  }

  .section-button {
    font-size: $font-size-m;
  }
}
</style>
