<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab :title="$t('profile.bio')">
    <h2 class="inter-title">{{ $t(USER_MODULE_TITLE.needs) }}</h2>
    <BaseResearcherNeeds v-if="!editable" title="" :user="user" />
    <h2 class="inter-title">{{ $t(USER_MODULE_TITLE.availabilities) }}</h2>
    <BaseResearcherAvailabilities v-if="!editable" title="" :user="user" />
  </BaseModuleTab>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';
.inter-title {
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  color: variables.$primary-dark;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
