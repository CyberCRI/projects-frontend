<template>
  <div class="search-input-container">
    <SearchOptions
      v-bind="$props"
      @search-options-updated="$emit('search-options-updated', $event)"
      @filter-section-update="$emit('filter-section-update', $event)"
    />
  </div>
</template>
<script>
export default {
  name: 'SearchBlock',

  props: {
    showSectionFilter: {
      type: Boolean,
      default: false,
    },

    section: {
      type: [String, null],
      default: null, // ALL_SECTION_KEY,
    },

    filterBlackList: {
      // filters we dont want to show/edit but are still active (i.e. categories in category page)
      type: Array,
      default: () => [],
    },

    freezeSearch: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['search-options-updated', 'filter-section-update'],
}
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
