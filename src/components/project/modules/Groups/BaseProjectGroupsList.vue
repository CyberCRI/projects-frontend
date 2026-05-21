<script setup lang="ts">
import { addProjectMembers, deleteProjectMembers } from '~/api/project-members.service'
import GroupSelectDrawer from '~/components/drawer/Group/GroupSelectDrawer.vue'
import CardInlineGroup from '~/components/drawer/Group/CardInlineGroup.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import ProjectTeamEditor from '~/components/project/ProjectTeamEditor.vue'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import RolesDrawer from '~/components/drawer/Role/RolesDrawer.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'
import type { TranslatedProject } from '@/models/project.model'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { getProjectGroups } from '~/api/v2/project.service'
import type { ProjectGroupRoleType } from '~/models/types'
import { PROJECTS_GROUP_ROLES } from '~/functs/constants'
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
  role: ProjectGroupRoleType
  groups: TranslatedPeopleGroupModel[]
}

const teams = computed<Team[]>(() => {
  const sortedTeams = []

  // groups by role
  // if we are in preview mode, return all groups in owners ( for only one line)
  const groupedUserByRole = groupBy(groups.value, (item) =>
    props.preview ? 'owner_groups' : item.role
  )
  PROJECTS_GROUP_ROLES.forEach((role) => {
    // ignore empty roles
    if (!groupedUserByRole[role]?.length) {
      return
    }
    sortedTeams.push({
      role,
      title: roleI18n(role),
      groups: groupedUserByRole[role],
    })
  })

  return sortedTeams
})

const { stateModals, openModals, closeAllModals, closeModals } = useModals({
  edit: false,
  delete: false,
  add: false,
})

const selectedGroup = ref<TranslatedPeopleGroupModel>()
const selectedGroupsRoles = ref<TranslatedPeopleGroupModel[]>()

const clear = () => {
  asyncing.value = false
  selectedGroup.value = null
  closeAllModals()
}

const fullRefresh = () => {
  refreshProjectData(props.project)
  refresh()
  clear()
}

const onAdd = () => {
  selectedGroup.value = null
  openModals('add')
}

const onDelete = (group: TranslatedPeopleGroupModel) => {
  selectedGroup.value = group
  openModals('delete')
}

const onEdit = (group: TranslatedPeopleGroupModel) => {
  selectedGroupsRoles.value = [group]
  openModals('edit')
}

const onSelectedGroup = (groups: TranslatedPeopleGroupModel[]) => {
  selectedGroupsRoles.value = groups
  closeModals('add')
  openModals('edit')
}

const addGroup = (groupRoles: { [key: number]: ProjectGroupRoleType }) => {
  asyncing.value = true

  const body = {}
  Object.entries(groupRoles).forEach(([groupId, role]) => {
    body[role] ??= []
    body[role].push(groupId)
  })

  addProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-group-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-group-delete.error')))
    .finally(() => clear())
}

const onDeleteConfirm = () => {
  asyncing.value = true
  const body = {
    people_groups: [selectedGroup.value.id],
  }
  deleteProjectMembers(props.project.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.team-group-delete.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushError(t('toasts.team-group-delete.error')))
    .finally(() => clear())
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :add-label="$t('team.group.add')"
      @add="onAdd"
    />
    <div class="teams">
      <div v-for="team in teams" :key="team.title" class="team-card">
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
      <NothingHere v-if="teams.length === 0" />
    </div>
  </FetchLoader>

  <!-- drawer / modal -->
  <GroupSelectDrawer
    :is-opened="stateModals.add"
    @submit="onSelectedGroup"
    @close="closeModals('add')"
  />

  <RolesDrawer
    :is-opened="stateModals.edit"
    :items="selectedGroupsRoles"
    :roles="PROJECTS_GROUP_ROLES"
    default-role="member_groups"
    @close="closeModals('edit')"
    @update="addGroup"
  >
    <template #default="{ item }">
      <CardInlineGroup :key="item.id" :group="item" />
    </template>
  </RolesDrawer>

  <ConfirmModal
    v-if="stateModals.delete"
    :content="$t('team.remove-user-confirm')"
    :title="$t('common.delete-user')"
    :confirm-button-label="$t('common.delete-user')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @cancel="clear"
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
