<template>
  <BaseModuleTab :title="$t(GROUP_MODULE_TITLE[documentType])" :count="countElement">
    <GroupResearcherDocumentsList :doc-type="documentType" :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import GroupResearcherDocumentsList from '~/components/people/Researcher/GroupResearcherDocumentsList.vue'
import type { DocumentType, TranslatedPeopleGroupModel } from 'shared-projects-frontend'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'

import { GROUP_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{
  documentType: DocumentType
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.[props.documentType] ?? 0)
</script>
