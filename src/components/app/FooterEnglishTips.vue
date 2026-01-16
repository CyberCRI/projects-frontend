<template>
  <ToolTip :hover="true" :interactive="true" :secondary="true" :is-text-content="false">
    <template #custom-content>
      <p class="tos-tooltip-content">
        The English version of the {{ itemTitle }} is coming soon. If you need the English version,
        contact us at
        <a href="mailto:projects@learningplanetinstitute.org">
          projects@learningplanetinstitute.org
        </a>
      </p>
    </template>
    <slot />
  </ToolTip>
</template>
<script setup lang="ts">
import ToolTip from '@/components/base/ToolTip.vue'

withDefaults(defineProps<{ itemTitle?: string }>(), { itemTitle: 'page' })
</script>
<style lang="scss" scoped>
.tos-tooltip-content {
  max-width: 20rem;
  padding: 1rem;

  a {
    color: $white;
    text-decoration: underline;
  }
}
</style>
