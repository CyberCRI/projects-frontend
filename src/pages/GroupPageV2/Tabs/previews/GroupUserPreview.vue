<template>
  <BaseGroupPreview
    :title="$t('group.members')"
    :total="group.modules.members"
    :loading="isLoading"
    :see-more="{ name: 'groupMembers', params: { groupId: $route.params.groupId } }"
  >
    <template #skeleton>
      <MemberListSkeleton :min-gap="90" :desktop-columns-number="6" />
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
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { getGroupMember } from '@/api/groups.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { translateUsers } = useAutoTranslate()
const organizationCode = useOrganizationCode()
const key = computed(() => `group-${props.group.id}-member-preview`)
const { status, data, isLoading } = useAsyncPaginationAPI(
  key,
  ({ config }) => getGroupMember(organizationCode, props.group.id, config),
  {
    translate: translateUsers,
    paginationConfig: {
      limit: 6,
    },
  }
)

const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)
</script>
