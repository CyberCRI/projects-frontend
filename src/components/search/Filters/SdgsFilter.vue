<template>
  <div class="sdg-filter-container">
    <SdgIcon
      v-for="sdg in allSdgs"
      :key="sdg.id"
      :sdg-id="sdg.id"
      :selected="model.includes(sdg.id)"
      @toggled="toggleSdg"
    />
  </div>
</template>

<script setup lang="ts">
import SdgIcon from '@/components/search/Filters/SdgIcon.vue'
import allSdgs from '@/data/sdgs.json'

const model = defineModel<number[]>()

const toggleSdg = (sdgId) => {
  if (model.value.includes(sdgId)) {
    model.value = model.value.filter((id) => id !== sdgId)
  } else {
    model.value = [...model.value, sdgId]
  }
}
</script>

<style lang="scss" scoped>
.sdg-filter-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: pxToRem(16px);
  justify-items: center;
}

@media screen and (min-width: $max-mobile) {
  .sdg-filter-container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media screen and (min-width: $min-tablet) {
  .sdg-filter-container {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
}
</style>
