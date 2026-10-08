<template>
  <div>
    <slot
      :is-loading="isLoading"
      :limit="pagination.limit.value"
      :items="items"
      :total-count="pagination.count.value"
    />

    <PaginationButtonsV2 :pagination="pagination" />
  </div>
</template>

<script setup lang="ts">
import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'

import type { AllSearchSections } from '~/components/search/Filters/useSectionFilters'
import type { QueryFilterSearch } from 'shared-projects-frontend/models'
import { getSearchAll } from '~/api/v2/search.service'
import { deepToRaw } from '~/functs/utils'

const props = withDefaults(
  defineProps<{
    search?: string
    query?: QueryFilterSearch
    mode?: AllSearchSections
  }>(),
  {
    search: '',
    query: () => ({}),
    mode: 'all',
  }
)

const emit = defineEmits<{
  loading: [boolean]
}>()

const organizationCode = useOrganizationCode()
const search = computed<string>(() => props.search)

const query = computed(() => {
  const q: QueryFilterSearch = deepToRaw(props.query)
  // q.organizations = [organizationCode]

  if (props.mode !== 'all') {
    q.types = [props.mode]
  }

  return q
})

const {
  isLoading,
  data: items,
  pagination,
} = getSearchAll(organizationCode, search, {
  query,
  paginationConfig: computed(() => ({ limit: props.query.limit, offset: props.query.offset })),
})

watchEffect(() => emit('loading', isLoading.value))
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.project-list-pagination {
  padding-top: variables.$space-l;
  padding-bottom: variables.$space-2xl;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
