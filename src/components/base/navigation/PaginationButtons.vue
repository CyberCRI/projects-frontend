<template>
  <ul class="pagination">
    <li :class="{ hidden: current === 1 }">
      <IconImage name="ChevronLeft" @click="goToPage('previous')" />
    </li>

    <li
      v-for="(page, i) in pages"
      :key="i"
      :class="{ current: page.current, ellipsis: page.value === '...' }"
      @click="updatePage(page.value)"
    >
      {{ page.value }}
    </li>

    <li :class="{ hidden: current === total }">
      <IconImage name="ChevronRight" @click="goToPage('next')" />
    </li>
  </ul>
</template>

<script setup>
import IconImage from '@/components/base/media/IconImage.vue'

defineOptions({ name: 'PaginationButtons' })

const props = defineProps({
  current: {
    type: Number,
    required: true,
  },

  total: {
    type: Number,
    required: true,
  },

  pagination: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['update-pagination'])

const pages = computed(() => {
  const pages = Array.from(Array(props.total), (_, i) => {
    return { value: i + 1, current: props.current === i + 1 }
  })

  if (props.total - props.current > 2)
    pages.splice(props.current + 1, props.total - props.current - 2, { value: '...' })
  if (props.current > 3) pages.splice(1, props.current - 3, { value: '...' })

  return pages
})

const updatePage = (pageNumber) => {
  if (props.current === pageNumber - 1) goToPage('next')
  if (props.current === pageNumber + 1) goToPage('previous')
  if (pageNumber === 1) goToPage('first')
  if (pageNumber === props.total) goToPage('last')
}

const goToPage = (pageName) => {
  emit('update-pagination', props.pagination[pageName])
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;

  li {
    fill: $primary-dark;
    color: $primary-dark;
    font-weight: bold;
    font-size: $font-size-xs;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    display: flex;
    align-items: center;

    &:not(last-of-type) {
      margin-right: $space-xl;
    }

    &.current {
      background: $primary-light;
      padding: $space-xs $space-m;
      border-radius: $border-radius-l;
    }

    &:not(.current, .ellipsis):hover {
      color: $primary;
      fill: $primary;
    }

    &:not(.current, .ellipsis):active {
      color: $black;
      fill: $black;
    }
  }

  svg {
    height: 14px;
  }

  .ellipsis {
    cursor: initial;
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
