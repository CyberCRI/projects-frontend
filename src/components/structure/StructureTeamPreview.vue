<template>
  <BaseModulePreview
    v-if="group.structure"
    :title="$t(GROUP_MODULE_TITLE.team, group.modules.teams)"
    :icon="GROUP_MODULE_ICON.skills"
    :total="group.modules.teams"
    :see-more="{
      name: 'groupTeams',
      params: {
        groupIdOrSlug: group.slug || group.id,
      },
    }"
  >
    <template #content>
      <BaseStructureTeam :user="user" />
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
