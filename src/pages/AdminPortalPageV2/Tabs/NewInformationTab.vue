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

<script>
import EventAdminBlock from '@/components/admin/GeneralAdminBlocks/Events/EventAdminBlock.vue'
import InstructionAdminBlock from '@/components/admin/GeneralAdminBlocks/Instructions/InstructionAdminBlock.vue'
import NewsAdminBlock from '@/components/admin/GeneralAdminBlocks/News/NewsAdminBlock.vue'
import FeaturedProjectAdminBlock from '@/components/admin/GeneralAdminBlocks/FeaturedProject/FeaturedProjectAdminBlock.vue'

export default {
  name: 'NewInformationTab',

  components: {
    EventAdminBlock,
    InstructionAdminBlock,
    NewsAdminBlock,
    FeaturedProjectAdminBlock,
  },
}
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
