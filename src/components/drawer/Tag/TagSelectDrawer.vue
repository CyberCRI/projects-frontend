<script setup lang="ts">
import type { DrawerSearchProps } from '~/components/drawer/BaseDrawerSearch.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import CardInlineTag from '~/components/drawer/Tag/CardInlineTag.vue'
import { factoryPagination } from '~/skeletons/base.skeletons'
import type { QueryFilterSearch } from '~/models/search.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { tagSkeleton } from '~/skeletons/project.skeletons'
import type { TranslatedTag } from '~/models/tag.model'
import { getSearchTag } from '~/api/v2/search.service'

const props = withDefaults(
  defineProps<{
    selectedTags?: TranslatedTag[]
    query?: QueryFilterSearch
    title?: string
    isOpened?: boolean
    classificationType: 'enabled-for-projects' | 'enabled-for-skills'
  }>(),
  {
    selectedTags: () => [],
    query: () => ({}),
    title: null,
    isOpened: false,
  }
)
const emit = defineEmits<{
  close: []
  submit: [TranslatedTag[]]
}>()

const attrs = useAttrs() as DrawerSearchProps<TranslatedTag>

const search = ref('')
const LIMIT = 30

const organizationCode = useOrganizationCode()
const {
  status,
  data: tags,
  pagination,
  refresh,
} = getSearchTag(
  organizationCode,
  computed(() => props.classificationType),
  {
    query: computed(() => ({
      ...props.query,
      organizations: [organizationCode],
      search: search.value,
    })),
    paginationConfig: {
      limit: LIMIT,
    },
    default: () => factoryPagination(tagSkeleton, LIMIT, LIMIT),
    immediate: false,
  }
)

// reset and refresh when opened
watch(
  () => props.isOpened,
  () => {
    if (props.isOpened) {
      search.value = ''
      refresh()
    }
  },
  { immediate: true }
)
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseDrawerSearch
      v-bind="attrs"
      v-model:search="search"
      :is-opened="isOpened"
      :title="title || $t('project.form.add-tags', attrs.maxSelected)"
      :pagination="pagination"
      :results="tags"
      :selected="selectedTags"
      @close="emit('close')"
      @confirm="emit('submit', $event)"
    >
      <template #select-item="{ item, onClick }">
        <CardInlineTag :key="item.id" :tag="item" selected icon="Close" @click="onClick(item)" />
      </template>
      <template #search-item="{ item, onClick, selected }">
        <CardInlineTag
          :key="item.id"
          :tag="item"
          :selected="selected"
          :icon="selected ? 'Check' : 'Plus'"
          @click="onClick(item)"
        />
      </template>
    </BaseDrawerSearch>
  </FetchLoader>
</template>
