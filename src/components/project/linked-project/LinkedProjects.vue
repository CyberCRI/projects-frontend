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
          <ContextActionButton action-icon="Close" @click="confirmDelete(aLinkedProject)" />
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

<script>
import ProjectCard from '@/components/project/ProjectCard.vue'
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'
import analytics from '@/analytics'
import { deleteLinkedProject } from '@/api/projects.service'
import useToasterStore from '@/stores/useToaster.ts'
export default {
  name: 'LinkedProjects',

  components: {
    ProjectCard,
    ContextActionButton,
    ConfirmModal,
    DynamicGrid,
  },

  inject: ['projectLayoutToggleAddModal'],

  props: {
    project: {
      type: Object,
      default: () => ({}),
    },
    linkedProjects: {
      type: Array,
      default: () => [],
    },

    isEditable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['reload-linked-projects'],
  setup() {
    const toaster = useToasterStore()
    const { canEditProject } = usePermissions()
    return {
      toaster,
      canEditProject,
    }
  },

  data() {
    return {
      confirmModalVisible: false,
      projectToBeDeleted: null,
      isDeleting: false,
    }
  },

  computed: {
    canEditAndDelete() {
      return this.isEditable && this.canEditProject
    },

    linkedProjectsReordered() {
      return this.linkedProjects.reduce((acc, curr) => {
        return curr.reason === 'other' || curr.reason === 'autre' || curr.reason === ''
          ? [...acc, curr]
          : [curr, ...acc]
      }, [])
    },
  },

  methods: {
    confirmDelete(linkedProject) {
      this.projectToBeDeleted = linkedProject
      this.confirmModalVisible = true
    },

    async doDeleteLinkedProject() {
      this.isDeleting = true
      try {
        await deleteLinkedProject({
          project_id: this.project.id,
          id: this.projectToBeDeleted.id,
        })

        this.$emit('reload-linked-projects')

        analytics.linkedProject.removeLinkedProject({
          project: {
            id: this.project.id,
          },
          linkedProject: this.projectToBeDeleted,
        })

        this.toaster.pushSuccess(this.$t('toasts.linked-project-delete.success'))
      } catch (error) {
        this.toaster.pushError(`${this.$t('toasts.linked-project-delete.error')} (${error})`)
        console.error(error)
      } finally {
        this.confirmModalVisible = false
        this.projectToBeDeleted = null
        this.isDeleting = false
      }
    },
  },
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
      top: -18px;
      right: -14px;
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
