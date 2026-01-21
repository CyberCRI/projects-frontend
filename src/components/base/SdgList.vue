<template>
  <div class="sdg-ctn">
    <NuxtLink v-for="sdg in sdgsArray" :key="sdg.id" :to="sdg.to">
      <img
        :alt="sdg.alt"
        :src="`${runtimeConfig.public.appPublicBinariesPrefix}/sdgs/logo/SDG-${sdg.id}.svg`"
        class="sdg-img"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  sdgs: number[]
  to: any
}>()

const runtimeConfig = useRuntimeConfig()

const sdgsArray = computed(() => {
  return props.sdgs.map((sdgId) => {
    const to = {
      ...props.to,
      query: {
        ...(props.to.query ?? {}),
        sdgs: sdgId,
      },
    }
    return {
      id: sdgId,
      to,
      // TODO(remi): convert sdgId alt text to i18n name sdg ?
      alt: `sdg number ${sdgId}`,
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
