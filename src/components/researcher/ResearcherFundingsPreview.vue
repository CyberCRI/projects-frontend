<template>
  <BaseModulePreview
    v-if="user.researcher"
    :title="$t(USER_MODULE_TITLE.fundings)"
    :icon="USER_MODULE_ICON.fundings"
  >
    <template #content>
      <BaseResearcherFundings :user="user" />
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
