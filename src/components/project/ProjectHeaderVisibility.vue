<template>
  <div class="visibility-ctn">
    <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" />
    <div v-if="!loading && project && project.publication_status" class="visibility">
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
<script setup>
defineProps({
  project: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: true,
  },
})

function visibilityIcon() {
  const map = {
    public: 'Eye',
    private: 'EyeSlash',
    org: 'PeopleGroup',
  }
  return map[props.project.publication_status] || ''
}

const visibility = computed(() => {
  let ret = ''
  if (props.project.publication_status) {
    let icon = visibilityIcon()
    let title = 'header.' + props.project.publication_status
    ret = { icon, title }
  }
  return ret
})
</script>
<style lang="scss" scoped></style>
