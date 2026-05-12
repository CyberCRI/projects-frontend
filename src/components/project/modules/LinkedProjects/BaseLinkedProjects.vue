<script setup lang="ts">
import LinkedProjectDrawer from '~/components/project/modules/LinkedProjects/LinkedProjectDrawer.vue'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { projectLinkedSkeleton } from '@/skeletons/project.skeletons'
import ProjectPreview from '~/components/project/ProjectPreview.vue'
import type { TranslatedProject } from '@/models/project.model'
import { deleteLinkedProject } from '~/api/projects.service'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getLinkedProject } from '@/api/v2/project.service'

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
const { stateModals, openModals, closeModals } = useModals({
  edit: false,
  delete: false,
})

const onDelete = (linkedProject) => {
  selectedLinkedProject.value = linkedProject
  openModals('delete')
}

const cancel = () => {
  selectedLinkedProject.value = null
  closeModals('delete', 'edit')
}

const refreshData = () => {
  refreshProjectData(props.project)
  refresh()
}

const onDeleteConfirm = () => {
  deleteLinkedProject(props.project.id, selectedLinkedProject.value.id)
    .then(() => {
      toaster.pushSuccess($t('toasts.linked-project-delete.success'))
      refreshData()
    })
    .catch(() => toaster.pushSuccess($t('toasts.linked-project-delete.error')))
    .finally(() => cancel())
}
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :pagination="pagination"
      @add="openModals('edit')"
    />
    <ul class="project-list list-divider">
      <li v-for="linked in linkedProjects" :key="linked.id">
        <ProjectPreview :project="linked.project">
          <template v-if="editable" #action>
            <LpiButton
              btn-icon="TrashCanOutline"
              class="skeletons-background"
              @click="onDelete(linked)"
            />
          </template>
        </ProjectPreview>
      </li>
    </ul>
    <NothingHere v-if="linkedProjects.length === 0" />
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.linked-project-confirm-delete')"
    @cancel="cancel"
    @confirm="onDeleteConfirm"
  >
    <ProjectPreview :project="selectedLinkedProject.project" />
  </ConfirmModal>

  <LinkedProjectDrawer
    :project="project"
    :is-opened="stateModals.edit"
    :already-linked-projects="linkedProjects"
    @close="cancel"
    @reload="refreshNuxtData"
  />
</template>
