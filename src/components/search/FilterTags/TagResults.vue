<template>
  <div v-if="isLoading" class="loader-ctn">
    <LoaderSimple />
  </div>

  <div v-else class="search-mode-ctn">
    <TagSearchResults
      key="search-results"
      data-test="search-results"
      :tag-results="tagResults"
      :existing-tags="existingTags"
      @result-clicked="handleResultClicked"
    />
    <div
      v-if="showPreSearchList"
      :style="{ visibility: (!isLoading && pagination.total > 1 && 'visible') || 'hidden' }"
      class="pagination-container"
    >
      <PaginationButtons
        :current="pagination.currentPage"
        :pagination="pagination"
        :total="pagination.total"
        @update-pagination="onClickPagination"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from 'es-toolkit'

import { getOrgClassificationTags } from '@/api/tag-classification.service'

import TagSearchResults from './TagSearchResults.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

import useAPI from '@/composables/useAPI.ts'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'

export default {
  name: 'TagResults',

  components: {
    TagSearchResults,
    LoaderSimple,
    PaginationButtons,
  },

  props: {
    search: {
      // search query
      type: String,
      default: '',
    },
    classificationId: {
      // classification id to limit search to (if not searchAll)
      type: Number,
      default: null,
    },
    type: {
      // "skills" or "projects"
      type: String,
      default: '',
    },
    searchAll: {
      // search all org classification
      type: Boolean,
      default: false,
    },
    existingTags: {
      // array of tag ids
      type: Array,
      default: () => [],
    },
    showPreSearchList: {
      // shwow all tags (aka empty search) before search
      type: Boolean,
      default: false,
    },
  },

  emits: ['add-tag', 'results-count'],

  setup() {
    const organizationsStore = useOrganizationsStore()
    const { locale } = useNuxtI18n()
    return {
      locale,
      organizationsStore,
    }
  },

  data() {
    return {
      isLoading: true,
      request: null,
    }
  },

  computed: {
    pagination() {
      if (!this.request) return { total: 0, current: 1 }
      return {
        currentPage: this.request.current_page,
        total: this.request.total_page,
        previous: this.request.previous,
        next: this.request.next,
        first: this.request.first,
        last: this.request.last,
      }
    },
    tagResults() {
      return this.request?.results || []
    },
  },

  watch: {
    search(neo) {
      if (this.showPreSearchList || neo.length >= 3) this.launchSearch()
    },
    classificationId(neo) {
      if (neo && (this.showPreSearchList || this.search.length >= 3)) this.launchSearch()
    },
  },

  async mounted() {
    await this.launchSearch(this.search)
  },

  methods: {
    async handleResultClicked(result) {
      this.$emit('add-tag', result)
    },

    launchSearch: debounce(async function () {
      this.isLoading = true
      try {
        let classificationId = this.classificationId
        if (this.searchAll) {
          if (this.type == 'projects') classificationId = 'enabled-for-projects'
          if (this.type == 'skills') classificationId = 'enabled-for-skills'
        }

        const options = { search: this.search, language: this.locale }
        if (!this.search) options.ordering = 'title'

        this.request = await getOrgClassificationTags(
          this.organizationsStore.current.code,
          classificationId,
          options
        )
          //.then((r) => r.data) // TODO: classificationName: this.allClassifications[j].title,
          .catch(() => ({
            count: 0,
            results: [],
          }))
        this.$emit('results-count', this.request.count)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    }, 500),

    async onClickPagination(requestedPage) {
      this.isLoading = true
      const apiReq = await useAPI(requestedPage, {})
      this.request = apiReq
      this.isLoading = false
      // const el = document.querySelector('.group-user-selection .search-section')
      // if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
  },
}
</script>

<style lang="scss" scoped>
.search-mode-ctn {
  position: relative;
  width: 100%;
}

.loader-ctn {
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin: 1rem;
}
</style>
