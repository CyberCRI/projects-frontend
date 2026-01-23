<template>
  <div class="basegroup-card">
    <div class="basegroup">
      <div class="basegroup-header">
        <h2 v-if="header" class="title">
          {{ title }}
          <span v-show="count">( {{ count }} )</span>
        </h2>
      </div>
      <div class="basegroup-container">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

withDefaults(
  defineProps<{
    // group: TranslatedPeopleGroupModel
    title?: string
    count?: number
    header?: boolean
  }>(),
  { header: false, title: '', count: 0 }
)
</script>

<style lang="scss" scoped>
.basegroup-card {
  .basegroup {
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
        color: $primary-dark;
      }
    }

    &-container {
      width: 100%;
    }
  }

  .pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
  }
}
</style>
