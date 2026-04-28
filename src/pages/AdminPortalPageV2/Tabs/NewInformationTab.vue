<template>
  <div class="information-tab">
    <section class="admin-section">
      <EventAdminBlock />

      <NewsAdminBlock />

      <InstructionAdminBlock />

      <FeaturedProjectAdminBlock />
    </section>
  </div>
</template>

<script setup lang="ts">
import FeaturedProjectAdminBlock from '~/components/admin/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminBlock.vue'
import InstructionAdminBlock from '~/components/admin/GeneralAdminBlocks/Instructions/InstructionAdminBlock.vue'
import EventAdminBlock from '~/components/admin/GeneralAdminBlocks/Events/EventAdminBlock.vue'
import NewsAdminBlock from '~/components/admin/GeneralAdminBlocks/News/NewsAdminBlock.vue'
</script>

<style lang="scss" scoped>
.information-tab {
  display: flex;
  flex-direction: column;

  .admin-block:first-child {
    padding-top: 0;
  }
}
</style>
