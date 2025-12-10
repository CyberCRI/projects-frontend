<template>
  <BaseGroupPreview
    :title="$t('group.members')"
    :total="groupData.modules.projects"
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
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { PeopleGroupModel } from '@/models/invitation.model';
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/previews/BaseGroupPreview.vue';

const props = defineProps<{
  groupData: PeopleGroupModel,
}>()

const {status, data} =
const loading = ref(false)
const totalDisplayed = 6;
const members = []

const userIdDrawer = ref<number | null>()
const openProfile = (user) => userIdDrawer.value = user.id
const closeProfile = () => userIdDrawer.value = null
</script>
