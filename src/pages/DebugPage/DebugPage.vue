<template>
  <div class="page-section-extra-wide debug-layout">
    <h1 class="page-title">Dev's corner</h1>
    <TabsLayout :align-left="true" :border="false" :tabs="debugTabs" router-view />
  </div>
</template>
<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'

export default {
  name: 'DebugPage',

  components: { TabsLayout },

  computed: {
    debugTabs() {
      return [
        {
          key: 'debug-icons',
          label: 'Icons',
          view: { name: 'DebugIcons' },
          dataTest: 'debug-icons',
          condition: true,
        },
        {
          key: 'debug-onbarding',
          label: 'Onboarding',
          view: { name: 'DebugOnboarding' },
          dataTest: 'debug-onboarding',
          condition: true,
        },
      ]
    },
  },
}
</script>
<style lang="scss" scoped>
.debug-layout {
  margin-top: pxToRem(48px);

  .page-title {
    margin-bottom: $space-xl;
  }
}
</style>
