<template>
  <slot
    :limit="limit"
    :items="items"
    :total-count="list.length"
    :pagination="pagination"
    :pagination-action="onClickPagination"
    :is-loading="isLoading"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    limit?: number
    list?: any[]
  }>(),
  {
    limit: 12,
    list: () => [],
  }
)

const currentPage = ref(1)
const isLoading = ref(false)

const totalPage = computed(() => {
  return Math.ceil(props.list.length / props.limit)
})

const items = computed(() => {
  const start = (currentPage.value - 1) * props.limit
  const end = start + props.limit
  return props.list.slice(start, end)
})

const previous = computed(() => {
  return currentPage.value > 1 ? currentPage.value - 1 : null
})

const next = computed(() => {
  return currentPage.value < totalPage.value ? currentPage.value + 1 : null
})

const last = computed(() => {
  return totalPage.value
})

const pagination = computed(() => {
  return {
    currentPage: currentPage.value,
    total: totalPage.value,
    previous: previous.value,
    next: next.value,
    first: 1,
    last: last.value,
  }
})

const onClickPagination = async (page) => {
  // simulate async operation
  // for ux coherence
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 200))
  currentPage.value = page
  isLoading.value = false
}
</script>
