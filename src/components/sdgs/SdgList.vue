<template>
  <div class="sdg-ctn">
    <component :is="is" v-for="sdg in sdgsArray" :key="sdg.id" :to="sdg.to">
      <img :alt="sdg.alt" :src="sdg.src" class="sdg-img" />
    </component>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    sdgs: number[]
    to?: any
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
            ...(props.to.query ?? {}),
            sdgs: sdgId,
          },
        }
      : null

    const src = usePublicURL(`/sdgs/logo/SDG-${sdgId}.svg`)
    return {
      id: sdgId,
      to,
      // TODO(remi): convert sdgId alt text to i18n name sdg ?
      alt: `sdg number ${sdgId}`,
      src,
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
