<template>
  <div class="group-members">
    <FetchLoader :status="status" only-error>
      <div class="members">
        <div class="members-header">
          <h2 class="title">
            {{ $t('group.group-members') }}
            <span v-show="countElement">( {{ countElement }} )</span>
          </h2>
        </div>
        <MemberListSkeleton v-if="isLoading" :min-gap="90" :limit="limitSkeletons" />
        <DynamicGrid v-else :min-gap="90" class="members-container">
          <GroupMemberItem
            v-for="member in data"
            :key="member.id"
            :member="member"
            class="cursor-pointer shadow-drop"
            @user-click="openProfile"
          />
        </DynamicGrid>
      </div>
      <div v-if="!isLoading && total > 1" class="pagination-container">
        <PaginationButtons2 :pagination="pagination" />
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { getGroupMember } from '@/api/v2/group.service'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

defineOptions({ name: 'GroupMembersTab' })

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const LIMIT = 10
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => Math.min(props.group.modules?.members ?? LIMIT, LIMIT))

const { data, isLoading, pagination, status } = getGroupMember(organizationCode, props.group.id, {
  paginationConfig: {
    limit: LIMIT,
  },
})
const { total, count } = pagination

const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)

const countElement = computed<number>(
  () => (isLoading.value ? props.group.modules?.members : count.value) ?? count.value
)
</script>

<style lang="scss" scoped>
.group-members {
  .members {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-xl;

    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: $space-l;

      .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $primary-dark;
      }
    }

    &-container {
      width: 100%;
      justify-content: space-between;

      .cursor-pointer {
        cursor: pointer;
      }
    }
  }

  .pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
  }
}
</style>
