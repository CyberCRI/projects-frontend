<template>
  <BaseGroupPreview
    :title="$t('group.members')"
    :number="groupData.modules.projects"
    :loading="loading"
    :see-more="{ name: 'groupMembers', params: { groupId: $route.params.groupId } }"
  >
    <template #skeleton>
      <MemberListSkeleton :min-gap="90" :desktop-columns-number="6" />
    </template>
    <template #content>
      <DynamicGrid :min-gap="90" class="members-container">
        <GroupMemberItem
          v-for="member in members.slice(0, totalDisplayed)"
          :key="member.id"
          :user="member"
          :is-manager="member.is_manager"
          class="cursor-pointer shadow-drop"
          @user-click="openProfileDrawer"
          @close="closeProfileDrawer"
        />
      </DynamicGrid>
      <BaseDrawer
        no-footer
        :is-opened="profileDrawer.isOpened"
        :title="$t('profile.drawer_title')"
        @close="closeProfileDrawer"
        @confirm="closeProfileDrawer"
      >
        <UserProfileV2
          v-if="profileDrawer.isOpened"
          ref="profile-user"
          :can-edit="false"
          :user-id="profileDrawer.user_id"
          is-preview
          @close="closeProfileDrawer"
        />
      </BaseDrawer>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue'

const props = defineProps<{
  groupData: any
}>()

const loading = ref(false)
const totalDisplayed = 6
const members = []

const profileDrawer = ref({
  isOpened: false,
  user_id: null,
})

const openProfileDrawer = async (user) => {
  this.profileDrawer.user_id = user.id
  this.profileDrawer.isOpened = true
}

const closeProfileDrawer = () => {
  this.isEditMode = false
  this.profileDrawer.isOpened = false
  this.profileDrawer.user_id = null
}
</script>
