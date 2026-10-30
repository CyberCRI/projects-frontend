<template>
  <div v-if="user.researcher">
    <div v-html="content"></div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

const props = defineProps<{ user: TranslatedUserModel }>()

const content = computed(() => props.user.researcher.bio)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.ai-mark {
  margin-left: auto;
}
</style>
