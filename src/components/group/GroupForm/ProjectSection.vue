<template>
  <div class="team-section">
    <label>
      <span class="section-title">
        {{ t('group.form.project-label') }}
        <span v-if="modelValue.length">({{ modelValue.length }})</span>
      </span>
      <LpiButton
        class="add-project-card"
        :btn-icon="modelValue.length ? 'Pen' : 'Plus'"
        :label="t(modelValue.length ? 'group.form.edit' : 'group.form.add')"
        data-test="add-projects"
        @click="drawerIsOpen = true"
      />
    </label>

    <div v-if="modelValue.length" class="team-grid">
      <ProjectPreview
        v-for="project in showFullList ? modelValue : shortList"
        :key="project.id"
        :project="project"
      >
        <template #action>
          <LpiButton btn-icon="Close" @click="modalConfirmRemoveProject(project)" />
        </template>
      </ProjectPreview>
      <ConfirmModal
        v-if="stateModal"
        :title="$t('common.quit-project')"
        @cancel="closeModal"
        @confirm="onRemoveProject"
      >
        <ProjectPreview :project="removeProject" />
      </ConfirmModal>
    </div>
    <div class="show-more">
      <LinkButton
        v-if="shortList?.length < modelValue?.length"
        class="see-more-btn"
        :label="t(seeMoreLabel)"
        @click="showFullList = !showFullList"
      />
    </div>
    <empty-label v-if="(showFullList ? modelValue : shortList).length === 0" />

    <PickProjectsDrawer
      v-if="drawerIsOpen"
      :is-opened="drawerIsOpen"
      :pre-selected-projects="modelValue"
      :title="t('group.form.add-projects')"
      @close="drawerIsOpen = false"
      @picked-projects="onProjectsPicked"
    />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'

import ProjectPreview from '~/components/project/ProjectPreview.vue'

const model = defineModel<TranslatedProject[]>()

const drawerIsOpen = ref(false)
const showFullList = ref(false)

const { stateModal, closeModal, openModal } = useModal()

const { t } = useNuxtI18n()

const shortList = computed(() => {
  return model.value.slice(0, 8)
})
const seeMoreLabel = computed(() => {
  return showFullList.value ? 'common.see-less' : 'common.see-more'
})

const removeProject = ref()
const modalConfirmRemoveProject = (project) => {
  removeProject.value = project
  openModal()
}

const onProjectsPicked = (projects: TranslatedProject[]) => {
  model.value = [...projects]
  drawerIsOpen.value = false
  closeModal()
}

const onRemoveProject = () => {
  const projects = model.value.filter((p) => p.id !== removeProject.value.id)
  model.value = projects
  removeProject.value = null
  closeModal()
}
</script>

<style lang="scss" scoped>
.team-section {
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    font-size: $font-size-m;
    margin-bottom: $space-l;

    .section-title {
      color: $black;
      font-weight: bold;
      display: block;
    }
  }

  .team-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: stretch;
    gap: $space-l;
  }

  .disabled {
    color: $almost-white;

    svg {
      width: 18px;
      fill: $almost-white;
    }
  }

  .show-more {
    display: flex;
    justify-content: center;
    margin-top: $space-l;
  }
}
</style>
