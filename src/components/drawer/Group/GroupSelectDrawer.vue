<script setup lang="ts">
import type { DrawerSearchProps } from '~/components/drawer/BaseDrawerSearch.vue'
import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'
import CardInlineGroup from '~/components/drawer/Group/CardInlineGroup.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import { searchGroupSkeleton } from '~/skeletons/search.skeletons'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { getSearchGroup } from '~/api/v2/search.service'

const props = withDefaults(
  defineProps<{
    selectedGroups?: TranslatedPeopleGroupModel[]
    query?: QueryFilterSearch
    title?: string
    isOpened?: boolean
  }>(),
  {
    selectedGroups: () => [],
    query: () => ({}),
    title: null,
    isOpened: false,
  }
)
const emit = defineEmits<{
  close: []
  submit: [TranslatedPeopleGroupModel[]]
}>()

const attrs = useAttrs() as DrawerSearchProps<TranslatedPeopleGroupModel>

const search = ref('')
const LIMIT = 30

const organizationCode = useOrganizationCode()
const {
  status,
  data: searchGroups,
  pagination,
  refresh,
} = getSearchGroup(organizationCode, search, {
  query: {
    ...props.query,
    organizations: [organizationCode],
    modules: 'none',
  },
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(searchGroupSkeleton, LIMIT, LIMIT),
  immediate: false,
})

const results = computed(() => searchGroups.value.map((searchObj) => searchObj.people_group))
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-bind="attrs"
      v-model:search="search"
      :is-opened="isOpened"
      :title="title || $t('drawer.group.add', attrs.maxSelected)"
      :pagination="pagination"
      :results="results"
      :selected="selectedGroups"
      @search="refresh"
      @close="emit('close')"
      @confirm="emit('submit', $event)"
    >
      <template #select-item="{ item, onClick }">
        <CardInlineGroup
          :key="item.id"
          :group="item"
          minimal
          selected
          icon="Close"
          @click="onClick(item)"
        />
      </template>
      <template #search-item="{ item, onClick, selected }">
        <CardInlineGroup
          :key="item.id"
          :group="item"
          :selected="selected"
          :icon="selected ? 'Check' : 'Plus'"
          @click="onClick(item)"
        />
      </template>
    </BaseDrawerSearch>
  </FetchLoader>
</template>
