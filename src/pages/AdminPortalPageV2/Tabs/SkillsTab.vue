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

<script setup lang="ts">
import DefaultSkillsAdmin from '@/components/admin/DefaultSkillsAdmin.vue'
import ClassificationAdmin from '@/components/admin/ClassificationAdmin.vue'
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
