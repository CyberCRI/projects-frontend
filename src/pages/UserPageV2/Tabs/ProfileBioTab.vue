<script setup lang="ts">
import BaseDescription from '~/components/modules/Abstract/BaseDescription.vue'
import BaseEditBio from '~/components/profile/modules/Bio/BaseEditBio.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab :title="$t('profile.bio')">
    <BaseDescription v-if="!editable" title="" :description="user.$t.description" />
    <BaseEditBio v-else :user="user" />
  </BaseModuleTab>
</template>
