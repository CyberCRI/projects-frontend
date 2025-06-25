<template>
  <div class="add-to-project" :class="{ 'add-to-project-v2': isV2 }">
    <h3 class="add-to-project__label">
      {{ $t('project.add-to-project.title') }}
    </h3>

    <div v-for="(item, index) in menuItems" :key="index" class="btn-wrapper">
      <LpiButton
        v-if="item.condition"
        :data-test="item.dataTest"
        :label="$filters.capitalize($t(item.label))"
        :secondary="true"
        class="add-to-project__button"
        :class="{
          borderless: isV2,
          squarish: isV2,
          unpad: isV2,
          'no-height': isV2,
          'not-centered': isV2,
        }"
        btn-icon="Plus"
        @click="item.onClick()"
      />
    </div>
  </div>
</template>

<script>
import LpiButton from '@/components/base/button/LpiButton.vue'

export default {
  name: 'AddToProjectDropdown',

  components: {
    LpiButton,
  },

  inject: ['projectLayoutToggleAddModal', 'projectLayoutGoToTab'],

  props: { isV2: { type: Boolean, default: false } },

  emits: ['close-dropdown'],

  setup() {
    const { canEditProject, canCreateComments } = usePermissions()
    return { canEditProject, canCreateComments }
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
        {
          label: 'project.add-to-project.goal',
          dataTest: 'button-add-goal-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutToggleAddModal('goal')
          },
          condition: this.canEditProject,
        },
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
          label: 'project.add-to-project.comment',
          dataTest: 'button-add-comment-to-project',
          onClick: () => {
            this.$emit('close-dropdown')
            this.projectLayoutGoToTab('comments')
          },
          condition: this.canCreateComments,
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
  width: max-content;
  padding: $space-m;
  box-shadow: 0 0 0 1px $primary;
  border-radius: $border-radius-l;
  border-top-right-radius: unset;
  background: $white;

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

.add-to-project.add-to-project-v2 {
  border-radius: $border-radius-m;
  width: 100%;
  box-sizing: border-box;
}
</style>
