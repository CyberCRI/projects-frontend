<script setup lang="ts">
import ProjectSelectDrawer from '~/components/drawer/Project/ProjectSelectDrawer.vue'
import { addLinkedProject, deleteLinkedProject } from '~/api/projects.service'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectLinkedSkeleton } from '@/skeletons/project.skeletons'
import ProjectPreview from '~/components/project/ProjectPreview.vue'
import type { TranslatedProject } from '@/models/project.model'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getLinkedProject } from '@/api/v2/project.service'
import CardEditor from '~/components/base/CardEditor.vue'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  {
    preview: false,
    limit: null,
    editable: false,
  }
)
const toaster = useToaster()
const asyncing = ref(false)
const { t } = useNuxtI18n()

const limitSkeletons = computed(() =>
  maxSkeleton(props.project.modules.linked_projects, props.limit)
)

const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const {
  status,
  data: linkedProjects,
  pagination,
  refresh,
} = getLinkedProject(organizationCode, projectId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectLinkedSkeleton, limitSkeletons.value),
})

const selectedLinkedProject = ref()
const { stateModals, openModals, closeAllModals } = useModals({
  add: false,
  delete: false,
})

const onDelete = (linkedProject) => {
  selectedLinkedProject.value = linkedProject
  openModals('delete')
}

const clear = () => {
  asyncing.value = false
  selectedLinkedProject.value = null
  closeAllModals()
}

const refreshData = () => refreshProjectData(props.project).then(() => refresh())

const onDeleteConfirm = () => {
  asyncing.value = true
  deleteLinkedProject(props.project.id, selectedLinkedProject.value.id)
    .then(() => {
      toaster.pushSuccess($t('toasts.linked-project-delete.success'))
      refreshData()
    })
    .catch(() => toaster.pushError($t('toasts.linked-project-delete.error')))
    .finally(() => clear())
}

const onSubmit = (linkedProjects: TranslatedProject[]) => {
  asyncing.value = true

  const body = linkedProjects.map((linkedProject) => ({
    project_id: linkedProject.id,
    target_id: props.project.id,
  }))

  addLinkedProject(props.project.id, body)
    .then((linkedProject) => {
      analytics.linkedProject.addLinkedProject({
        project: {
          id: props.project.id,
        },
        linkedProject,
      })
      toaster.pushSuccess(t('toasts.linked-project-create.success'))
      refreshData()
    })
    .catch(() => toaster.pushError(t('toasts.linked-project-create.error')))
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
    <div class="list-flow-container">
      <CardEditor
        v-for="linked in linkedProjects"
        :key="linked.id"
        :can-delete="editable"
        @delete="onDelete(linked)"
      >
        <ProjectCard :project="linked.project" />
      </CardEditor>
    </div>
    <NothingHere v-if="linkedProjects.length === 0" />
    <PaginationButtonsV2 v-if="!preview" class="m8" :pagination="pagination" />
  </FetchLoader>

  <!-- drawer/modal -->
  <ProjectSelectDrawer
    :is-opened="stateModals.add"
    :asyncing="asyncing"
    :query="{
      exclude_projects_in_project: project.id,
      exclude_projects: [project.id],
    }"
    @close="clear"
    @submit="onSubmit"
  />

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.linked-project-confirm-delete')"
    :asyncing="asyncing"
    @cancel="clear"
    @confirm="onDeleteConfirm"
  >
    <ProjectPreview :project="selectedLinkedProject.project" />
  </ConfirmModal>
</template>
