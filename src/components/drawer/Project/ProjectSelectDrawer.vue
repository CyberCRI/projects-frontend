<script setup lang="ts">
import type { DrawerSearchProps } from '~/components/drawer/BaseDrawerSearch.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import { searchProjectSkeleton } from '~/skeletons/search.skeletons'
import type { TranslatedProject } from '~/models/project.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { getSearchProjects } from '~/api/v2/search.service'

const props = withDefaults(
  defineProps<{
    selectedProjects?: TranslatedProject[]
    query?: QueryFilterSearch
    title?: string
    isOpened?: boolean
  }>(),
  {
    selectedProjects: () => [],
    query: () => ({}),
    title: null,
    isOpened: false,
  }
)
const emit = defineEmits<{
  close: []
  submit: [TranslatedProject[]]
}>()

const attrs = useAttrs() as DrawerSearchProps<TranslatedProject>

const search = ref('')
const LIMIT = 30

const organizationCode = useOrganizationCode()
const {
  status,
  data: searchProjects,
  pagination,
  refresh,
} = getSearchProjects(organizationCode, search, {
  query: {
    ...props.query,
    organizations: [organizationCode],
    modules: 'none',
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(searchProjectSkeleton, LIMIT, LIMIT),
  immediate: false,
})

// reset and refresh when opened
watchEffect(() => {
  if (props.isOpened) {
    search.value = ''
    refresh()
  }
})

const results = computed(() => searchProjects.value.map((searchObj) => searchObj.project))
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-bind="attrs"
      v-model:search="search"
      :is-opened="isOpened"
      :title="title || $t('drawer.project.add', attrs.maxSelected)"
      :pagination="pagination"
      :results="results"
      :selected="selectedProjects"
      @close="emit('close')"
      @confirm="emit('submit', $event)"
    >
      <template #select-item="{ item, onClick }">
        <CardInlineProject
          :key="item.id"
          :project="item"
          minimal
          selected
          icon="Close"
          @click="onClick"
        />
      </template>
      <template #search-item="{ item, onClick, selected }">
        <CardInlineProject
          :key="item.id"
          :project="item"
          :selected="selected"
          :icon="selected ? 'Check' : 'Plus'"
          @click="onClick"
        />
      </template>
    </BaseDrawerSearch>
  </FetchLoader>
</template>
