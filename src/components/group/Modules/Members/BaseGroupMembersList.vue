<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import { getGroupMember } from '~/api/v2/group.service'

import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'
import GroupMemberItem from '~/components/group/Modules/Members/GroupMemberItem.vue'

import CardInlineGroupMember from '~/components/Drawer/User/CardInlineGroupMember.vue'
import type { AddGroupMembers, TranslatedGroupMember } from '~/models/group.model'
import UserProfileDrawer from '~/components/Drawer/User/UserProfileDrawer.vue'
import UserSelectDrawer from '~/components/Drawer/User/UserSelectDrawer.vue'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import { postGroupMembers, removeGroupMember } from '~/api/groups.service'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { refreshGroupData } from '~/composables/groups/refreshGroup'
import RolesDrawer from '~/components/Drawer/Role/RolesDrawer.vue'
import type { TranslatedUserModel } from '~/models/user.model'
import { memberSkeleton } from '~/skeletons/group.skeletons'
import NothingHere from '~/components/base/NothingHere.vue'
import type { GroupMemberRoleType } from '~/models/types'
import { GROUP_MEMBERS_ROLES } from '~/functs/constants'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    withPagination?: boolean
    limit?: number
    editable?: boolean
    preview?: boolean

    focusLeader?: boolean
  }>(),
  { withPagination: true, limit: null, focusLeader: false, editable: false, preview: false }
)

const toaster = useToaster()
const asyncing = ref(false)
const { t } = useNuxtI18n()
const organizationCode = useOrganizationCode()
const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.members, props.limit))

const { stateModals, openModals, closeModals, closeAllModals } = useModals({
  add: false,
  view: false,
  role: false,
  delete: false,
})

const groupId = computed(() => props.group?.id)

const { status, data, pagination, isLoading, refresh } = getGroupMember(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(memberSkeleton, limitSkeletons.value),
})

const selectedMember = ref<TranslatedGroupMember | null>(null)
const membersSelectRoles = ref<TranslatedGroupMember[]>([])

const fullRefresh = () => {
  refreshGroupData(props.group)
  refresh()
}

const clear = () => {
  asyncing.value = false
  selectedMember.value = null
  membersSelectRoles.value = []
  closeAllModals()
}

const openProfile = (user) => {
  selectedMember.value = user
  openModals('view')
}
const onDelete = (user: TranslatedGroupMember) => {
  selectedMember.value = user
  openModals('delete')
}

const addMembers = (members: TranslatedUserModel[] | TranslatedGroupMember[]) => {
  membersSelectRoles.value = members as unknown as TranslatedGroupMember[]
  closeModals('add')
  openModals('role')
}
const onEdit = (user: TranslatedGroupMember) => addMembers([user])

const onAddMembers = (memberRoles: { [key: TranslatedGroupMember['id']]: GroupMemberRoleType }) => {
  asyncing.value = true

  const memberRolesItem = Object.entries(memberRoles).map(([userId, role]) => [
    parseInt(userId, 10),
    role,
  ]) as [TranslatedGroupMember['id'], GroupMemberRoleType][]

  const body: AddGroupMembers = {
    leaders: memberRolesItem.filter(([_, role]) => role === 'leaders').map(([userId]) => userId),
    managers: memberRolesItem.filter(([_, role]) => role === 'managers').map(([userId]) => userId),
    members: memberRolesItem.filter(([_, role]) => role === 'members').map(([userId]) => userId),
  }

  console.log(body)

  postGroupMembers(organizationCode, props.group.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-member-create.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushSuccess(t('toasts.team-member-create.error')))
    .finally(() => clear())
}

const onDeleteConfirm = () => {
  asyncing.value = true

  const body = {
    users: [selectedMember.value.id],
  }
  removeGroupMember(organizationCode, props.group.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.group-project-remove.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushSuccess(t('toasts.group-project-remove.error')))
    .finally(() => clear())
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('add')"
    />
    `
    <div class="group-members-list">
      <GroupMemberItem
        v-for="member in data"
        :key="member.id"
        :member="member"
        :class="{
          'focus-leader': focusLeader && member.role === 'leaders',
          'focus-member': focusLeader && !(member.role !== 'leaders'),
        }"
        :role-label="member.role === 'leaders' ? undefined : ''"
        @click="openProfile"
      >
        <template v-if="editable" #actions>
          <ContextActionMenuInline
            can-delete
            can-edit
            @delete="onDelete(member)"
            @edit="onEdit(member)"
          />
        </template>
      </GroupMemberItem>
    </div>
    <NothingHere v-if="data.length === 0" />
    <PaginationButtonsV2
      v-if="withPagination"
      hide-empty
      class="pagination-span"
      :pagination="pagination"
      :disable="isLoading"
    />
  </FetchLoader>

  <!-- drawer/modal -->
  <UserProfileDrawer :is-opened="stateModals.view" :user-id="selectedMember?.id" @close="clear" />

  <UserSelectDrawer :is-opened="stateModals.add" @close="closeAllModals()" @submit="addMembers" />

  <RolesDrawer
    :is-opened="stateModals.role"
    :items="membersSelectRoles"
    :roles="GROUP_MEMBERS_ROLES"
    @close="clear"
    @update="onAddMembers"
  >
    <template #default="{ item }">
      <CardInlineGroupMember :key="item.id" :member="item" />
    </template>
  </RolesDrawer>

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('group.form.confirm-remove-member')"
    :confirm-button-label="$t('common.delete')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @cancel="clear"
    @confirm="onDeleteConfirm"
  >
    <GroupMemberItem :member="selectedMember" />
  </ConfirmModal>
</template>

<style lang="scss" scoped>
.pagination-span {
  margin-top: 1rem;
}

.group-members-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: calc(100% - 2rem);
  gap: 0.5rem;
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
