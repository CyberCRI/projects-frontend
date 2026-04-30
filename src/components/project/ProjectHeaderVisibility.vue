<template>
  <div class="visibility-ctn skeletons-background">
    <InfoSentence
      v-if="project.publication_status"
      :class="visibility"
      :data="visibility"
      :no-centered="true"
      :all-plain="true"
      :black="true"
      size="medium"
      button-size="mbutton"
      :inline="true"
    />
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '@/models/project.model'
import type { IconImageChoice } from '@/functs/IconImage'

const props = defineProps<{
  project: TranslatedProject
}>()

const visibilityIcon = () => {
  const map: Record<string, IconImageChoice> = {
    public: 'Eye',
    private: 'EyeSlash',
    org: 'PeopleGroup',
  }
  return map[props.project.publication_status] || map.private
}

const visibility = computed<{ icon: IconImageChoice; title: string }>(() => {
  if (!props.project || !props.project.publication_status) {
    return { icon: 'EyeSlash', title: '' }
  }
  return {
    icon: visibilityIcon(),
    title: `header.${props.project.publication_status}`,
  }
})
</script>
<style lang="scss" scoped>
.visibility {
  font-weight: 700;
  font-size: 14px;
  line-height: $line-height-compact;
  color: $primary-dark;
}
</style>
