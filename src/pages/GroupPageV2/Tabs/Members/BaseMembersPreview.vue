<template>
  <FetchLoader :status="status">
    <GroupMemberItem
      v-for="member in data"
      :key="member.id"
      :member="member"
      @click="openProfile"
    />
    <BaseDrawer
      no-footer
      :is-opened="!!userIdDrawer"
      :title="$t('profile.drawer_title')"
      GroupMemberItem
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
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
const LIMIT = 6

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()

const organizationCode = useOrganizationCode()

const { status, data } = getGroupMember(organizationCode, props.group.id, {
  paginationConfig: {
    limit: LIMIT,
  },
})

const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)
</script>
