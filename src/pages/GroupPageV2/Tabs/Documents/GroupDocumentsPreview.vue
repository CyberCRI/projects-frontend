<template>
  <BaseGroupPreview
    :title="$t(`you.${documentType}`)"
    :total="group.modules[documentType]"
    :see-more="{
      name: routeName,
      params: { groupId: group.id },
    }"
    icon="Article"
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
import { DocumentType } from '@/interfaces/researcher'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'

const props = defineProps<{
  documentType: DocumentType
  group: TranslatedPeopleGroupModel
}>()

const routeName = computed(() => {
  if (props.documentType === 'conferences') {
    return 'groupConferences'
  } else if (props.documentType === 'publications') {
    return 'groupPublications'
  }
})

const LIMIT = 3
</script>
