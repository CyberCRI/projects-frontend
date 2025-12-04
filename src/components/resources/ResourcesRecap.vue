<template>
  <div class="resources-recap">
    <div class="resources-ctn">
      <SectionHeader
        :button-label="$t('common.see-more')"
        :quantity="links + files"
        :title="$t('project.resource', links + files)"
        class="section-header"
        @redirect-button-clicked="redirect"
      />

      <div class="resources-block">
        <ResourceCount v-if="files" :count="files" :is-file="true" :target="target" />

        <ResourceCount v-if="links" :count="links" :is-file="false" :target="target" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionHeader from '@/components/base/SectionHeader.vue'
import ResourceCount from '@/components/project/resource/ResourceCount.vue'

const router = useRouter()

const props = withDefaults(
  defineProps<{
    files?: number
    links?: number
    target: any
    redirect: any
  }>(),
  { links: 0, files: 0 }
)

const redirect = () => {
  router.push(props.redirect)
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
