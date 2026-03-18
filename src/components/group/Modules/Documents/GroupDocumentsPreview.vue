<template>
  <BaseGroupPreview
    :id="documentType"
    :title="$t(`group.${documentType}`)"
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
import { DocumentType } from '@/interfaces/researcher'
import { GroupModuleIcon, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'

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
