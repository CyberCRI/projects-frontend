<template>
  <div class="tags-tab">
    <div class="block-container">
      <DefaultSkillsAdmin />
    </div>
    <div class="block-container">
      <ClassificationAdmin type="skills" />
    </div>
  </div>
</template>

<script>
import DefaultSkillsAdmin from '@/components/admin/DefaultSkillsAdmin.vue'
import ClassificationAdmin from '@/components/admin/ClassificationAdmin.vue'
export default {
  name: 'SkillsTab',

  components: {
    DefaultSkillsAdmin,
    ClassificationAdmin,
  },
}
</script>

<style lang="scss" scoped>
.block-container {
  padding: $space-l;
  margin: $space-l 0;
  background: $white;
  border-radius: $border-radius-l;
  border: $border-width-s solid $primary;
}
</style>
