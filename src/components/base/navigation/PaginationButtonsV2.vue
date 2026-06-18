<template>
  <nav
    v-if="!hideEmpty || canPrev || canNext"
    class="pagination"
    :class="{
      disable: disable,
    }"
  >
    <PaginationElement
      :class="{ hidePagination: !canPrev }"
      :aria-label="$t('pagination.previous')"
      @click="pagination.prev()"
    >
      <IconImage name="ChevronLeft" />
    </PaginationElement>

    <PaginationElement
      v-for="(page, i) in pageArray"
      :key="i"
      :class="{ current: page.current, ellipsis: page.value === ELLIPSIS }"
      :aria-label="`${$t('pagination.page')} ${page.value}`"
      @click="setPage(page.value)"
    >
      {{ page.value }}
    </PaginationElement>

    <PaginationElement
      :class="{ hidePagination: !canNext }"
      :aria-label="$t('pagination.next')"
      @click="pagination.next()"
    >
      <IconImage name="ChevronRight" />
    </PaginationElement>
  </nav>
</template>

<script setup lang="ts">
import PaginationElement from '~/components/base/navigation/PaginationElement.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import type { Pagination as PaginationType } from '~/composables/usePagination'

const props = withDefaults(
  defineProps<{
    pagination: PaginationType
    hideEmpty?: boolean
    disable?: boolean
  }>(),
  { hideEmpty: true, disable: false }
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
  justify-content: center;
  transition: opacity 0.2s;
  gap: 0.25rem;
  margin-top: 0.5rem;

  &.disable {
    pointer-events: none;
    opacity: 0.5;
  }

  svg {
    height: 1.3rem;
  }

  .ellipsis {
    cursor: initial;
    pointer-events: none;
  }
}

.hidePagination {
  visibility: hidden;
}
</style>
