<template>
  <div v-if="group.structure">
    <div v-html="content"></div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()

const content = computed(() => props.group.structure.description)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.ai-mark {
  margin-left: auto;
}
</style>
