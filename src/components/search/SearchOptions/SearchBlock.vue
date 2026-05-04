<template>
  <div class="search-input-container">
    <SearchOptions
      v-bind="$props"
      @search-options-updated="$emit('search-options-updated', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ALL_SECTIONS } from '~/components/search/Filters/useSectionFilters'

withDefaults(
  defineProps<{
    showSectionFilter?: boolean
    // ALL_SECTION_KEY,
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

defineEmits<{
  'search-options-updated': [ALL_SECTIONS]
}>()
</script>

<style lang="scss" scoped>
.search-input-container {
  display: flex;
  padding: $space-l;
  background: $primary-lighter;
  align-items: center;
  border-radius: $border-radius-17;
  flex-direction: column;
  margin: $space-xl 0;

  .search-input {
    margin-bottom: pxToRem(16px);
  }

  @media screen and (min-width: $min-tablet) {
    padding: pxToRem(32px) pxToRem(84px);
    border-radius: 17px;
    flex-direction: row;

    .search-input {
      margin-right: $space-l;
      margin-bottom: 0;
    }
  }
}

:deep(.search-block) {
  flex-grow: 1;
}

:deep(.search-input-ctn--full) {
  max-width: 52rem;
  width: 100%;
}
</style>
