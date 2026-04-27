<template>
  <div class="project-linked-projects">
    <div v-if="canEditProject && isInEditingMode" class="add-linked-project">
      <LpiButton
        :label="$t('project.add-linked-project')"
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

<script setup lang="ts">
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { TranslatedLinkedProject, TranslatedProject } from '@/models/project.model'

const projectLayoutToggleAddModal = inject<(string) => void>('projectLayoutToggleAddModal')

withDefaults(
  defineProps<{
    project: TranslatedProject
    linkedProjects?: TranslatedLinkedProject[]
    isInEditingMode?: boolean
  }>(),
  {
    linkedProjects: () => [],
    isInEditingMode: false,
  }
)

defineEmits<{
  'reload-linked-projects': []
}>()

useScrollToTab()
const { canEditProject } = usePermissions()
</script>

<style lang="scss" scoped>
.add-linked-project {
  display: flex;
  justify-content: flex-end;
  padding: $space-l 0;
}
</style>
