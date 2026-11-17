<template>
  <div class="domain-list" :class="{ 'as-column': preview }">
    <FetchLoader :status="status" only-error skeleton>
      <TagsList
        :tags="domains"
        :to="{
          name: 'GroupSearch',
          query: {
            section: 'groups',
          },
        }"
        class="subsection"
      />
      <EmptyCard v-if="!preview && domains.length === 0" />
      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { getStructureDomains } from '~/api/v2/crisalid.service'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { tagSkeleton } from '~/skeletons/project.skeletons'
import TagsList from '~/components/tags/TagsList.vue'

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean; limit?: number }>(),
  {
    preview: false,
    limit: null,
  }
)

const organizationCode = useOrganizationCode()
const strucutreId = computed(() => props.group.structure.id)

const limitSkeleton = computed(() =>
  maxSkeleton(props.group.structure?.modules?.research_domains, 10)
)
const {
  data: domains,
  status,
  pagination,
} = getStructureDomains(organizationCode, strucutreId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(tagSkeleton, limitSkeleton.value),
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.domain-list {
  display: flex;
  flex-flow: column-wrap;
  gap: 1rem;
  align-items: flex-start;

  &.as-column {
    flex-flow: column nowrap;
  }
}
</style>
