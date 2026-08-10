<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE[documentType])" :count="countElement">
    <GroupResearcherDocumentsList :doc-type="documentType" :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import type {
  ResearcherDocumentType,
  TranslatedPeopleGroupModel,
} from 'shared-projects-frontend/models'
import GroupResearcherDocumentsList from '~/components/people/Researcher/GroupResearcherDocumentsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  documentType: ResearcherDocumentType
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.[props.documentType] ?? 0)
</script>
