<script setup lang="ts">
import { addProjectMembers, deleteProjectMembers } from '~/api/project-members.service'
import TeamDrawer from '~/components/people/ProjectTeamDrawer/TeamDrawer.vue'
import type { TranslatedPojectMember } from '~/models/project-member.model'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import ProjectTeamEditor from '~/components/project/ProjectTeamEditor.vue'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { TranslatedProject } from '@/models/project.model'
import type UserCard from '~/components/people/UserCard.vue'
import { getProjectMembers } from '@/api/v2/project.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import type { ProjectMemberRoleType } from '~/models/types'
import { userSkeleton } from '@/skeletons/user.skeletons'
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
  key,
} = getProjectMembers(organizationCode, projectId, {
  paginationConfig: {
    limit: props.preview ? props.limit : 999999,
  },
  default: () => factoryPagination(userSkeleton, limitSkeletons.value),
})

type Team = {
  title: string
  role: ProjectMemberRoleType
  members: TranslatedPojectMember[]
}

const ORDER_ROLES: ProjectMemberRoleType[] = [
  'owners',
  'members',
  'reviewers',
  'owner_groups',
  'reviewer_groups',
  'member_groups',
]
const teams = computed<Team[]>(() => {
  const sortedTeams = []

  const groupedUserByRole = groupBy(members.value, (item) => item.role)

  ORDER_ROLES.forEach((role) => {
    sortedTeams.push({
      role,
      title: role,
      members: groupedUserByRole[role] ?? [],
    })
  })

  return sortedTeams
})

const { stateModals, openModals, closeAllModals, closeModals } = useModals({
  edit: false,
  delete: false,
  view: false,
})

const selectedMember = ref<TranslatedPojectMember>()
const mode = ref<'roles' | 'select'>('select')
const cancel = () => {
  selectedMember.value = null
  closeAllModals()
}

const refreshProjectData = () => {
  refreshNuxtData([
    `${organizationCode}::project::${props.project.id}`,
    `${organizationCode}::project::${props.project.slug}`,
    key.value,
  ])
  cancel()
}

const onAdd = () => {
  selectedMember.value = null
  mode.value = 'select'
  openModals('edit')
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

const addUser = (members: TranslatedPojectMember[]) => {
  console.log(members)
  const body = {}
  members.forEach((member) => {
    body[member.role] ??= []
    body[member.role].push(member.id)
  })

  addProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-member-delete.success'))
      refreshProjectData()
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
      refreshProjectData()
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
  <!-- d<rawer / modal -->
  <TeamDrawer
    :is-opened="stateModals.edit"
    :project="project"
    :current-users="members"
    :edited-user="selectedMember"
    :mode="mode"
    @close="closeModals('edit')"
    @add-user="addUser"
  />

  <GroupMemberDrawer
    :is-opened="stateModals.view"
    :member-id="selectedMember?.id"
    @close="cancel"
  />

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
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  .project-member {
    width: 100%;
    max-width: 200px;
  }
}
</style>
