<template>
  <NuxtLink
    class="drop-down-menu-item-content"
    :to="{ name: 'Category', params: { slugOrId: option.slug || option.id } }"
  >
    <span class="label">{{ label }}</span>
  </NuxtLink>
</template>

<script setup>
defineOptions({
  name: 'LpiDropDownElementLink',
})
defineEmits(['click'])

defineProps({
  option: {
    type: Object,
    required: true,
  },
})

const label = computed(() => {
  const vl = option.label ?? option.name ?? option.value
  return $filters.capitalize(vl)
})
</script>

<style lang="scss" scoped>
.drop-down-menu-item-content {
  color: $primary-dark;
  padding: $space-m $space-s;
  font-size: $font-size-s;
  display: flex;
  align-items: center;
  font-family: Ubuntu, 'Noto Sans SC', helvetica, arial, sans-serif;

  .label {
    transform-origin: left center;
    transition: transform 200ms ease-in-out;
    font-weight: 400;
    font-size: $font-size-m;
  }

  &:hover {
    background-color: $primary-light;

    .label {
      transform: scaleX(1.1);
    }
  }
}
</style>
