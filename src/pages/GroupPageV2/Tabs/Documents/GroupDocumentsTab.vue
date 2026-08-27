<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE[documentType])" :count="countElement">
    <GroupResearcherDocumentsList :document-type="documentType" :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import type {
  ResearcherDocumentType,
  TranslatedPeopleGroupModel,
} from 'shared-projects-frontend/models'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

import GroupResearcherDocumentsList from '~/components/group/Modules/Documents/GroupResearcherDocumentsList.vue'
import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  documentType: ResearcherDocumentType
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.[props.documentType] ?? 0)
</script>
