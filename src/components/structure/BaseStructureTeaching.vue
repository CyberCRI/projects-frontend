<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader :editable="false" :pagination="pagination" />

    <div class="teaching-list">
      <Teaching
        v-for="teaching in teachings"
        :key="teaching.id"
        :teaching="teaching"
        :researcher="teaching.researcher"
      />
      <NothingHere v-if="!preview && teachings.length === 0" />
      <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>

<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import Teaching from '~/components/crisalid/modules/Teaching.vue'
import { teachingSkeleton } from '~/skeletons/crisalid.skeletons'
import { getStructureTeachings } from '~/api/v2/crisalid.service'
import NothingHere from '~/components/base/NothingHere.vue'
const props = withDefaults(
  defineProps<{ group: TranslatedPeopleGroupModel; preview?: boolean; limit?: number }>(),
  { limit: null, preview: false }
)

const structureId = computed(() => props.group.structure?.id || 0)
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() =>
  maxSkeleton(props.group.structure?.modules?.teachings || 0, props.limit)
)

const {
  status,
  data: teachings,
  pagination,
} = getStructureTeachings(organizationCode, structureId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(teachingSkeleton, limitSkeletons.value),
})
</script>
