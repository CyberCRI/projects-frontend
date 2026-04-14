<template>
  <div class="visibility-ctn">
    <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" />
    <div v-else-if="project && project.publication_status" class="visibility">
      <InfoSentence
        :data="visibility"
        :no-centered="true"
        :all-plain="true"
        :black="true"
        size="medium"
        button-size="mbutton"
        :inline="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProjectModel } from '@/models/project.model'

const props = withDefaults(
  defineProps<{
    project?: ProjectModel
    loading?: boolean
  }>(),
  { project: null, loading: true }
)

const visibilityIcon = () => {
  const map = {
    public: 'Eye',
    private: 'EyeSlash',
    org: 'PeopleGroup',
  }
  return map[props.project.publication_status] || ''
}

const visibility = computed(() => {
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
