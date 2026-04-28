<template>
  <BaseGroupTab :title="$t(GroupModuleTitle[documentType])" :count="countElement">
    <GroupResearcherDocumentsList :doc-type="documentType" :group="group" />
  </BaseGroupTab>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import { GroupModuleTitle } from '~/models/invitation.model'

import type { DocumentType } from '~/interfaces/researcher'

import GroupResearcherDocumentsList from '~/components/people/Researcher/GroupResearcherDocumentsList.vue'

import BaseGroupTab from '~/pages/GroupPageV2/Tabs/BaseGroupTab.vue'

const props = defineProps<{
  documentType: DocumentType
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.[props.documentType] ?? 0)
</script>
