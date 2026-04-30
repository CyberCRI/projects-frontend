<template>
  <div class="recommendation-list">
    <ul v-if="recomendations.length > 0" class="recommendation-list-container">
      <slot />
    </ul>
    <EmptyLabel v-else :label="$t('recommendations.empty')" />
    <div class="more">
      <LpiButton :label="moreLabel" class="skeletons-background" secondary :to="to" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends any[]">
import LpiButton from '@/components/base/button/LpiButton.vue'
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    recomendations: T
    to: RouteLocationRaw
    moreLabel?: string
  }>(),
  {
    moreLabel: '',
  }
)
</script>

<style lang="scss" scoped>
.recommendation-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block: $space-m;
}

.recommendation-list-container {
  width: 100%;
}

.more {
  margin-block: $space-s;
}
</style>
