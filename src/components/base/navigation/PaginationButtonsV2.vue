<template>
  <nav
    v-if="!hideEmpty || canPrev || canNext"
    class="pagination"
    :class="{
      disable: disable,
    }"
  >
    <button
      :class="{ hidden: !canPrev }"
      class="reset-btn"
      type="button"
      rel="noopener"
      :aria-label="$t('pagination.previous')"
    >
      <IconImage name="ChevronLeft" @click="pagination.prev()" />
    </button>

    <template v-if="showNumber">
      <button
        v-for="(page, i) in pageArray"
        :key="i"
        :class="{ current: page.current, ellipsis: page.value === ELLIPSIS }"
        type="button"
        rel="noopener"
        class="reset-btn"
        :aria-label="`${$t('pagination.page')} ${page.value}`"
        :value="page.value"
        @click="setPage(page.value)"
      >
        {{ page.value }}
      </button>
    </template>

    <button
      :class="{ hidden: !canNext }"
      class="reset-btn"
      type="button"
      rel="noopener"
      :aria-label="$t('pagination.next')"
    >
      <IconImage name="ChevronRight" @click="pagination.next()" />
    </button>
  </nav>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import { Pagination as PaginationType } from '@/composables/usePagination'

const props = withDefaults(
  defineProps<{
    pagination: PaginationType
    showNumber?: boolean
    hideEmpty?: boolean
    disable?: boolean
  }>(),
  { showNumber: true, hideEmpty: false, disable: false }
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
  transition: opacity 0.2s;

  &.disable {
    pointer-events: none;
    opacity: 0.5;
  }

  button {
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
      padding: 0.54rem 0.75rem;
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
    pointer-events: none;
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
