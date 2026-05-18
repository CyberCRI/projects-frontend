<template>
  <div class="search-block">
    <div class="search-container">
      <div class="search-group">
        <SearchInput
          class="search-input"
          :model-value="managedSearch.search"
          :full="true"
          :placeholder="$t('browse.placeholder')"
          @update:model-value="updateSelectedQuery"
          @delete-query="deleteQuery"
        />
      </div>
    </div>

    <SearchFilters
      ref="searchFilters"
      :selected-section="section || managedSearch.section"
      :search="managedSearch"
      :show-section-filter="showSectionFilter"
      :filter-black-list="filterBlackList"
      @update:selected-filters="updatdeSelectedFilters"
      @update:selected-section="updatdeSelectedSection"
    />
  </div>
</template>

<script setup lang="ts">
import SearchFilters from '~/components/search/Filters/SearchFilters.vue'
import SearchInput from '~/components/base/form/SearchInput.vue'

import type { ALL_SECTIONS } from '~/components/search/Filters/useSectionFilters'
import useSearch from '~/composables/useSearch'

const props = withDefaults(
  defineProps<{
    showSectionFilter?: boolean
    section?: ALL_SECTIONS
    // filters we dont want to show/edit but are still active (i.e. categories in category page)
    filterBlackList?: any[]
    freezeSearch?: boolean
  }>(),
  {
    showSectionFilter: false,
    section: null,
    filterBlackList: () => [],
    freezeSearch: false,
  }
)

const emit = defineEmits<{
  'filter-section-update': [ALL_SECTIONS]
}>()

const { searchFromQuery, updateSelectedQuery, updatdeSelectedFilters, updatdeSelectedSection } =
  useSearch(props.section)

const managedSearch = ref<{
  search?: string
  section?: string
}>({})

watch(
  searchFromQuery,
  (neo) => {
    if (!props.freezeSearch) {
      managedSearch.value = neo
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  () => props.section,
  (newValue) => {
    emit('filter-section-update', newValue)
  }
)

const deleteQuery = () => updateSelectedQuery('')

const searchFiltersRef = useTemplateRef('searchFilters')
// this method is used by CategoriesPage and GroupsPage via a ref
const clearSelectedFilters = () => {
  searchFiltersRef.value?.clearSelectedFilters()
}
defineExpose({ clearSelectedFilters })
</script>

<style lang="scss" scoped>
.search-block {
  margin: 0;
  padding: $space-m 0;
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

    @media (min-width: $min-tablet) {
      flex-direction: row;
      width: 100%;
      justify-content: center;
    }
  }
}

.search-input {
  margin-bottom: $space-m;
  width: pxToRem(600px); // drop is 250px so 350 + 250 = 600

  @media (max-width: $min-tablet) {
    width: 100%;
  }

  @media (min-width: $min-tablet) {
    margin-bottom: 0;
  }
}
</style>
