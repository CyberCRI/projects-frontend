<script setup lang="ts">
import BaseDescription from '~/components/modules/Abstract/BaseDescription.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab :title="$t('profile.bio')">
    <BaseModuleHeader :editable="editable" />
    <BaseDescription title="" :description="user.$t.description" />
  </BaseModuleTab>
</template>
