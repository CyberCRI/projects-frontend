<script setup lang="ts">
import { addProjectMembers, deleteProjectMembers } from '~/api/project-members.service'
import UserProfileDrawer from '~/components/people/Drawer/UserProfileDrawer.vue'
import type { TranslatedPojectMember } from '~/models/project-member.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import ProjectTeamEditor from '~/components/project/ProjectTeamEditor.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectMemberSkeleton } from '~/skeletons/project.skeletons'
import RolesDrawer from '~/components/people/Drawer/RolesDrawer.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { TranslatedProject } from '@/models/project.model'
import type UserCard from '~/components/people/UserCard.vue'
import { getProjectMembers } from '@/api/v2/project.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import type { ProjectMemberRoleType } from '~/models/types'
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
const limitSkeletons = computed(() => maxSkeleton(props.project.modules.members, props.limit))
const asyncing = ref(false)

const {
  status,
  data: members,
  refresh,
} = getProjectMembers(organizationCode, projectId, {
  paginationConfig: {
    limit: props.preview ? props.limit : 999999,
  },
  default: () => factoryPagination(projectMemberSkeleton, limitSkeletons.value),
})

type Team = {
  title: string
  role: ProjectMemberRoleType
  members: TranslatedPojectMember[]
}

//  order is important for choices
const PROJECTS_ROLES: ProjectMemberRoleType[] = ['owners', 'members', 'reviewers']
const ALL_PROJECTS_ROLES: ProjectMemberRoleType[] = [
  ...PROJECTS_ROLES,
  'owner_groups',
  'member_groups',
  'reviewer_groups',
]
const teams = computed<Team[]>(() => {
  const sortedTeams = []

  // groups by role
  // if we are in preview mode, return all members in owners ( for only one line)
  const groupedUserByRole = groupBy(members.value, (item) => (props.preview ? 'owners' : item.role))
  ALL_PROJECTS_ROLES.forEach((role) => {
    sortedTeams.push({
      role,
      title: roleI18n(role),
      members: groupedUserByRole[role] ?? [],
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
const mode = ref<'roles' | 'select'>('select')
const cancel = () => {
  selectedMember.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  cancel()
}

const onAdd = () => {
  selectedMember.value = null
  mode.value = 'select'
  openModals('add')
}

const openProfile = (member) => {
  selectedMember.value = member
  openModals('view')
}

const onDelete = (member) => {
  selectedMember.value = member
  openModals('delete')
}

const onEdit = (member) => {
  selectedMember.value = member
  mode.value = 'roles'
  openModals('edit')
}

const addUser = (memberRoles: { [key: number]: ProjectMemberRoleType }) => {
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
}

const onDeleteConfirm = () => {
  const body = {
    users: [selectedMember.value.id],
  }
  deleteProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-member-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-member-delete.error')))
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :add-label="$t('team.add')"
      @add="onAdd"
    />
    <div class="teams">
      <template v-for="team in teams">
        <div v-if="team.members.length > 0" :key="team.title" class="team-card">
          <SectionHeader
            v-if="!preview"
            :title="team.title"
            :has-button="false"
            :quantity="team.members.length"
          />
          <div class="team-members">
            <ProjectTeamEditor
              v-for="member in team.members"
              :key="member.id"
              :can-edit="editable"
              :can-delete="editable"
              @edit="onEdit(member)"
              @delete="onDelete(member)"
            >
              <ProjectMemberItem v-if="preview" :user="member" @user-click="openProfile(member)" />
              <UserCard v-else :user="member" @click="openProfile(member)" />
            </ProjectTeamEditor>
          </div>
        </div>
      </template>
    </div>
  </FetchLoader>
  <!-- drawer / modal -->
  <TeamDrawer
    :is-opened="stateModals.add"
    :project="project"
    :current-users="members"
    :mode="mode"
    @close="closeModals('add')"
  />

  <RolesDrawer
    :is-opened="stateModals.edit"
    :members="selectedMember ? [selectedMember] : []"
    :roles="PROJECTS_ROLES"
    @close="closeModals('edit')"
    @update="addUser"
  />

  <UserProfileDrawer :is-opened="stateModals.view" :user-id="selectedMember?.id" @close="cancel" />

  <ConfirmModal
    v-if="stateModals.delete"
    :content="$t('team.remove-user-confirm')"
    :title="$t('common.delete-user')"
    :confirm-button-label="$t('common.delete-user')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @cancel="cancel"
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
