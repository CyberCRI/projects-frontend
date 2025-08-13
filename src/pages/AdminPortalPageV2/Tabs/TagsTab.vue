<template>
  <div class="tags-tab">
    <div class="block-container">
      <DefaultTagsAdmin />
    </div>

    <div class="block-container">
      <ClassificationAdmin type="projects" />
    </div>
  </div>
</template>

<script>
import DefaultTagsAdmin from '@/components/admin/DefaultTagsAdmin.vue'
import ClassificationAdmin from '@/components/admin/ClassificationAdmin.vue'
export default {
  name: 'TagsTab',

  components: {
    ClassificationAdmin,
    DefaultTagsAdmin,
  },
}
</script>

<style lang="scss" scoped>
.block-container {
  padding: $space-l;
  background: $white;
  border-radius: $border-radius-l;
  border: $border-width-s solid $primary;
}

.block-container ~ .block-container {
  margin-top: $space-l;
}
</style>
