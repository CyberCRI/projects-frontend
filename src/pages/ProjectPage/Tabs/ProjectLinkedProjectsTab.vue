<template>
  <div class="project-linked-projects">
    <div v-if="canEditProject" class="add-linked-project">
      <LpiButton
        :label="$filters.capitalize($t('project.add-linked-project'))"
        class="add-linked-project-btn"
        @click="projectLayoutToggleAddModal('linkedProject')"
      />
    </div>
    <LinkedProjects
      is-editable
      :project="project"
      :linked-projects="linkedProjects"
      @reload-linked-projects="$emit('reload-linked-projects')"
    />
  </div>
</template>

<script>
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'
import permissions from '@/mixins/permissions.ts'
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
  name: 'ProjectLinkedProjectsTab',

  components: {
    LinkedProjects,
    LpiButton,
  },

  mixins: [permissions],

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
  },

  emits: ['reload-linked-projects'],

  setup() {
    useScrollToTab()
    return {}
  },
}
</script>

<style lang="scss" scoped>
.project-linked-projects {
  padding: $space-xl 0;
}

.add-linked-project {
  display: flex;
  justify-content: flex-end;
  padding: $space-l 0;
}
</style>
