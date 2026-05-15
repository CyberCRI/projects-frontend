<script setup lang="ts">
import { addProjectMembers, deleteProjectMembers } from '~/api/project-members.service'
import UserProfileDrawer from '~/components/people/Drawer/UserProfileDrawer.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import ProjectTeamEditor from '~/components/project/ProjectTeamEditor.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import RolesDrawer from '~/components/people/Drawer/RolesDrawer.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { TranslatedProject } from '@/models/project.model'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { getProjectGroups } from '@/api/v2/project.service'
import type { ProjectMemberRoleType } from '~/models/types'
import GroupCard from '~/components/group/GroupCard.vue'
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
const limitGroupsSkeletons = computed(() => maxSkeleton(props.project.modules.groups, props.limit))
const asyncing = ref(false)

const {
  status,
  data: groups,
  refresh,
} = getProjectGroups(organizationCode, projectId, {
  paginationConfig: {
    limit: props.preview ? props.limit : 999999,
  },
  default: () => factoryPagination(groupSkeleton, limitGroupsSkeletons.value),
})

type Team = {
  title: string
  role: ProjectMemberRoleType
  groups: TranslatedPeopleGroupModel[]
}

//  order is important for choices
const PROJECTS_GROUP_ROLES: ProjectMemberRoleType[] = [
  'owner_groups',
  'member_groups',
  'reviewer_groups',
]

const teams = computed<Team[]>(() => {
  const sortedTeams = []

  // groups by role
  // if we are in preview mode, return all groups in owners ( for only one line)
  const groupedUserByRole = groupBy(groups.value, (item) =>
    props.preview ? 'owner_groups' : item.role
  )
  PROJECTS_GROUP_ROLES.forEach((role) => {
    sortedTeams.push({
      role,
      title: roleI18n(role),
      groups: groupedUserByRole[role] ?? [],
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

const selectedGroup = ref<TranslatedPeopleGroupModel>()
const mode = ref<'roles' | 'select'>('select')
const cancel = () => {
  selectedGroup.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  cancel()
}

const onAdd = () => {
  selectedGroup.value = null
  mode.value = 'select'
  openModals('add')
}

const onDelete = (group) => {
  selectedGroup.value = group
  openModals('delete')
}

const onEdit = (group) => {
  selectedGroup.value = group
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
      toaster.pushSuccess(t('toasts.team-group-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-group-delete.error')))
}

const onDeleteConfirm = () => {
  const body = {
    users: [selectedGroup.value.id],
  }
  deleteProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-group-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-group-delete.error')))
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
        <div v-if="team.groups.length > 0" :key="team.title" class="team-card">
          <SectionHeader
            v-if="!preview"
            :title="team.title"
            :has-button="false"
            :quantity="team.groups.length"
          />
          <div class="team-groups">
            <ProjectTeamEditor
              v-for="group in team.groups"
              :key="group.id"
              :can-edit="editable"
              :can-delete="editable"
              @edit="onEdit(group)"
              @delete="onDelete(group)"
            >
              <GroupCard :group="group" />
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
    :current-users="groups"
    :mode="mode"
    @reload-team="fullRefresh"
    @close="closeModals('add')"
  />

  <RolesDrawer
    :is-opened="stateModals.edit"
    :members="selectedGroup ? [selectedGroup] : []"
    :roles="PROJECTS_GROUP_ROLES"
    @close="closeModals('edit')"
    @update="addUser"
  />

  <UserProfileDrawer :is-opened="stateModals.view" :user-id="selectedGroup?.id" @close="cancel" />

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

.team-groups {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  flex-wrap: wrap;

  .project-group {
    width: 100%;
    max-width: 200px;
  }
}
</style>
