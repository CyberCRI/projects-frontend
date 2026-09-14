<script setup lang="ts">
import type {
  QueryFilterSearch,
  TagClassificationModel,
  TranslatedTag,
} from 'shared-projects-frontend/models'
import type { DrawerSearchProps } from '~/components/drawer/BaseDrawerSearch.vue'
import BaseDrawerSearch from '~/components/drawer/BaseDrawerSearch.vue'
import CardInlineTag from '~/components/drawer/Tag/CardInlineTag.vue'
import { getAllOrgClassifications } from '~/api/v2/skills.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import LpiSelect from '~/components/base/form/LpiSelect.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { tagSkeleton } from '~/skeletons/project.skeletons'
import { getSearchTag } from '~/api/v2/search.service'

const props = withDefaults(
  defineProps<{
    selectedTags?: TranslatedTag[]
    query?: QueryFilterSearch
    title?: string
    isOpened?: boolean
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

const { status: statusClassifications, data: allClassifications } = getAllOrgClassifications(
  organizationCode,
  {
    paginationConfig: {
      limit: 999,
    },
    default: () => factoryPagination(() => null, 0, 0),
  }
)

const classificationsOptions = computed(() => {
  const enabledForSkills = allClassifications.value.filter(
    (classification) => classification.is_enabled_for_skills
  )

  return enabledForSkills.map((tag) => ({
    label: tag.$t.title,
    value: tag.id,
  }))
})

const selectedClasification = ref<TagClassificationModel['id']>(null)

const {
  status: statusTags,
  data: tags,
  pagination,
  refresh,
} = getSearchTag(organizationCode, selectedClasification, {
  query: computed(() => ({
    ...props.query,
    organizations: [organizationCode],
    search: search.value,
  })),
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => factoryPagination(tagSkeleton, LIMIT, LIMIT),
})
</script>

<template>
  <FetchLoader :status="[statusClassifications, statusTags]" only-error skeleton>
    <BaseDrawerSearch
      v-bind="attrs"
      v-model:search="search"
      :is-opened="isOpened"
      :title="title || $t('profile.edit.skills.skills.drawer.title', attrs.maxSelected)"
      :pagination="pagination"
      :results="tags || []"
      :selected="selectedTags"
      class-container="full-card-container"
      @search="refresh"
      @close="emit('close')"
      @confirm="emit('submit', $event)"
    >
      <template #top>
        <div class="my4">
          <p class="notice">
            {{ $t('search.pick-skill-classification') }}
          </p>
          <LpiSelect v-model="selectedClasification" :options="classificationsOptions" />
        </div>
      </template>
      <template #select-item="{ item, onClick }">
        <CardInlineTag
          :key="item.id"
          class="full-card-tag"
          :tag="item"
          selected
          icon="Close"
          @click="onClick(item)"
        />
      </template>
      <template #search-item="{ item, onClick, selected }">
        <CardInlineTag
          :key="item.id"
          class="full-card-tag"
          :tag="item"
          :selected="selected"
          :icon="selected ? 'Check' : 'Plus'"
          @click="onClick(item)"
        />
      </template>
    </BaseDrawerSearch>
  </FetchLoader>
</template>

<style lang="scss">
.full-card-container {
  width: 45% !important;
}

.full-card-tag {
  width: 100% !important;
}
</style>
