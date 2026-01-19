<template>
  <div class="group-projects">
    <div class="projects">
      <div class="projects-header">
        <h2 class="title">
          {{ $t('group.group-projects') }}
          <span v-show="countElement">( {{ countElement }} )</span>
        </h2>
      </div>
      <div class="projects-container">
        <GroupResearcherDocumentsList :doc-type="documentType" :group="group" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DocumentType } from '@/interfaces/researcher'

import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = defineProps<{
  documentType: DocumentType
  group: TranslatedPeopleGroupModel
}>()

const countElement = computed(() => props.group.modules?.[props.documentType] ?? 0)
</script>

<style lang="scss" scoped>
.group-projects {
  .projects {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: $space-l;

      .title {
        font-weight: 700;
        font-size: $font-size-l;
        color: $primary-dark;
      }
    }

    &-container {
      width: 100%;
    }
  }

  .pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
  }
}
</style>
