<template>
  <BaseGroupPreview
    :title="$t('group.members')"
    :total="group.modules.members"
    :loading="loading"
    :see-more="{ name: 'groupMembers', params: { groupId: $route.params.groupId } }"
  >
    <template #skeleton>
      <MemberListSkeleton :min-gap="90" :desktop-columns-number="3" :limit="limitSkeletons" />
    </template>
    <template #content>
      <FetchLoader :status="status">
        <DynamicGrid :min-gap="90" class="members-container">
          <GroupMemberItem
            v-for="member in data"
            :key="member.id"
            :user="member"
            :is-manager="member.is_manager"
            class="cursor-pointer shadow-drop"
            @user-click="openProfile"
            @close="closeProfile"
          />
        </DynamicGrid>
      </FetchLoader>
    </template>
  </BaseGroupPreview>
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
</template>

<script setup lang="ts">
import { getGroupMember } from '@/api/v2/group.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue'
const LIMIT = 6

const props = defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()

const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => Math.min(props.group.modules?.members ?? LIMIT, LIMIT))

const {
  status,
  data,
  isLoading: isLoadingMember,
} = getGroupMember(organizationCode, props.group.id, {
  paginationConfig: {
    limit: LIMIT,
  },
})
const loading = computed(() => props.isLoading || isLoadingMember.value)

const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)
</script>
