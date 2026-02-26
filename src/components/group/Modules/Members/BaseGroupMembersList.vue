<template>
  <FetchLoader :status="status" only-error skeleton>
    <GroupMemberItem
      v-for="member in data"
      :key="member.id"
      :member="member"
      :class="{
        'focus-leader': focusLeader && member.is_leader,
        'focus-member': focusLeader && !member.is_leader,
      }"
      :role-label="member.is_leader ? undefined : ''"
      @click="openProfile"
    />
    <PaginationButtonsV2
      v-if="withPagination"
      hide-empty
      class="pagination-span"
      :pagination="pagination"
      :disable="isLoading"
    />
    <GroupMemberDrawer
      :is-opened="!!userIdDrawer"
      :member-id="userIdDrawer"
      @close="closeProfile"
    />
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupMember } from '@/api/v2/group.service'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'
import GroupMemberDrawer from '@/components/group/Modules/Members/GroupMemberDrawer.vue'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { maxSkeleton, factoryPagination } from '@/skeletons/base.skeletons'
import { memberSkeleton } from '@/skeletons/group.skeletons'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    withPagination?: boolean
    limit?: number
    focusLeader?: boolean
  }>(),
  { withPagination: true, limit: null, focusLeader: false }
)

const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.members, props.limit))

const groupId = computed(() => props.group?.id)

const { status, data, pagination, isLoading } = getGroupMember(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(memberSkeleton, limitSkeletons.value),
})

const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)
</script>

<style lang="scss" scoped>
.pagination-span {
  grid-column: span 2;
  margin: auto;
}
</style>

<style lang="scss">
.focus-leader {
  grid-column: span 2;
}

.focus-member * {
  height: unset !important;
  border: none !important;

  .picture-user {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }
}
</style>
