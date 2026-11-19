<template>
  <div class="separator"></div>
  <div class="award">
    <h2 class="award-title skeletons-text">
      {{ award.$t.name }}
    </h2>
    <p class="skeletons-text">
      {{ award.$t.description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedAward } from 'shared-projects-frontend/models'

defineProps<{
  award: TranslatedAward
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.associate-link {
  color: variables.$primary-dark;
  font-weight: 600;
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
}

.award ~ .separator {
  display: block;
}
</style>
