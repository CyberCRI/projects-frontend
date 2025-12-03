<template>
  <div class="resources-recap">
    <div class="resources-ctn">
      <SectionHeader
        :button-label="$t('common.see-more')"
        :quantity="links.length + files.length"
        :title="$t('project.resource', links.length + files.length)"
        class="section-header"
        @redirect-button-clicked="redirect"
      />

      <div class="resources-block">
        <ResourceCount v-if="files.length" :count="files.length" :is-file="true" :target="target" />

        <ResourceCount
          v-if="links.length"
          :count="links.length"
          :is-file="false"
          :target="target"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SectionHeader from '@/components/base/SectionHeader.vue'
import ResourceCount from '@/components/project/resource/ResourceCount.vue'
import { AttachmentFileModel } from '@/models/attachment-file.model'
import { AttachmentLinkModel } from '@/models/attachment-link.model'

const emit = defineEmits(['redirect'])
const router = useRouter()

const props = withDefaults(
  defineProps<{
    files: AttachmentFileModel[]
    links: AttachmentLinkModel[]
    target: any
    redirect: any
  }>(),
  { links: () => [], files: () => [] }
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
