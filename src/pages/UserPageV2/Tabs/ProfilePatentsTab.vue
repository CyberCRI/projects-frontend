<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab :title="$t('profile.bio')">
    <BaseResearcherPatents v-if="!editable" title="" :user="user" />
  </BaseModuleTab>
</template>
