<template>
  <div>
    <slot :is-loading="isLoading" :limit="searchLimit" :items="items" :total-count="totalCount" />

    <div v-if="pagination?.total > 1 && !isLoading" class="project-list-pagination">
      <PaginationButtons
        v-if="pagination"
        :current="pagination.currentPage"
        :pagination="pagination"
        :total="pagination.total"
        @update-pagination="onClickPagination"
      />
    </div>
  </div>
</template>

<script>
import { searchAll, searchProjects, searchGroupsAlgolia, searchUser } from '@/api/search.service'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import useAPI from '@/composables/useAPI.ts'
import { searchEquals } from '@/functs/search.ts'
import { toRaw } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import debounce from 'lodash/debounce'

export default {
  name: 'SearchResults',

  components: {
    PaginationButtons,
  },

  props: {
    search: {
      type: Object,
      default: () => {},
    },
    mode: {
      // global, projects, groups, people
      type: String,
      default: 'global',
    },
    freezeSearch: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['loading'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      pagination: {
        currentPage: this.search?.page || 1,
        total: 1,
        previous: undefined,
        next: undefined,
        first: undefined,
        last: undefined,
      },
      items: [],
      isLoading: true,
      lastRequest: 0,
      totalCount: 0,
    }
  },

  computed: {
    searchLimit() {
      return this.search?.limit || 12
    },

    organisation() {
      return this.organizationsStore.current
    },
  },

  watch: {
    search: {
      handler(neo, old) {
        if (this.freezeSearch) return
        // avoid call to api if search has not changed
        let proceed = false
        if (neo && old) {
          proceed = !searchEquals(toRaw(neo), toRaw(old))
        } else {
          // don't proceed if search is null
          proceed = !!neo
        }
        if (proceed) this.loadProjects()
      },
      immediate: true,
    },
  },

  methods: {
    onClickPagination(requestedPage) {
      this.loadProjects(requestedPage)
      this.$el.scrollIntoView({ behavior: 'smooth' })
    },

    initProjectLoading() {
      this.items = []
      this.isLoading = true
      this.$emit('loading', true)
    },

    loadProjects: debounce(async function (specificPageIndex = null) {
      if (!import.meta.client) return
      const filters = {
        ...this.search,
        organizations: [this.organizationsStore.current.code],
      }

      const query = filters.search ? encodeURIComponent(filters.search) : null
      delete filters.search

      // if we forced a page (on page load only)
      // manually compute offset
      const page = parseInt(filters.page || 1)
      if (page > 1) {
        filters['offset'] = (page - 1) * filters.limit
      }
      delete filters.page

      // memoize request order
      // to only update with response to the last one
      this.lastRequest++
      const localRequest = this.lastRequest

      this.initProjectLoading()
      // Get projects and update project list
      let response
      if (specificPageIndex) {
        response = await useAPI(specificPageIndex, {})
      } else if (this.mode === 'projects') {
        response = await searchProjects(query, filters)
      } else if (this.mode === 'groups') {
        response = await searchGroupsAlgolia(query, filters)
      } else if (this.mode === 'people') {
        response = await searchUser(query, filters)
      } else {
        // assume mode === 'global'
        response = await searchAll(query, {
          limit: 30,
          organizations: this.organisation.code,
        })
      }
      // update with the ltest request result
      // to fix concurrency issue when multiple request fired
      if (response && localRequest === this.lastRequest) this.updateProjectList(response)
    }, 500),

    updateProjectList(response) {
      this.updatePagination(response)
      const maxResults = response.max_results || this.searchLimit
      this.totalCount = response.count
      this.items.push(...response.results.slice(0, maxResults))
      this.isLoading = false
      this.$emit('loading', false)
    },

    updatePagination(response) {
      const maxResults = response.max_results || this.searchLimit
      this.pagination.total = response.total_page || Math.ceil(response.count / maxResults)
      this.pagination.previous = response.previous
      this.pagination.next = response.next
      this.pagination.first = response.first
      this.pagination.last = response.last
      this.pagination.currentPage = response.current_page
    },
  },
}
</script>

<style lang="scss" scoped>
.project-list-pagination {
  padding-top: $space-l;
  padding-bottom: $space-2xl;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
