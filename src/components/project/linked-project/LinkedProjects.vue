<template>
  <div class="linked-projects">
    <DynamicGrid v-if="linkedProjectsReordered?.length" :min-gap="20" class="linked-projects-ctn">
      <div
        v-for="aLinkedProject in linkedProjectsReordered"
        :key="aLinkedProject.id"
        class="linked-project-card"
      >
        <ProjectCard :project="aLinkedProject.project" />

        <div v-if="canEditAndDelete" class="actions-ctn">
          <ContextActionButton
            class="small"
            action-icon="Close"
            @click="confirmDelete(aLinkedProject)"
          />
        </div>
      </div>
    </DynamicGrid>

    <ConfirmModal
      v-if="confirmModalVisible"
      :content="$t('project.linked-project-confirm-delete')"
      :title="$t('common.delete')"
      :asyncing="isDeleting"
      @cancel="confirmModalVisible = false"
      @confirm="doDeleteLinkedProject"
    />
  </div>
</template>

<script setup lang="ts">
import ProjectCard from '@/components/project/ProjectCard.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'
import analytics from '@/analytics'
import { deleteLinkedProject } from '@/api/projects.service'
import useToasterStore from '@/stores/useToaster'
import { TranslatedLinkedProject, TranslatedProject } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    linkedProjects: TranslatedLinkedProject[]
    editable?: boolean
  }>(),
  {
    editable: false,
  }
)

const emit = defineEmits<{
  'reload-linked-projects': []
}>()

const { t } = useNuxtI18n()

const toaster = useToasterStore()
const { canEditProject } = usePermissions()

const confirmModalVisible = ref(false)
const projectToBeDeleted = ref(null)
const isDeleting = ref(false)

const canEditAndDelete = computed(() => {
  return props.editable && canEditProject.value
})

const linkedProjectsReordered = computed(() => {
  return props.linkedProjects
  // return props.linkedProjects.reduce((acc, curr) => {
  //   return curr.reason === 'other' || curr.reason === 'autre' || curr.reason === ''
  //     ? [...acc, curr]
  //     : [curr, ...acc]
  // }, [])
})

const confirmDelete = (linkedProject) => {
  projectToBeDeleted.value = linkedProject
  confirmModalVisible.value = true
}

const doDeleteLinkedProject = async () => {
  isDeleting.value = true
  try {
    await deleteLinkedProject({
      project_id: props.project.id,
      id: projectToBeDeleted.value.id,
    })

    emit('reload-linked-projects')

    analytics.linkedProject.removeLinkedProject({
      project: {
        id: props.project.id,
      },
      linkedProject: projectToBeDeleted.value,
    })

    toaster.pushSuccess(t('toasts.linked-project-delete.success'))
  } catch (error) {
    toaster.pushError(`${t('toasts.linked-project-delete.error')} (${error})`)
    console.error(error)
  } finally {
    confirmModalVisible.value = false
    projectToBeDeleted.value = null
    isDeleting.value = false
  }
}
</script>

<style lang="scss" scoped>
.linked-projects {
  margin-top: $space-l;

  .linked-projects-ctn {
    position: relative;
    width: 100%;
    justify-content: space-between;

    //.linked-project-ctn {
    //    flex-basis: calc(50% - #{$space-l});
    //}

    .linked-project-card {
      position: relative;
      width: min-content;
    }

    .actions-ctn {
      position: absolute;
      top: 0;
      right: 0;
      transform: translateY(-50%);
      display: flex;

      button:last-of-type {
        margin-left: $space-xs;
      }
    }

    .reason-label {
      color: $primary-dark;
      text-transform: uppercase;
      font-size: $font-size-xs;
      font-weight: 700;
      margin-bottom: $space-s;
      text-align: center;
    }
  }
}
</style>
