<template>
  <div class="linked-projects-recap">
    <SectionHeader
      :title="$t('project.linked', linkedProjects.length)"
      :button-label="$filters.capitalize($t('project.show-n-projects', linkedProjects.length))"
      class="section-header"
      :has-button="linkedProjects.length > 6"
      @redirect-button-clicked="goToLinkedProjectsView"
    />

    <LinkedProjects :linked-projects="linkedProjects.slice(0, 6)" />
  </div>
</template>

<script>
import SectionHeader from '@/components/base/SectionHeader.vue'
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'
import useProjectsStore from '@/stores/useProjects.ts'
export default {
  name: 'LinkedProjectsRecap',

  components: {
    SectionHeader,
    LinkedProjects,
  },

  props: {
    linkedProjects: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const projectsStore = useProjectsStore()
    return {
      projectsStore,
    }
  },

  methods: {
    goToLinkedProjectsView() {
      this.$router.push({
        name: 'projectLinkedProjects',
        params: { slugOrId: this.projectsStore.currentProjectSlug },
        hash: '#tab',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.linked-projects-recap {
  .additionnal-projects {
    border: $border-width-l solid $primary-dark;
    border-radius: $border-radius-l;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: $space-l;
    font-weight: 700;
    font-size: pxToRem(18px);
    color: $primary-dark;
    cursor: pointer;
  }
}
</style>
