<template>
  <Drawer
    v-if="mode"
    :confirm-action-name="$t('common.confirm')"
    :is-opened="isOpened"
    :title="drawerTitle"
    :class="filters[mode]?.drawerClass ?? 'medium'"
    @close="close"
    @confirm="confirm"
  >
    <template v-if="focusedFilter || mode !== allFiltersMode" #header_prefix>
      <span class="icon-back" @click="closeFocusedOrModeFilter">
        <IconImage name="ArrowLeft" />
      </span>
    </template>

    <template v-if="mode === allFiltersMode">
      <Component
        :is="filters[focusedFilter].componentEditor"
        v-if="focusedFilter"
        v-model="selection[focusedFilter]"
      />

      <div v-for="(filter, key) in filters" v-else :key="key" class="filter-wrapper">
        <FilterWrapper
          v-if="filter.condition"
          :filter-key="key"
          :has-filters="hasFilters(key)"
          :is-toggleable="filter.toggleable"
          @toggle-filter="toggleFilter"
        >
          <template #header>
            {{ $t(`search.${filter.title}`) }}
          </template>
          <component :is="filter.componentSummary" v-model="selection[key]" />
        </FilterWrapper>
      </div>
    </template>
    <template v-else>
      <Component :is="filters[mode].componentEditor" v-model="selection[mode]" />
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ALL_FILTERS_MODE } from '~/components/search/Filters/useContextualFilters'
import FilterWrapper from '~/components/search/Filters/FilterWrapper.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import Drawer from '~/components/base/BaseDrawer.vue'

const props = withDefaults(
  defineProps<{
    isOpened: boolean
    mode?: string
    filters: any
    preselection: any
  }>(),
  {
    mode: null,
  }
)

const emit = defineEmits<{
  confirm: [any]
  close: []
}>()
const { t } = useNuxtI18n()

const selection = ref(JSON.parse(JSON.stringify(props.preselection)))
const focusedFilter = ref(null)
const allFiltersMode = ref(ALL_FILTERS_MODE)

const drawerTitle = computed(() => {
  if (props.mode === allFiltersMode.value) {
    if (focusedFilter.value) {
      const title = props.filters[focusedFilter.value].title
      return t(`search.${title}`)
    }

    return t('search.all-filters')
  }

  const title = props.filters[props.mode].title
  return t(`search.${title}`)
})

watch(
  () => props.isOpened,
  () => {
    selection.value = JSON.parse(JSON.stringify(props.preselection))
    focusedFilter.value = null
  }
)

const confirm = () => emit('confirm', selection.value)
const close = () => emit('close')

const hasFilters = (key) => {
  return ['sdfs', 'languages'].includes(key) || selection.value[key]?.length > 0
}

const toggleFilter = (filterKey) => {
  focusedFilter.value = filterKey
}

const closeFocusedOrModeFilter = () => {
  if (focusedFilter.value) {
    focusedFilter.value = null
  } else {
    close()
  }
}
</script>

<style lang="scss" scoped>
.icon-back {
  cursor: pointer;
  margin-right: $space-m;

  svg {
    fill: $primary-dark;
    width: 24px;
  }
}

.filter-wrapper {
  border-bottom: $border-width-s solid $primary;

  &:last-child {
    border-bottom: none;
  }

  &:first-child .header {
    margin-top: 0;
  }
}
</style>
@/components/search/Filters/filter-constants
