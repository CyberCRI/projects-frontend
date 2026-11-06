<template>
  <div v-if="group.structure" class="similar-researcher-preview">
    <h3 class="similar-title">{{ $t(GROUP_MODULE_TITLE.similarStructures) }}</h3>
    <div class="similar-list">
      <FetchLoader :status="status" only-error skeleton>
        <SimilarStructureCard
          v-for="(similar, index) in similarStructures"
          :key="index"
          :structure="similar"
        />
      </FetchLoader>
    </div>
    <BaseModuleButton
      v-if="preview"
      :to="'/'"
      btn-icon="ArrowRight"
      :label="$t('researcher.view.all')"
    />
    <PaginationButtonsV2 v-else :pagination="pagination" />
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { structureSkeleton } from '~/skeletons/crisalid.skeletons'
import { getStructureSimilars } from '~/api/v2/crisalid.service'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean; limit?: number }>(),
  { limit: 3, preview: false }
)

const structureId = computed(() => props.group.structure?.id)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.group.structure.modules.similars, props.limit)
)

const {
  status,
  // isLoading,
  data: similarStructures,
  pagination,
  // refresh,
} = getStructureSimilars(organizationCode, structureId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(structureSkeleton, limitSkeletons.value),
})
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-researcher-preview {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  justify-content: center;
}

.similar-title {
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  color: variables.$primary-dark;
}

.similar-list {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}
</style>
