<template>
  <div class="sdg-ctn">
    <component :is="is" v-for="sdg in sdgsArray" :key="sdg.id" :to="sdg.to">
      <SdgIcon :sdg-id="sdg.id" class="sdg-img" logo="short" />
    </component>
  </div>
</template>

<script setup lang="ts">
import SdgIcon from '~/components/search/Filters/SdgIcon.vue'

import type { RouteLocationNamedRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    sdgs: number[]
    to?: RouteLocationNamedRaw
  }>(),
  {
    to: null,
  }
)

const is = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }
  return 'div'
})

const sdgsArray = computed(() => {
  const sdgs = props.sdgs.toSorted((a, b) => a - b)
  return sdgs.map((sdgId) => {
    const to = props.to
      ? {
          ...props.to,
          query: {
            ...props.to.query,
            sdgs: sdgId,
          },
        }
      : null

    return {
      id: sdgId,
      to,
    }
  })
})
</script>

<style lang="scss" scoped>
.sdg-ctn {
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;

  .sdg-img {
    width: pxToRem(40px);
    height: pxToRem(40px);
    transition: all 0.2s ease-in-out;
    transform: translateZ(0);

    &:hover {
      transform: translateZ(0) scale(1.2);
    }
  }
}
</style>
