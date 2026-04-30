<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="group-members-list">
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
    </div>
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
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import { getGroupMember } from '~/api/v2/group.service'

import GroupMemberDrawer from '~/components/group/Modules/Members/GroupMemberDrawer.vue'
import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'
import GroupMemberItem from '~/components/group/Modules/Members/GroupMemberItem.vue'

import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { memberSkeleton } from '~/skeletons/group.skeletons'

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
  margin-top: 1rem;
}

.group-members-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: calc(100% - 2rem);
  gap: 0.5rem;
  padding: 0 0.5rem;
  min-height: pxToRem(85px);
}
</style>

<style lang="scss">
.focus-leader {
  grid-column: span 2;
}

.focus-member .picture-user {
  width: 2.5rem !important;
  height: 2.5rem !important;
}
</style>
