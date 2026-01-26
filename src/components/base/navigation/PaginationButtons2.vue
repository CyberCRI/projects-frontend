<template>
  <ul v-if="!hideEmpty || canPrev || canNext" class="pagination">
    <li :class="{ hidden: !canPrev }">
      <IconImage name="ChevronLeft" @click="pagination.prev()" />
    </li>

    <template v-if="showNumber">
      <li
        v-for="(page, i) in pageArray"
        :key="i"
        :class="{ current: page.current, ellipsis: page.value === ELLIPSIS }"
        @click="setPage(page.value)"
      >
        {{ page.value }}
      </li>
    </template>

    <li :class="{ hidden: !canNext }">
      <IconImage name="ChevronRight" @click="pagination.next()" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import { Pagination } from '@/composables/usePagination'

defineOptions({ name: 'PaginationButtons2' })

const props = withDefaults(
  defineProps<{ pagination: Pagination; showNumber?: boolean; hideEmpty?: boolean }>(),
  { showNumber: true, hideEmpty: false }
)

const { canNext, canPrev } = props.pagination

const ELLIPSIS = '...'

const pageArray = computed(() => {
  const pages: { value: string | number; current?: boolean }[] = Array.from(
    Array(props.pagination.total.value),
    (_, i) => {
      return { value: i + 1, current: props.pagination.current.value === i + 1 }
    }
  )

  if (props.pagination.total.value - props.pagination.current.value > 2)
    pages.splice(
      props.pagination.current.value + 1,
      props.pagination.total.value - props.pagination.current.value - 2,
      { value: ELLIPSIS }
    )
  if (props.pagination.current.value > 3)
    pages.splice(1, props.pagination.current.value - 3, { value: ELLIPSIS })

  return pages
})

const setPage = (value) => {
  if (value === ELLIPSIS) {
    return
  }
  props.pagination.setPage(value)
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
