<script lang="ts" setup>
withDefaults(
  defineProps<{
    pagination?: Pagination
  }>(),
  {
    pagination: null,
  }
)

const search = defineModel<string>({ default: '' })

const deleteSearch = () => (search.value = '')

const emit = defineEmits<{
  search: []
}>()

const LIMIT_OPTIONS = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
]
</script>

<template>
  <div class="controls-wrapper">
    <div class="search-input-container">
      <SearchInput
        v-model="search"
        :full="true"
        :placeholder="$t('browse.placeholder')"
        class="search-input"
        @enter="emit('search')"
        @delete-query="deleteSearch"
      />
      <LpiButton :label="$t('browse.page-title')" :secondary="false" @click="emit('search')" />
    </div>

    <div v-if="pagination" class="num-results-label">
      <label>{{ $t('browse.result-per-page') }}</label>
      <LpiSelect
        :model-value="pagination.limit.value"
        class="small"
        :options="LIMIT_OPTIONS"
        @update:model-value="(l) => pagination.setLimit(l)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.controls-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin: 1rem 0;

  @media screen and (max-width: variables.$max-tablet) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

.search-input-container {
  display: flex;
  align-items: center;
  flex-basis: 40rem;
  gap: variables.$space-l;

  @media screen and (max-width: variables.$max-tablet) {
    flex-basis: 100%;
    flex-grow: 1;
  }
}
</style>
