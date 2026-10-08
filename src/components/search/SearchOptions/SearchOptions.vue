<template>
  <div class="search-block">
    <div class="search-container">
      <div class="search-group">
        <SearchInput
          v-model="search"
          class="search-input"
          :full="true"
          :placeholder="$t('browse.placeholder')"
          :debounce="300"
          @delete-query="search = ''"
        />
      </div>
    </div>

    iciicic
    {{ query }}
    {{ selectedSection }}
    <SearchFilters
      ref="searchFilters"
      :selected-section="selectedSection"
      :search="search"
      :query="query"
      :show-section-filter="showSectionFilter"
      :filter-black-list="filterBlackList"
      @update:selected-filters="setFilters"
      @update:selected-section="setSections"
    />
  </div>
</template>

<script setup lang="ts">
import type { AllSearchSections } from '~/components/search/Filters/useSectionFilters'
import SearchFilters from '~/components/search/Filters/SearchFilters.vue'
import SearchInput from '~/components/base/form/SearchInput.vue'
import { useSearchV2 } from '~/composables/useSearch'

const props = withDefaults(
  defineProps<{
    showSectionFilter?: boolean
    section?: AllSearchSections
    // filters we dont want to show/edit but are still active (i.e. categories in category page)
    filterBlackList?: any[]
  }>(),
  {
    showSectionFilter: false,
    section: null,
    filterBlackList: () => [],
  }
)

const selectedSection = ref(props.section)

const { query, setQuerys, setQuery, search } = useSearchV2(
  props.section && props.section !== 'all' ? { types: [props.section] } : null
)

const searchFiltersRef = useTemplateRef('searchFilters')
// this method is used by CategoriesPage and GroupsPage via a ref
const clearSelectedFilters = () => {
  searchFiltersRef.value?.clearSelectedFilters()
}
defineExpose({ clearSelectedFilters })

const setFilters = (f) => {
  setQuerys({
    ...query.value,
    ...(f || {}),
    types: selectedSection.value !== 'all' ? [selectedSection.value] : null,
  })
}

const setSections = (section: AllSearchSections) => {
  selectedSection.value = section !== 'all' ? section : null
  setQuery('types', section !== 'all' ? [section] : null)
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.search-block {
  margin: 0;
  padding: variables.$space-m 0;
  width: 100%;
  flex-grow: 1;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-direction: unset;

  .search-group {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: variables.$min-tablet) {
      flex-direction: row;
      width: 100%;
      justify-content: center;
    }
  }
}

.search-input {
  margin-bottom: variables.$space-m;
  width: variables.pxtorem(600px); // drop is 250px so 350 + 250 = 600

  @media (max-width: variables.$min-tablet) {
    width: 100%;
  }

  @media (min-width: variables.$min-tablet) {
    margin-bottom: 0;
  }
}
</style>
