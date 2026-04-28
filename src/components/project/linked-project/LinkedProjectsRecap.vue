<template>
  <div class="linked-projects-recap">
    <SectionHeader
      :title="$t('project.linked', linkedProjects.length)"
      :button-label="$t('project.show-n-projects', linkedProjects.length)"
      class="section-header"
      :has-button="linkedProjects.length > LIMIT"
      @redirect-button-clicked="goToLinkedProjectsView"
    />

    <LinkedProjects :linked-projects="linkedProjectsSliced" />
  </div>
</template>

<script setup lang="ts">
import LinkedProjects from '~/components/project/linked-project/LinkedProjects.vue'
import SectionHeader from '~/components/base/SectionHeader.vue'

import useProjectsStore from '~/stores/useProjects'

const LIMIT = 6

const props = withDefaults(
  defineProps<{
    linkedProjects?: any[]
  }>(),
  {
    linkedProjects: () => [],
  }
)
const router = useRouter()
const projectsStore = useProjectsStore()

const goToLinkedProjectsView = () => {
  router.push({
    name: 'projectLinkedProjects',
    params: { slugOrId: projectsStore.currentProjectSlug },
    hash: '#tab',
  })
}

const linkedProjectsSliced = computed(() => props.linkedProjects.slice(0, LIMIT))
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
