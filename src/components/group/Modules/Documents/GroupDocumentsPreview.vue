<template>
  <BaseGroupPreview
    :id="documentType"
    :title="$t(GROUP_MODULE_TITLE[documentType], group.modules[documentType])"
    :total="group.modules[documentType]"
    :see-more="{
      name: routeName,
      params: { groupIdOrSlug: group.slug || group.id },
    }"
    :icon="GROUP_MODULE_ICON[documentType]"
  >
    <template #content>
      <GroupResearcherDocumentsList
        preview
        :document-type="documentType"
        :group="group"
        :limit="LIMIT"
      />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import GroupResearcherDocumentsList from '~/components/group/Modules/Documents/GroupResearcherDocumentsList.vue'
import type {
  TranslatedPeopleGroupModel,
  ResearcherDocumentType,
} from 'shared-projects-frontend/models'
import { GROUP_MODULE_ICON, GROUP_MODULE_TITLE } from '~/functs/constants'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'

const props = defineProps<{
  documentType: ResearcherDocumentType
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
