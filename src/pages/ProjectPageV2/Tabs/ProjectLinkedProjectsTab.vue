<template>
  <div class="project-linked-projects">
    <div v-if="canEditProject && isInEditingMode" class="add-linked-project">
      <LpiButton
        :label="capitalize($t('project.add-linked-project'))"
        class="add-linked-project-btn"
        @click="projectLayoutToggleAddModal('linkedProject')"
      />
    </div>
    <LinkedProjects
      :is-editable="isInEditingMode"
      :project="project"
      :linked-projects="linkedProjects"
      @reload-linked-projects="$emit('reload-linked-projects')"
    />
  </div>
</template>

<script>
import { capitalize } from '@/functs/string'
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
  name: 'ProjectLinkedProjectsTab',

  components: {
    LinkedProjects,
    LpiButton,
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

    isInEditingMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['reload-linked-projects'],

  setup() {
    useScrollToTab()
    const { canEditProject } = usePermissions()
    return { canEditProject, capitalize }
  },
}
</script>

<style lang="scss" scoped>
.add-linked-project {
  display: flex;
  justify-content: flex-end;
  padding: $space-l 0;
}
</style>
