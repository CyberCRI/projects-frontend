<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
</script>
<template>
  <div class="card-list__empty">
    <p class="card-list__empty--text">
      {{ $t('project.nothing') }}
    </p>
    <img
      :src="`${runtimeConfig.public.appPublicBinariesPrefix}/empties/emptyBox.svg`"
      alt="Nothing here"
    />
  </div>
</template>
<style lang="scss" scoped>
.card-list__empty {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.card-list__empty--text {
  font-weight: 400;
  font-size: 22px;
  color: $primary-dark;
  margin-bottom: 24px;
}

.card-list__empty--image {
  width: 200px;
}
</style>
