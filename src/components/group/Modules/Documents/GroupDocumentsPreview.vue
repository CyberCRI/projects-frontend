<template>
  <BaseGroupPreview
    :id="documentType"
    :title="$t(GroupModuleTitle[documentType], group.modules[documentType])"
    :total="group.modules[documentType]"
    :see-more="{
      name: routeName,
      params: { groupIdOrSlug: group.slug || group.id },
    }"
    :icon="GroupModuleIcon[documentType]"
  >
    <template #content>
      <GroupResearcherDocumentsList
        preview
        :doc-type="documentType"
        :group="group"
        :limit="LIMIT"
      />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import GroupResearcherDocumentsList from '@/components/people/Researcher/GroupResearcherDocumentsList.vue'
import { GroupModuleIcon, GroupModuleTitle } from '@/models/invitation.model'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'
import type { DocumentType } from '@/interfaces/researcher'

const props = defineProps<{
  documentType: DocumentType
  group: TranslatedPeopleGroupModel
}>()

const routeName = computed(() => {
  switch (props.documentType) {
    case 'conferences':
      return 'groupConferences'
    case 'publications':
      return 'groupPublications'
    default:
      throw new Error(`invalid documenttype ${props.documentType}`)
  }
})

const LIMIT = 3
</script>
