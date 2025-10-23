<template>
  <div class="team-section">
    <label>
      <span class="section-title">
        {{ capitalize($t('group.form.project-label')) }}
        <span v-if="modelValue.length">({{ modelValue.length }})</span>
      </span>
      <LpiButton
        class="add-project-card"
        :btn-icon="modelValue.length ? 'Pen' : 'Plus'"
        :label="capitalize($t(modelValue.length ? 'group.form.edit' : 'group.form.add'))"
        data-test="add-projects"
        @click="drawerIsOpen = true"
      />
    </label>

    <div v-if="modelValue.length" class="team-grid">
      <ProjectCard
        v-for="project in showFullList ? modelValue : shortList"
        :key="project.id"
        :has-close-icon="true"
        :project="project"
        class="selected-card"
        @unselect="onRemoveProject(project)"
      />
    </div>
    <div class="show-more">
      <LinkButton
        v-if="shortList?.length < modelValue?.length"
        class="see-more-btn"
        :label="capitalize($t(seeMoreLabel))"
        @click="showFullList = !showFullList"
      />
    </div>

    <PickProjectsDrawer
      v-if="drawerIsOpen"
      :is-opened="drawerIsOpen"
      :pre-selected-projects="modelValue"
      :title="$t('group.form.add-projects')"
      @close="drawerIsOpen = false"
      @picked-projects="onProjectsPicked"
    />
  </div>
</template>

<script>
import { capitalize } from '@/functs/string'

export default {
  name: 'ProjectSection',

  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:model-value'],

  setup() {
    return { capitalize }
  },

  data() {
    return {
      drawerIsOpen: false,
      showFullList: false,
      isSeeMore: true,
    }
  },
  computed: {
    shortList() {
      return this.modelValue.slice(0, 8)
    },
    seeMoreLabel() {
      return this.showFullList ? 'common.see-less' : 'common.see-more'
    },
  },

  methods: {
    onProjectsPicked(projects) {
      this.$emit('update:model-value', [...projects])
      this.drawerIsOpen = false
    },

    onRemoveProject(project) {
      const projects = this.modelValue.filter((p) => p.id !== project.id)
      this.$emit('update:model-value', [...projects])
    },
  },
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
