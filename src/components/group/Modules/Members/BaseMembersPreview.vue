<template>
  <FetchLoader :status="status" only-error skeleton>
    <GroupMemberItem
      v-for="member in data"
      :key="member.id"
      :member="member"
      @click="openProfile"
    />
    <PaginationButtons2 v-if="withPagination" class="pagination" :pagination="pagination" />
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
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { toArray } from '@/skeletons/base.skeletons'
import { memberSkeleton } from '@/skeletons/group.skeletons'

const LIMIT = 6
const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    withPagination?: boolean
  }>(),
  { withPagination: true }
)

const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => Math.min(props.group.modules?.members ?? LIMIT, LIMIT))
const groupId = computed(() => props.group?.id)

const { status, data, pagination } = getGroupMember(organizationCode, groupId, {
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => toArray(memberSkeleton, limitSkeletons.value),
})

const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)
</script>

<style lang="scss" scoped>
.pagination {
  grid-column: span 2;
  margin: auto;
}
</style>
