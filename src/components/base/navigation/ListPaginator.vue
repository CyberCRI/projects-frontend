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
<script>
export default {
  name: 'ListPaginator',

  props: {
    limit: {
      type: Number,
      default: 12,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      currentPage: 1,
      isLoading: false,
    }
  },

  computed: {
    totalPage() {
      return Math.ceil(this.list.length / this.limit)
    },

    items() {
      const start = (this.currentPage - 1) * this.limit
      const end = start + this.limit
      return this.list.slice(start, end)
    },

    previous() {
      return this.currentPage > 1 ? this.currentPage - 1 : null
    },

    next() {
      return this.currentPage < this.totalPage ? this.currentPage + 1 : null
    },

    last() {
      return this.totalPage
    },

    pagination() {
      return {
        currentPage: this.currentPage,
        total: this.totalPage,
        previous: this.previous,
        next: this.next,
        first: 1,
        last: this.last,
      }
    },
  },

  methods: {
    async onClickPagination(page) {
      // simulate async operation
      // for ux coherence
      this.isLoading = true
      await new Promise((resolve) => setTimeout(resolve, 200))
      this.currentPage = page
      this.isLoading = false
    },
  },
}
</script>
