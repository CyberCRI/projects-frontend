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
        @click="onRemoveProject(project)"
      >
        <template #action>
          <div class="close-icon">
            <IconImage name="Close" @click="onRemoveProject(project)" />
          </div>
        </template>
      </ProjectPreview>
    </div>
    <div class="show-more">
      <LinkButton
        v-if="shortList?.length < modelValue?.length"
        class="see-more-btn"
        :label="t(seeMoreLabel)"
        @click="showFullList = !showFullList"
      />
    </div>

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

<script setup>
import ProjectPreview from '@/components/project/ProjectPreview.vue'

defineOptions({ name: 'ProjectSection' })

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:model-value'])

const drawerIsOpen = ref(false)
const showFullList = ref(false)

const { t } = useNuxtI18n()

const shortList = computed(() => {
  return props.modelValue.slice(0, 8)
})
const seeMoreLabel = computed(() => {
  return showFullList.value ? 'common.see-less' : 'common.see-more'
})

const onProjectsPicked = (projects) => {
  emit('update:model-value', [...projects])
  drawerIsOpen.value = false
}

const onRemoveProject = (project) => {
  const projects = props.modelValue.filter((p) => p.id !== project.id)
  emit('update:model-value', [...projects])
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

.close-icon {
  width: 2rem;
  fill: var(--primary-dark);
  cursor: pointer;
}
</style>
