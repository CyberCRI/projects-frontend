<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseSkill from '~/components/profile/modules/Skills/BaseSkill.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE.skills, user.modules.skills)"
    :count="user.modules.skills"
  >
    <BaseSkill :user="user" :editable="editable" :limit="9" />
  </BaseModuleTab>
</template>
