<template>
  <div class="group-members">
    <div class="members">
      <div class="members-header">
        <h2 class="title">
          {{ $t('group.group-members') }}
          <span v-if="!isLoading">( {{ count }} )</span>
        </h2>
      </div>
      <MemberListSkeleton v-if="isLoading" :min-gap="90" :limit="limitSkeletons" />
      <DynamicGrid v-else :min-gap="90" class="members-container">
        <GroupMemberItem
          v-for="member in data"
          :key="member.id"
          :user="member"
          class="cursor-pointer shadow-drop"
          @user-click="openProfile"
        />
      </DynamicGrid>
    </div>
    <div v-if="!isLoading && total > 1" class="pagination-container">
      <PaginationButtons2 :pagination="pagination" />
    </div>
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
</template>

<script setup lang="ts">
import { getGroupMember } from '@/api/groups.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

defineOptions({ name: 'GroupMembersTab' })

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const limitSkeletons = computed(() => Math.min(props.group.modules?.members ?? 10, 10))

const { translateUsers } = useAutoTranslate()
const organizationCode = useOrganizationCode()
const key = computed(() => `group-${props.group.id}-members-tabs`)
const { data, isLoading, pagination } = useAsyncPaginationAPI(
  key,
  ({ config }) => getGroupMember(organizationCode, props.group.id, config),
  { translate: translateUsers }
)
const { total, count } = pagination
const userIdDrawer = ref<number | null>()
const openProfile = (user) => (userIdDrawer.value = user.id)
const closeProfile = () => (userIdDrawer.value = null)
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
