<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="subgroup-list">
      <GroupSubTeamItem
        v-for="sub in groups"
        :key="sub.id"
        :group="sub"
        :with-pagination="withPagination"
      />
      <PaginationButtons2 v-if="withPagination" class="m-auto" :pagination="pagination" />
    </div>
  </FetchLoader>
</template>

<script setup lang="ts">
import { getSubGroup } from '@/api/v2/group.service'
import { DEFAULT_PAGINATION_LIMIT } from '@/composables/usePagination'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { toArray } from '@/skeletons/base.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import GroupSubTeamItem from '@/components/group/Modules/GroupSub/GroupSubTeamItem.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    withPagination?: boolean
  }>(),
  { limit: DEFAULT_PAGINATION_LIMIT, withPagination: true }
)

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)
const limitSkeletons = computed(() =>
  Math.min(props.group.modules?.subgroups ?? props.limit, props.limit)
)

const {
  status,
  data: groups,
  pagination,
} = getSubGroup(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => toArray(groupSkeleton, limitSkeletons.value),
})
</script>

<style lang="scss" scoped>
.subgroup-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
