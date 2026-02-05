<template>
  <FetchLoader :status="status" only-error skeleton>
    <GroupMemberItem
      v-for="member in data"
      :key="member.id"
      :member="member"
      :class="{
        'focus-leader': focusLeader && member.is_leader,
      }"
      @click="openProfile"
    />
    <PaginationButtonsV2
      v-if="withPagination"
      hide-empty
      class="pagination-span"
      :pagination="pagination"
      :disable="isLoading"
    />
    <BaseDrawer
      no-footer
      :is-opened="!!userIdDrawer"
      :title="$t('profile.drawer_title')"
      @close="closeProfile"
      @confirm="closeProfile"
    >
      <UserProfileV2
        v-if="!!userIdDrawer"
        ref="profile-user"
        :can-edit="false"
        :user-id="userIdDrawer"
        is-preview
        @close="closeProfile"
      />
    </BaseDrawer>
  </FetchLoader>
</template>

<script setup lang="ts">
import { getGroupMember } from '@/api/v2/group.service'
import PaginationButtonsV2 from '@/components/base/navigation/PaginationButtonsV2.vue'
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
</style>
