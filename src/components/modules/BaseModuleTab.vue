<template>
  <div class="basemodule-card">
    <div class="basemodule">
      <div v-if="header" class="basemodule-header">
        <h2 class="title skeletons-text">
          {{ title }}
          <span v-show="count">( {{ count }} )</span>
        </h2>
      </div>
      <div class="basemodule-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    count?: number
    header?: boolean
  }>(),
  { header: true, title: '', count: 0 }
)
</script>

<style lang="scss" scoped>
.basemodule-card {
  .basemodule {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: $space-l;

      .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: var(--primary-dark);
        margin-bottom: 1rem;
      }
    }

    &-container {
      width: 100%;
    }
  }
}
</style>
