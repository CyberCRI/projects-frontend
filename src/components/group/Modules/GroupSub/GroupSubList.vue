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
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { maxSkeleton, toPagination } from '@/skeletons/base.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import GroupSubTeamItem from '@/components/group/Modules/GroupSub/GroupSubTeamItem.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    withPagination?: boolean
  }>(),
  { limit: null, withPagination: true }
)

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.subgroups, props.limit))

const {
  status,
  data: groups,
  pagination,
} = getSubGroup(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => toPagination(groupSkeleton, limitSkeletons.value),
})
</script>

<style lang="scss" scoped>
.subgroup-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
