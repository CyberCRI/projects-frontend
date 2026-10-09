<template>
  <BaseModulePreview
    v-if="user.researcher"
    :title="$t(USER_MODULE_TITLE.patents, user.modules.skills)"
    :icon="USER_MODULE_ICON.skills"
    :total="user.modules.skills"
    :see-more="{
      name: 'ProfileSkills',
      params: {
        userIdOrSlug: user.slug || user.id,
      },
    }"
  >
    <template #content>
      <BaseResearcherPatents :user="user" />
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
