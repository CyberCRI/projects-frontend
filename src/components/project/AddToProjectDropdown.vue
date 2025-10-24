<template>
  <div class="add-to-project">
    <h3 class="add-to-project__label">
      {{ $t('project.add-to-project.title') }}
    </h3>

    <div v-for="(item, index) in menuItems" :key="index" class="btn-wrapper">
      <LpiButton
        v-if="item.condition"
        :data-test="item.dataTest"
        :label="capitalize($t(item.label))"
        :secondary="true"
        class="add-to-project__button borderless squarish unpad no-height not-centered"
        btn-icon="Plus"
        @click="item.onClick()"
      />
    </div>
  </div>
</template>

<script>
import { capitalize } from '@/functs/string'

import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
  name: 'AddToProjectDropdown',

  components: {
    LpiButton,
  },

  inject: ['projectLayoutToggleAddModal', 'projectLayoutGoToTab'],

  emits: ['close-dropdown'],

  setup() {
    const { canEditProject, canCreateComments } = usePermissions()
    return { canEditProject, canCreateComments, capitalize }
  },

  computed: {
    menuItems() {
      return [
        {
          label: 'project.add-to-project.blog-entry',
          dataTest: 'button-add-blog-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('blogEntry')
          },
          condition: this.canEditProject,
        },
        // TODO merge sdg and goal
        {
          label: 'project.add-to-project.goal',
          dataTest: 'button-add-goal-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('goal')
          },
          condition: this.canEditProject,
        },
        // TODO merge sdg and goal
        {
          label: 'project.add-to-project.sdg',
          dataTest: 'button-add-sdg-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('sdg')
          },
          condition: this.canEditProject,
        },
        {
          label: 'project.add-to-project.link-and-attached-document',
          dataTest: 'button-add-resource-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('resource')
          },
          condition: this.canEditProject,
        },
        {
          label: 'project.linked-project',
          dataTest: 'button-add-linked-project-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('linkedProject')
          },
          condition: this.canEditProject,
        },
        {
          label: 'project.add-to-project.team-member',
          dataTest: 'button-add-team-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('teamMember')
          },
          condition: this.canEditProject,
        },
        {
          label: 'project.add-to-project.announcement',
          dataTest: 'button-add-job-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('announcement')
          },
          condition: this.canEditProject,
        },

        {
          label: 'project.add-to-project.location',
          dataTest: 'button-add-location-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('location')
          },
          condition: this.canEditProject,
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.add-to-project {
  display: flex;
  flex-direction: column;
  padding: $space-m;
  box-shadow: 0 0 0 1px $primary;
  background: $white;
  border-radius: $border-radius-m;
  width: 100%;
  box-sizing: border-box;

  .btn-wrapper {
    display: flex;
    flex-direction: column;
  }

  .add-to-project__label {
    text-align: center;
    font-weight: 700;
    margin-bottom: $space-s;
  }

  .add-to-project__button {
    margin-bottom: $space-s;
    justify-content: flex-start;
  }

  .add-to-project__icon {
    padding-right: $space-s;
    fill: $primary-dark;
  }
}
</style>
