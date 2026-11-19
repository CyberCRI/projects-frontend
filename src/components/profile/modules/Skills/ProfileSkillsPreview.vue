<script setup lang="ts">
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseSkill from '~/components/profile/modules/Skills/BaseSkill.vue'
import { USER_MODULE_ICON, USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()
</script>

<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.skills, user.modules.skills)"
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
      <BaseSkill :user="user" :limit="9" preview />
    </template>
  </BaseModulePreview>
</template>
