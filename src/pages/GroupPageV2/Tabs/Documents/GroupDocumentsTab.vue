<template>
  <BaseModuleTab :title="$t(GroupModuleTitle[documentType])" :count="countElement">
    <GroupResearcherDocumentsList :doc-type="documentType" :group="group" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import GroupResearcherDocumentsList from '@/components/people/Researcher/GroupResearcherDocumentsList.vue'
import BaseModuleTab from '@/components/modules/BaseModuleTab.vue'
import type { DocumentType } from '@/interfaces/researcher'

import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { GroupModuleTitle } from '@/models/invitation.model'

const props = defineProps<{
  documentType: DocumentType
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.[props.documentType] ?? 0)
</script>
