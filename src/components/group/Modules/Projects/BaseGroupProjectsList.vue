<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'

import { getGroupProject } from '~/api/v2/group.service'

import ProjectPreview from '~/components/project/ProjectPreview.vue'

import ProjectSelectDrawer from '~/components/drawer/Project/ProjectSelectDrawer.vue'
import { postGroupProjects, removeGroupProject } from '~/api/groups.service'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { refreshGroupData } from '~/composables/groups/refreshGroup'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import type { TranslatedProject } from '~/models/project.model'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    limit?: number
    editable?: boolean
    preview?: boolean
  }>(),
  { limit: null, preview: false, editable: false }
)

const toaster = useToaster()
const { t } = useNuxtI18n()
const limitSkeletons = computed(() =>
  maxSkeleton(props.group?.modules?.featured_projects, props.limit)
)
const asyncing = ref(false)
const { stateModals, openModals, closeAllModals } = useModals({
  add: false,
  delete: false,
})
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)

const { status, data, refresh, pagination } = getGroupProject(organizationCode, groupId, {
  paginationConfig: { limit: props.limit },
  default: () => factoryPagination(projectSkeleton, limitSkeletons.value),
})

const selectedProject = ref<TranslatedProject | null>(null)

const clear = () => {
  closeAllModals()
  asyncing.value = false
  selectedProject.value = null
}

const fullRefresh = () => {
  refreshGroupData(props.group)
  refresh()
}

const onSubmit = (projects: TranslatedProject[]) => {
  asyncing.value = true

  const body = {
    featured_projects: projects.map((project) => project.id),
  }
  postGroupProjects(organizationCode, props.group.id, body)
    .then(() => {
      toaster.pushSuccess(t('toasts.group-project-create.success'))
      fullRefresh()
    })
    .catch(() => toaster.pushSuccess(t('toasts.group-project-create.error')))
    .finally(() => clear())
}

const onDelete = (project: TranslatedProject) => {
  selectedProject.value = project
  openModals('delete')
}
const onDeleteConfirm = () => {
  asyncing.value = true

  const body = {
    featured_projects: [selectedProject.value.id],
  }
  removeGroupProject(organizationCode, props.group.id, body)
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
      :pagination="pagination"
      :editable="editable"
      @add="openModals('add')"
    />
    <ul class="project-list list-divider">
      <li v-for="project in data" :key="project.id">
        <ProjectPreview :project="project">
          <template v-if="editable" #action>
            <ContextActionMenuInline can-delete @delete="onDelete(project)" />
          </template>
        </ProjectPreview>
      </li>
    </ul>
    <NothingHere v-if="data.length === 0" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <!-- drawer/modal -->
  <ProjectSelectDrawer
    :is-opened="stateModals.add"
    :asyncing="asyncing"
    @close="clear"
    @submit="onSubmit"
  />

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('group.form.confirm-remove-project')"
    :confirm-button-label="$t('common.delete')"
    :cancel-button-label="$t('common.cancel')"
    :asyncing="asyncing"
    @cancel="clear"
    @confirm="onDeleteConfirm"
  >
    <ProjectPreview :project="selectedProject" />
  </ConfirmModal>
</template>
