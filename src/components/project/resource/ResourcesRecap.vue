<template>
  <div class="resources-recap">
    <div class="resources-ctn">
      <SectionHeader
        :button-label="$t('common.see-more')"
        :quantity="links.length + files.length"
        :title="$t('project.resource', links.length + files.length)"
        class="section-header"
        @redirect-button-clicked="goToResourcesPage"
      />

      <div class="resources-block">
        <ResourceCount
          v-if="files.length"
          :count="files.length"
          :is-file="true"
          :target="`/projects/${$route.params.slugOrId}/resources`"
        />

        <ResourceCount
          v-if="links.length"
          :count="links.length"
          :is-file="false"
          :target="`/projects/${$route.params.slugOrId}/resources`"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SectionHeader from '@/components/base/SectionHeader.vue'
import ResourceCount from '@/components/project/resource/ResourceCount.vue'

export default {
  name: 'ResourcesRecap',

  components: { SectionHeader, ResourceCount },

  props: {
    files: {
      type: Array,
      default: () => [],
    },

    links: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    goToResourcesPage() {
      this.$router.push({
        name: 'projectResources',
        params: { slugOrId: this.$route.params.slugOrId },
        hash: '#tab',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.resources-recap .resources-ctn {
  display: flex;
  align-items: stretch;
  justify-content: space-evenly;
  flex-direction: column;
  padding: $space-l 0;
  border-radius: $border-radius-l;
  background: transparent;

  .section-header {
    justify-content: space-between;
  }

  .resources-block {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    gap: $space-l;
    justify-content: space-between;
  }
}
</style>
