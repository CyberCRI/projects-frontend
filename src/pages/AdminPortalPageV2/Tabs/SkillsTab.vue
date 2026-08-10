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
import ClassificationAdmin from '~/components/admin/ClassificationAdmin.vue'
import DefaultSkillsAdmin from '~/components/admin/DefaultSkillsAdmin.vue'
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.block-container {
  padding: variables.$space-l;
  background: variables.$white;
  border-radius: variables.$border-radius-l;
  border: variables.$border-width-s solid variables.$primary;
}

.block-container ~ .block-container {
  margin-top: variables.$space-l;
}
</style>
