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

<script>
import IconImage from '~/components/base/media/IconImage.vue'

export default {
  name: 'PaginationButtons',

  components: { IconImage },

  props: {
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
  },

  emits: ['update-pagination'],

  computed: {
    pages() {
      const pages = Array.from(Array(this.total), (_, i) => {
        return { value: i + 1, current: this.current === i + 1 }
      })

      if (this.total - this.current > 2)
        pages.splice(this.current + 1, this.total - this.current - 2, {
          value: '...',
        })
      if (this.current > 3) pages.splice(1, this.current - 3, { value: '...' })

      return pages
    },
  },

  methods: {
    updatePage(pageNumber) {
      if (this.current === pageNumber - 1) this.goToPage('next')
      if (this.current === pageNumber + 1) this.goToPage('previous')
      if (pageNumber === 1) this.goToPage('first')
      if (pageNumber === this.total) this.goToPage('last')
    },

    goToPage(pageName) {
      this.$emit('update-pagination', this.pagination[pageName])
    },
  },
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.pagination {
  display: flex;
  align-items: center;

  li {
    fill: variables.$primary-dark;
    color: variables.$primary-dark;
    font-weight: bold;
    font-size: variables.$font-size-xs;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    display: flex;
    align-items: center;

    &:not(last-of-type) {
      margin-right: variables.$space-xl;
    }

    &.current {
      background: variables.$primary-light;
      padding: variables.$space-xs variables.$space-m;
      border-radius: variables.$border-radius-l;
    }

    &:not(.current, .ellipsis):hover {
      color: variables.$primary;
      fill: variables.$primary;
    }

    &:not(.current, .ellipsis):active {
      color: variables.$black;
      fill: variables.$black;
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
