<script setup lang="ts">
import { nowDate } from '~/functs/date'
import { QueryFilterEvent } from '~/models/event.model'
import { useQuery } from '~/composables/useQuery'

const { t } = useNuxtI18n()

const model = defineModel<QueryFilterEvent>({
  default: {
    ordering: 'start_date',
  },
})

const SORTING_RESULTS = computed(() => ({
  start_date: t('event.calendar.future'),
  '-end_date': t('event.calendar.past'),
}))

const SORTING_DEFAULT = model.value?.ordering ?? 'start_date'
const { query, setQuerys } = useQuery<QueryFilterEvent>(model.value)

watch(
  model,
  () => {
    setQuerys(model.value)
  },
  { immediate: true }
)

watch(
  query,
  () => {
    model.value = query.value
  },
  { immediate: true }
)

const changeOrder = (ordering: QueryFilterEvent['ordering']) => {
  const now = nowDate()
  setQuerys({
    ordering,
    [ordering === SORTING_DEFAULT ? 'from_date' : 'to_date']: now.toISOString(),
  })
}
changeOrder(SORTING_DEFAULT)
</script>

<template>
  <div class="filter-list">
    <button
      class="pointer"
      @click="changeOrder(query.ordering === SORTING_DEFAULT ? '-end_date' : 'start_date')"
    >
      <BadgeItem
        :label="SORTING_RESULTS[query.ordering]"
        :icon-name="query.ordering === SORTING_DEFAULT ? 'SortDesc' : 'SortAsc'"
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.filter-list {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
</style>
