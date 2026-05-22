<script setup lang="ts">
import { addProjectMembers, deleteProjectMembers } from '~/api/project-members.service'
import UserProfileDrawer from '~/components/drawer/User/UserProfileDrawer.vue'
import UserSelectDrawer from '~/components/drawer/User/UserSelectDrawer.vue'
import type { TranslatedPojectMember } from '~/models/project-member.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import CardInlineUser from '~/components/drawer/User/CardInlineUser.vue'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectMemberSkeleton } from '~/skeletons/project.skeletons'
import RolesDrawer from '~/components/drawer/Role/RolesDrawer.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { TranslatedProject } from '@/models/project.model'
import type { TranslatedUserModel } from '~/models/user.model'
import type UserCard from '~/components/people/UserCard.vue'
import { getProjectMembers } from '@/api/v2/project.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { PROJECTS_MEMBERS_ROLES } from '~/functs/constants'
import type { ProjectMemberRoleType } from '~/models/types'
import CardEditor from '~/components/base/CardEditor.vue'
import { roleI18n } from '~/functs/rolesUtils'
import { groupBy } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    limit?: number
    preview?: boolean
    editable?: boolean
  }>(),
  {
    limit: null,
    preview: false,
    editable: false,
  }
)

const { t } = useNuxtI18n()
const toaster = useToaster()
const projectId = computed(() => props.project.id)
const organizationCode = useOrganizationCode()
const limitMembersSkeletons = computed(() =>
  maxSkeleton(props.project.modules.members, props.limit)
)
const asyncing = ref(false)

const {
  status,
  data: members,
  refresh,
} = getProjectMembers(organizationCode, projectId, {
  paginationConfig: {
    limit: props.preview ? props.limit : 999999,
  },
  default: () => factoryPagination(projectMemberSkeleton, limitMembersSkeletons.value),
})

type Team = {
  title: string
  role: ProjectMemberRoleType
  members: TranslatedPojectMember[]
}

const teams = computed<Team[]>(() => {
  const sortedTeams = []

  // groups by role
  // if we are in preview mode, return all members in owners ( for only one line)
  const groupedUserByRole = groupBy(members.value, (item) => (props.preview ? 'owners' : item.role))
  PROJECTS_MEMBERS_ROLES.forEach((role) => {
    if (!groupedUserByRole[role]?.length) {
      return
    }
    sortedTeams.push({
      role,
      title: roleI18n(role),
      members: groupedUserByRole[role],
    })
  })

  return sortedTeams
})

const { stateModals, openModals, closeAllModals, closeModals } = useModals({
  edit: false,
  delete: false,
  view: false,
  add: false,
})

const selectedMember = ref<TranslatedPojectMember>()
const selectedMemberRoles = ref<TranslatedPojectMember[] | TranslatedUserModel[]>()

const clear = () => {
  selectedMember.value = null
  asyncing.value = false
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  clear()
}

const onAdd = () => {
  selectedMember.value = null
  openModals('add')
}

const openProfile = (member: TranslatedPojectMember) => {
  selectedMember.value = member
  openModals('view')
}

const onDelete = (member: TranslatedPojectMember) => {
  selectedMember.value = member
  openModals('delete')
}

const onEdit = (member: TranslatedUserModel) => {
  selectedMemberRoles.value = [member]
  openModals('edit')
}

const onSelectedUser = (members: TranslatedUserModel[]) => {
  selectedMemberRoles.value = members
  closeModals('add')
  openModals('edit')
}

const addUser = (memberRoles: { [key: TranslatedUserModel['id']]: ProjectMemberRoleType }) => {
  asyncing.value = true
  const body = {}
  Object.entries(memberRoles).forEach(([memberId, role]) => {
    body[role] ??= []
    body[role].push(memberId)
  })

  addProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-member-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-member-delete.error')))
    .then(() => clear())
}

const onDeleteConfirm = () => {
  asyncing.value = true
  const body = {
    users: [selectedMember.value.id],
  }
  deleteProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-member-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-member-delete.error')))
    .then(() => clear())
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :add-label="$t('team.member.add')"
      @add="onAdd"
    />
    <div class="teams">
      <div v-for="team in teams" :key="team.title" class="team-card">
        <SectionHeader
          v-if="!preview"
          :title="team.title"
          :has-button="false"
          :quantity="team.members.length"
        />
        <div class="team-members">
          <CardEditor
            v-for="member in team.members"
            :key="member.id"
            :can-edit="editable"
            :can-delete="editable"
            @edit="onEdit(member)"
            @delete="onDelete(member)"
          >
            <UserCard :user="member" @click="openProfile(member)" />
          </CardEditor>
        </div>
      </div>
      <NothingHere v-if="teams.length === 0" />
    </div>
  </FetchLoader>

  <!-- drawer / modal -->
  <UserSelectDrawer
    :is-opened="stateModals.add"
    :query="{
      exclude_users_in_project: project.id,
    }"
    @submit="onSelectedUser"
    @close="closeModals('add')"
  />

  <RolesDrawer
    :is-opened="stateModals.edit"
    :items="selectedMemberRoles"
    :roles="PROJECTS_MEMBERS_ROLES"
    :asyncing="asyncing"
    default-role="members"
    @close="closeModals('edit')"
    @update="addUser"
  >
    <template #default="{ item }">
      <CardInlineUser :key="item.id" :user="item" />
    </template>
  </RolesDrawer>

  <UserProfileDrawer :is-opened="stateModals.view" :user-id="selectedMember?.id" @close="clear" />

  <ConfirmModal
    v-if="stateModals.delete"
    :content="$t('team.remove-user-confirm')"
    :title="$t('common.delete-user')"
    :confirm-button-label="$t('common.delete-user')"
    :clear-button-label="$t('common.clear')"
    :asyncing="asyncing"
    @clear="clear"
    @confirm="onDeleteConfirm"
  />
</template>

<style lang="scss" scoped>
.teams {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-card {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1rem;
}

.team-members {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  flex-wrap: wrap;

  .project-member {
    width: 100%;
    max-width: 200px;
  }
}
</style>
